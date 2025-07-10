from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from django.http import JsonResponse
from django.core.files.storage import default_storage
from cloudinary_storage.storage import MediaCloudinaryStorage
from django.conf import settings

from .models import Shop, Category, Product, ProductImage, Order, OrderItem, ShippingAddress, Payment
from .serializers import (
    ShopSerializer,
    CategorySerializer,
    ProductSerializer,
    ProductImageSerializer,
    OrderSerializer,
    OrderItemSerializer,
    ShippingAddressSerializer,
    PaymentSerializer,
)

class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.action in ['list', 'retrieve']:
            return Shop.objects.all()
        return Shop.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# ======= PRODUCT LOGIC SECTION =======
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        queryset = super().get_queryset().filter(
            is_active=True, quantity__gt=0
        )
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(category__icontains=search) |
                Q(sub_category__icontains=search)
            )
        return queryset

    def perform_create(self, serializer):
        # If the request explicitly sets is_active, use it; otherwise, default to True.
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
        # Auto-deactivate if quantity goes to zero
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
            # Auto-deactivate if quantity goes to zero
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

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(buyer=self.request.user)

    def perform_create(self, serializer):
        shop = get_object_or_404(Shop, id=self.request.data.get('shop'))
        serializer.save(buyer=self.request.user, shop=shop)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_item(self, request, pk=None):
        order = self.get_object()
        product = get_object_or_404(Product, id=request.data.get('product'))
        quantity = int(request.data.get('quantity', 1))
        order_item = OrderItem(order=order, product=product, quantity=quantity, price=product.price * quantity)
        order_item.save()
        return Response({'message': 'Item added successfully.'}, status=status.HTTP_201_CREATED)

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]

class ShippingAddressViewSet(viewsets.ModelViewSet):
    queryset = ShippingAddress.objects.all()
    serializer_class = ShippingAddressSerializer
    permission_classes = [permissions.IsAuthenticated]

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

def debug_storage(request):
    """Debug endpoint to check storage configuration"""
    
    # Check what storage Django thinks it's using
    storage_class = default_storage.__class__
    
    # Try to create Cloudinary storage directly
    try:
        cloudinary_storage = MediaCloudinaryStorage()
        cloudinary_works = True
        cloudinary_class = cloudinary_storage.__class__
    except Exception as e:
        cloudinary_works = False
        cloudinary_class = str(e)
    
    return JsonResponse({
        'default_storage_class': str(storage_class),
        'cloudinary_works': cloudinary_works,
        'cloudinary_class': str(cloudinary_class),
        'default_file_storage_setting': getattr(settings, 'DEFAULT_FILE_STORAGE', 'NOT SET'),
        'storages_setting': getattr(settings, 'STORAGES', 'NOT SET'),
    })