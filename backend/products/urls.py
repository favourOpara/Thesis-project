from django.urls import path
from .views import (
    ShopViewSet,
    CategoryViewSet,
    ProductViewSet,
    ProductImageViewSet,
    OrderViewSet,
    OrderItemViewSet,
    ShippingAddressViewSet,
    PaymentViewSet,
    OwnerProductViewSet,
)

urlpatterns = [
    # Shop URLs
    path('shops/', ShopViewSet.as_view({'get': 'list', 'post': 'create'}), name='shop-list'),
    path('shops/<int:pk>/', ShopViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='shop-detail'),

    # Category URLs
    path('categories/', CategoryViewSet.as_view({'get': 'list', 'post': 'create'}), name='category-list'),
    path('categories/<int:pk>/', CategoryViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='category-detail'),

    # Product URLs
    path('products/', ProductViewSet.as_view({'get': 'list'}), name='product-list'),
    path('products/<int:pk>/', ProductViewSet.as_view({'get': 'retrieve'}), name='product-detail'),
    # path('products/<int:pk>/add-image/', ProductViewSet.as_view({'post': 'add_image'}), name='product-add-image'),

    path('owner-products/', OwnerProductViewSet.as_view({'get': 'list', 'post': 'create'}), name='owner-products-list-create'),
    path('owner-products/<int:pk>/', OwnerProductViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='owner-products-detail'),

    # Product Image URLs
    path('product-images/', ProductImageViewSet.as_view({'get': 'list', 'post': 'create'}), name='product-image-list'),
    path('product-images/<int:pk>/', ProductImageViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='product-image-detail'),

    # Order URLs
    path('orders/', OrderViewSet.as_view({'get': 'list', 'post': 'create'}), name='order-list'),
    path('orders/<int:pk>/', OrderViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='order-detail'),
    path('orders/<int:pk>/add-item/', OrderViewSet.as_view({'post': 'add_item'}), name='order-add-item'),

    # Order Item URLs
    path('order-items/', OrderItemViewSet.as_view({'get': 'list', 'post': 'create'}), name='order-item-list'),
    path('order-items/<int:pk>/', OrderItemViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='order-item-detail'),

    # Shipping Address URLs
    path('shipping-addresses/', ShippingAddressViewSet.as_view({'get': 'list', 'post': 'create'}), name='shipping-address-list'),
    path('shipping-addresses/<int:pk>/', ShippingAddressViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='shipping-address-detail'),

    # Payment URLs
    path('payments/', PaymentViewSet.as_view({'get': 'list', 'post': 'create'}), name='payment-list'),
    path('payments/<int:pk>/', PaymentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='payment-detail'),
]
