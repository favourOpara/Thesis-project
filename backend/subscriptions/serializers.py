from rest_framework import serializers
from .models import SubscriptionPlan, SellerSubscription


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model  = SubscriptionPlan
        fields = [
            "id", "tier", "name", "monthly_price", "max_products",
            "promoted_listings", "priority_search", "verified_badge",
            "featured_on_homepage", "social_promotion", "analytics_access",
            "description",
        ]


class SellerSubscriptionSerializer(serializers.ModelSerializer):
    plan    = SubscriptionPlanSerializer(read_only=True)
    is_valid = serializers.ReadOnlyField()

    class Meta:
        model  = SellerSubscription
        fields = ["id", "plan", "started_at", "expires_at", "is_active", "is_valid"]
