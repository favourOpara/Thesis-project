from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Q
from django.utils import timezone
import requests as http_requests

from .models import Shop, Category, Product, ProductImage, StoreTextBlock
from .serializers import (
    ShopSerializer,
    CategorySerializer,
    ProductSerializer,
    ProductImageSerializer,
    StoreTextBlockSerializer,
)

PAYSTACK_SECRET = "sk_test_3207e50dafa844fb486185ea7aceed100089ff21"


class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    parser_classes = (MultiPartParser, FormParser)
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'record_visit', 'products']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def _has_active_products(self, shop):
        return shop.owner.products.filter(is_active=True).exists()

    def _is_owner(self, shop):
        return (
            self.request.user.is_authenticated
            and self.request.user == shop.owner
        )

    def get_queryset(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return Shop.objects.filter(owner=self.request.user)
        queryset = Shop.objects.all()
        # Public listing/searching: only expose shops that have at least one active product
        if self.action in ['list']:
            queryset = queryset.filter(
                owner__products__is_active=True
            ).distinct()
        category = self.request.query_params.get('category')
        ordering = self.request.query_params.get('ordering')
        if category:
            queryset = queryset.filter(
                owner__products__category__iexact=category,
                owner__products__is_active=True
            ).distinct()
        if ordering in ['visit_count', '-visit_count', 'created_at', '-created_at', 'name', '-name']:
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('-created_at')
        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not self._has_active_products(instance) and not self._is_owner(instance):
            from rest_framework.exceptions import NotFound
            raise NotFound("Shop not found.")
        serializer = self.get_serializer(instance, context={'request': request})
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'], url_path='mine', permission_classes=[permissions.IsAuthenticated])
    def mine(self, request):
        try:
            shop = Shop.objects.get(owner=request.user)
            serializer = self.get_serializer(shop, context={'request': request})
            return Response(serializer.data)
        except Shop.DoesNotExist:
            return Response(None)

    @action(detail=True, methods=['post'], url_path='visit')
    def record_visit(self, request, slug=None):
        shop = self.get_object()
        # Don't count visits for shops with no active products
        if not self._has_active_products(shop):
            return Response({'visit_count': shop.visit_count})
        Shop.objects.filter(pk=shop.pk).update(visit_count=shop.visit_count + 1)
        return Response({'visit_count': shop.visit_count + 1})

    @action(detail=True, methods=['get'], url_path='products')
    def products(self, request, slug=None):
        shop = self.get_object()
        # Block public access to product list if shop has no active products
        if not self._has_active_products(shop) and not self._is_owner(shop):
            return Response([])
        queryset = Product.objects.filter(owner=shop.owner, is_active=True)
        serializer = ProductSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='upgrade-premium',
            permission_classes=[permissions.IsAuthenticated],
            parser_classes=[JSONParser, MultiPartParser, FormParser])
    def upgrade_premium(self, request):
        reference = request.data.get('reference')
        if not reference:
            return Response({'error': 'Payment reference is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            shop = Shop.objects.get(owner=request.user)
        except Shop.DoesNotExist:
            return Response({'error': 'You do not have a shop.'}, status=status.HTTP_404_NOT_FOUND)
        if shop.is_premium:
            return Response({'detail': 'Already premium.'})
        # Verify payment with Paystack
        verify_url = f"https://api.paystack.co/transaction/verify/{reference}"
        headers = {'Authorization': f'Bearer {PAYSTACK_SECRET}'}
        try:
            res = http_requests.get(verify_url, headers=headers, timeout=10)
            data = res.json()
        except Exception:
            return Response({'error': 'Could not reach Paystack. Try again.'}, status=status.HTTP_502_BAD_GATEWAY)
        if not data.get('status') or data['data'].get('status') != 'success':
            return Response({'error': 'Payment verification failed. Please complete payment first.'}, status=status.HTTP_402_PAYMENT_REQUIRED)
        shop.is_premium = True
        shop.premium_since = timezone.now()
        shop.save(update_fields=['is_premium', 'premium_since'])
        serializer = self.get_serializer(shop, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='update-video',
            permission_classes=[permissions.IsAuthenticated],
            parser_classes=[JSONParser, MultiPartParser, FormParser])
    def update_video(self, request, slug=None):
        shop = self.get_object()
        if shop.owner != request.user:
            return Response({'error': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)
        if not shop.is_premium:
            return Response({'error': 'Premium required.'}, status=status.HTTP_403_FORBIDDEN)
        shop.store_video_url = request.data.get('store_video_url', '')
        shop.save(update_fields=['store_video_url'])
        return Response({'store_video_url': shop.store_video_url})

    @action(detail=True, methods=['get', 'post'], url_path='text-blocks',
            permission_classes=[permissions.IsAuthenticated])
    def text_blocks(self, request, slug=None):
        shop = self.get_object()
        if shop.owner != request.user:
            return Response({'error': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)
        if not shop.is_premium:
            return Response({'error': 'Premium required.'}, status=status.HTTP_403_FORBIDDEN)
        if request.method == 'GET':
            blocks = shop.text_blocks.all()
            return Response(StoreTextBlockSerializer(blocks, many=True).data)
        serializer = StoreTextBlockSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(shop=shop)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch', 'delete'], url_path=r'text-blocks/(?P<block_id>\d+)',
            permission_classes=[permissions.IsAuthenticated])
    def text_block_detail(self, request, slug=None, block_id=None):
        shop = self.get_object()
        if shop.owner != request.user:
            return Response({'error': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)
        block = get_object_or_404(StoreTextBlock, pk=block_id, shop=shop)
        if request.method == 'DELETE':
            block.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        serializer = StoreTextBlockSerializer(block, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        queryset = super().get_queryset().filter(is_active=True, quantity__gt=0)
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(category__icontains=search) |
                Q(sub_category__icontains=search)
            )
        return queryset

    def perform_create(self, serializer):
        is_active = self.request.data.get('is_active')
        if is_active is not None:
            is_active = str(is_active).lower() in ['true', '1', 'yes']
        else:
            is_active = True
        product = serializer.save(owner=self.request.user, is_active=is_active)
        images = self.request.FILES.getlist('images')
        for image in images:
            ProductImage.objects.create(product=product, image=image)

    def perform_update(self, serializer):
        product = serializer.save()
        if product.quantity == 0 and product.is_active:
            product.is_active = False
            product.save(update_fields=['is_active'])
        images = self.request.FILES.getlist('images')
        if images:
            product.images.all().delete()
            for image in images:
                ProductImage.objects.create(product=product, image=image)


class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        serializer.save()


class OwnerProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user)

    def get_object(self):
        return get_object_or_404(self.get_queryset(), pk=self.kwargs['pk'])

    def list(self, request):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def create(self, request):
        is_active = request.data.get('is_active')
        if is_active is not None:
            is_active = str(is_active).lower() in ['true', '1', 'yes']
        else:
            is_active = True
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save(owner=self.request.user, is_active=is_active)
            images = request.FILES.getlist('images')
            for image in images:
                ProductImage.objects.create(product=product, image=image)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        product = self.get_object()
        serializer = self.get_serializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            product = serializer.save()
            if product.quantity == 0 and product.is_active:
                product.is_active = False
                product.save(update_fields=['is_active'])
            images = request.FILES.getlist('images')
            if images:
                product.images.all().delete()
                for image in images:
                    ProductImage.objects.create(product=product, image=image)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        product = self.get_object()
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
