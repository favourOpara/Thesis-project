from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
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


# SHOP VIEWSET
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


# CATEGORY VIEWSET
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# PRODUCT VIEWSET (Supports Image Uploads)
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)  # Allow image uploads

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# PRODUCT IMAGE VIEWSET (Handles Image Uploads)
class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)  # Ensure images can be uploaded

    def perform_create(self, serializer):
        serializer.save()


# OWNER PRODUCT VIEWSET (For Seller's Products)
class OwnerProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user)  # Filter by owner

    def get_object(self):
        return get_object_or_404(self.get_queryset(), pk=self.kwargs['pk'])

    def list(self, request):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        product = self.get_object()
        serializer = self.get_serializer(product)
        return Response(serializer.data)

    def update(self, request, pk=None):
        product = self.get_object()
        serializer = self.get_serializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        product = self.get_object()
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ORDER VIEWSET
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
        quantity = request.data.get('quantity', 1)
        order_item = OrderItem(order=order, product=product, quantity=quantity, price=product.price * quantity)
        order_item.save()
        return Response({'message': 'Item added successfully.'}, status=status.HTTP_201_CREATED)


# ORDER ITEM VIEWSET
class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]


# SHIPPING ADDRESS VIEWSET
class ShippingAddressViewSet(viewsets.ModelViewSet):
    queryset = ShippingAddress.objects.all()
    serializer_class = ShippingAddressSerializer
    permission_classes = [permissions.IsAuthenticated]


# PAYMENT VIEWSET
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
