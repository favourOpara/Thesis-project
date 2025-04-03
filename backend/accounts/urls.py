from django.urls import path
from .views import SignUpView, LoginView, user_info, UpdateProfileView, LogoutView, DeleteAccountView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('signin/', LoginView.as_view(), name='login'),  # Add this line
    path('signout/', LogoutView.as_view(), name='logout'),  # Add this line
    
    path('user-info/', user_info, name='user-info'),
    path("update-profile/", UpdateProfileView.as_view(), name="update-profile"),
    path("delete-account/", DeleteAccountView.as_view(), name="delete-account")
]
