from django.urls import path
from .views import RecommendedForYouView, StylingOutfitView, GymWearsBundleView

urlpatterns = [
    path('recommended-for-you/', RecommendedForYouView.as_view(), name='recommended-for-you'),
    path('styling-outfit/', StylingOutfitView.as_view(), name='styling-outfit'),
    path('gym-wears/', GymWearsBundleView.as_view(), name='gym-wears'),
]
