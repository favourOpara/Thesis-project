from django.db import models
from django.conf import settings
from products.models import Product


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending",    "Pending Payment"),
        ("paid",       "Paid"),
        ("processing", "Processing"),
        ("shipped",    "Shipped"),
        ("delivered",  "Delivered"),
        ("cancelled",  "Cancelled"),
        ("refunded",   "Refunded"),
    ]

    buyer            = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders"
    )
    status           = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    shipping_name    = models.CharField(max_length=255)
    shipping_phone   = models.CharField(max_length=20)
    shipping_address = models.TextField()
    shipping_city    = models.CharField(max_length=100)
    shipping_state   = models.CharField(max_length=100)

    subtotal         = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    discount_amount  = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_amount     = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    payment_ref      = models.CharField(max_length=200, blank=True, null=True, unique=True)
    payment_status   = models.CharField(
        max_length=20,
        choices=[("unpaid", "Unpaid"), ("paid", "Paid"), ("failed", "Failed")],
        default="unpaid",
    )
    points_earned    = models.PositiveIntegerField(default=0)
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order #{self.id} — {self.buyer.email}"

    def calculate_points(self):
        """1 loyalty point per ₦100 spent."""
        return int(float(self.total_amount) / 100)


class OrderItem(models.Model):
    order      = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product    = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    seller     = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name="sales"
    )
    product_name  = models.CharField(max_length=255)   # snapshot at time of purchase
    unit_price    = models.DecimalField(max_digits=12, decimal_places=2)
    quantity      = models.PositiveIntegerField()

    @property
    def subtotal(self):
        return float(self.unit_price) * self.quantity

    def __str__(self):
        return f"{self.quantity} × {self.product_name}"
