from django.db import models
from django.conf import settings
from django.db.models import Sum
from products.models import Product


class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cart"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart — {self.user.email}"

    @property
    def total(self):
        return sum(item.subtotal for item in self.items.select_related("product").all())

    @property
    def item_count(self):
        return self.items.aggregate(n=Sum("quantity"))["n"] or 0


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ("cart", "product")

    @property
    def subtotal(self):
        return float(self.product.price) * self.quantity

    def __str__(self):
        return f"{self.quantity} × {self.product.name}"
