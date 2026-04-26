from django.db import models
from django.conf import settings
from django.utils import timezone


class SubscriptionPlan(models.Model):
    TIER_CHOICES = [
        ("free",   "Free"),
        ("growth", "Growth"),
        ("pro",    "Pro"),
    ]

    tier                 = models.CharField(max_length=10, choices=TIER_CHOICES, unique=True)
    name                 = models.CharField(max_length=50)
    monthly_price        = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_products         = models.PositiveIntegerField(default=10)
    promoted_listings    = models.BooleanField(default=False)
    priority_search      = models.BooleanField(default=False)
    verified_badge       = models.BooleanField(default=False)
    featured_on_homepage = models.BooleanField(default=False)
    social_promotion     = models.BooleanField(default=False)
    analytics_access     = models.BooleanField(default=False)
    description          = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} — ₦{self.monthly_price:,.0f}/mo"


class SellerSubscription(models.Model):
    seller     = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="subscription"
    )
    plan       = models.ForeignKey(SubscriptionPlan, on_delete=models.PROTECT)
    started_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active  = models.BooleanField(default=True)
    payment_ref = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"{self.seller.email} → {self.plan.name}"

    @property
    def is_valid(self):
        if not self.is_active:
            return False
        if self.expires_at and self.expires_at < timezone.now():
            return False
        return True
