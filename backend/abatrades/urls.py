from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Django Admin Panel
    path('admin/', admin.site.urls),

    # API Endpoints for different apps
    path('api/', include('accounts.urls')), 
    path('api/', include('products.urls')),
    path('api/', include('cart.urls')),
    path('api/', include('recommendations.urls')),

    # Authentication Routes
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/social/login/', include('allauth.socialaccount.urls')),  # Google Login Endpoint
]

#  Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
