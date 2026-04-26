from django.db import models
from products.models import Shop, Product


class Inquiry(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='inquiries')
    product = models.ForeignKey(
        Product, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='inquiries',
        help_text="Leave blank for a general shop inquiry"
    )
    visitor_name = models.CharField(max_length=255)
    visitor_email = models.EmailField()
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Inquiry'
        verbose_name_plural = 'Inquiries'

    def __str__(self):
        product_ref = f" re: {self.product.name}" if self.product else ""
        return f"Inquiry from {self.visitor_name} → {self.shop.name}{product_ref}"
