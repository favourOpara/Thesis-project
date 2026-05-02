from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    ShopViewSet,
    CategoryViewSet,
    ProductViewSet,
    ProductImageViewSet,
    OwnerProductViewSet,
)

urlpatterns = [
    # Shop URLs (public — lookup by slug)
    path('shops/', ShopViewSet.as_view({'get': 'list', 'post': 'create'}), name='shop-list'),
    path('shops/mine/', ShopViewSet.as_view({'get': 'mine'}), name='shop-mine'),
    path('shops/init-premium-payment/', ShopViewSet.as_view({'post': 'init_premium_payment'}), name='shop-init-premium-payment'),
    path('shops/upgrade-premium/', ShopViewSet.as_view({'post': 'upgrade_premium'}), name='shop-upgrade-premium'),
    path('shops/cancel-premium/', ShopViewSet.as_view({'post': 'cancel_premium'}), name='shop-cancel-premium'),
    path('shops/<slug:slug>/', ShopViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='shop-detail'),
    path('shops/<slug:slug>/visit/', ShopViewSet.as_view({'post': 'record_visit'}), name='shop-visit'),
    path('shops/<slug:slug>/products/', ShopViewSet.as_view({'get': 'products'}), name='shop-products'),
    path('shops/<slug:slug>/update-video/', ShopViewSet.as_view({'patch': 'update_video'}), name='shop-update-video'),
    path('shops/<slug:slug>/text-blocks/', ShopViewSet.as_view({'get': 'text_blocks', 'post': 'text_blocks'}), name='shop-text-blocks'),
    path('shops/<slug:slug>/text-blocks/<int:block_id>/', ShopViewSet.as_view({'patch': 'text_block_detail', 'delete': 'text_block_detail'}), name='shop-text-block-detail'),

    # Category URLs
    path('categories/', CategoryViewSet.as_view({'get': 'list', 'post': 'create'}), name='category-list'),
    path('categories/<int:pk>/', CategoryViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='category-detail'),

    # Public product URLs
    path('products/', ProductViewSet.as_view({'get': 'list'}), name='product-list'),
    path('products/<int:pk>/', ProductViewSet.as_view({'get': 'retrieve'}), name='product-detail'),

    # Seller-owned product URLs
    path('owner-products/', OwnerProductViewSet.as_view({'get': 'list', 'post': 'create'}), name='owner-products-list-create'),
    path('owner-products/<int:pk>/', OwnerProductViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='owner-products-detail'),

    # Product Image URLs
    path('product-images/', ProductImageViewSet.as_view({'get': 'list', 'post': 'create'}), name='product-image-list'),
    path('product-images/<int:pk>/', ProductImageViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='product-image-detail'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
