from django.contrib import admin
from .models import SubscriptionPlan, SellerSubscription


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ["name", "tier", "monthly_price", "max_products", "verified_badge"]


@admin.register(SellerSubscription)
class SellerSubscriptionAdmin(admin.ModelAdmin):
    list_display = ["seller", "plan", "is_active", "expires_at", "started_at"]
    list_filter  = ["is_active", "plan"]
