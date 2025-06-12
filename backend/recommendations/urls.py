from django.urls import path
from .views import RecommendedForYouView

urlpatterns = [
    path('recommended-for-you/', RecommendedForYouView.as_view(), name='recommended-for-you'),
]
