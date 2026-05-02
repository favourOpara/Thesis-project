from django.db import models
from django.utils.text import slugify
from accounts.models import CustomUser


class Shop(models.Model):
    owner = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='shop')
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    logo = models.ImageField(upload_to='shops/logos/', blank=True, null=True)
    banner_image = models.ImageField(upload_to='shops/banners/', blank=True, null=True)
    whatsapp = models.CharField(max_length=20, blank=True, null=True, help_text="WhatsApp number including country code")
    instagram = models.CharField(max_length=100, blank=True, null=True, help_text="Instagram handle without @")
    website = models.URLField(blank=True, null=True)
    visit_count = models.PositiveIntegerField(default=0)

    # Storefront display controls
    LAYOUT_CHOICES = [('all', 'All Products'), ('categories', 'By Category')]
    SORT_CHOICES = [('newest', 'Newest First'), ('price_asc', 'Price: Low to High'), ('price_desc', 'Price: High to Low')]
    STATUS_CHOICES = [('open', 'Open'), ('closed', 'Temporarily Closed')]

    tagline = models.CharField(max_length=120, blank=True, null=True)
    layout_mode = models.CharField(max_length=20, choices=LAYOUT_CHOICES, default='all')
    sort_order = models.CharField(max_length=20, choices=SORT_CHOICES, default='newest')
    store_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    store_status_message = models.CharField(max_length=200, blank=True, null=True)

    # Premium
    is_premium = models.BooleanField(default=False)
    premium_since = models.DateTimeField(null=True, blank=True)
    premium_cancelled_at = models.DateTimeField(
        null=True, blank=True,
        help_text="Timestamp of last cancellation — used to enforce 24-hour resubscribe cooldown"
    )
    premium_expires_at = models.DateTimeField(
        null=True, blank=True,
        help_text="Access continues until this date after cancellation (end of paid billing period)"
    )
    store_video_url = models.URLField(
        blank=True, null=True,
        help_text="YouTube or Vimeo URL for the store promo video"
    )
    store_video_file = models.FileField(
        upload_to='store_videos/', blank=True, null=True,
        help_text="Uploaded video file"
    )
    # Paystack subscription (for recurring billing)
    paystack_customer_code      = models.CharField(max_length=100, blank=True, null=True)
    paystack_subscription_code  = models.CharField(max_length=100, blank=True, null=True)
    paystack_email_token        = models.CharField(max_length=200, blank=True, null=True)
    paystack_authorization_code = models.CharField(
        max_length=200, blank=True, null=True,
        help_text="Card authorization code — used to create a subscription without a new payment"
    )

    # Store content section positioning
    PRODUCTS_POSITION_CHOICES = [('first', 'Products First'), ('last', 'Products Last')]
    products_position = models.CharField(
        max_length=10, choices=PRODUCTS_POSITION_CHOICES, default='first',
        help_text="Whether the products grid appears before or after the custom content section"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Shop.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class StoreContentSection(models.Model):
    """A landscape image-grid section sellers can add to their store page."""
    LAYOUT_CHOICES = [
        ('1col', 'Single image (full width)'),
        ('2col', 'Two columns'),
        ('3col', 'Three columns'),
        ('2-1', 'Large left + small right'),
        ('1-2', 'Small left + large right'),
    ]
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='content_sections')
    layout = models.CharField(max_length=10, choices=LAYOUT_CHOICES, default='2col')
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', 'id']

    def __str__(self):
        return f"Section for {self.shop.name} (layout={self.layout})"


class SectionImage(models.Model):
    """An individual image within a StoreContentSection."""
    section = models.ForeignKey(StoreContentSection, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='store_sections/')
    linked_category = models.CharField(
        max_length=255, blank=True, null=True,
        help_text="When clicked, filters the store's product list to this category"
    )
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'id']

    def __str__(self):
        return f"Image for section {self.section_id}"


class StoreTextBlock(models.Model):
    """Premium-only editorial text blocks a seller can place between product rows."""
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='text_blocks')
    title = models.CharField(max_length=200, blank=True, null=True)
    content = models.TextField()
    insert_after = models.PositiveIntegerField(
        default=0,
        help_text="Show this block after the nth product (0 = before all products)"
    )
    tile_color = models.CharField(
        max_length=20, blank=True, null=True, default="#0f172a",
        help_text="Hex color for the left-border tile accent"
    )

    class Meta:
        ordering = ['insert_after', 'id']

    def __str__(self):
        return f"Block for {self.shop.name} (after #{self.insert_after})"


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    SIZE_CHOICES = [
        ('XS', 'Extra Small'),
        ('S', 'Small'),
        ('M', 'Medium'),
        ('L', 'Large'),
        ('XL', 'Extra Large'),
        ('XXL', '2XL'),
        ('XXXL', '3XL'),
        ('4XL', '4XL'),
        ('5XL', '5XL'),
        ('6XL', '6XL'),
        ('Free Size', 'Free Size'),
        ('EU 36', 'EU 36'),
        ('EU 37', 'EU 37'),
        ('EU 38', 'EU 38'),
        ('EU 39', 'EU 39'),
        ('EU 40', 'EU 40'),
        ('EU 41', 'EU 41'),
        ('EU 42', 'EU 42'),
        ('EU 43', 'EU 43'),
        ('EU 44', 'EU 44'),
        ('EU 45', 'EU 45'),
        ('EU 46', 'EU 46'),
        ('US 6', 'US 6'),
        ('US 7', 'US 7'),
        ('US 8', 'US 8'),
        ('US 9', 'US 9'),
        ('US 10', 'US 10'),
        ('US 11', 'US 11'),
        ('US 12', 'US 12'),
        ('0-3M', '0-3 Months'),
        ('3-6M', '3-6 Months'),
        ('6-12M', '6-12 Months'),
        ('1-2Y', '1-2 Years'),
        ('2-3Y', '2-3 Years'),
        ('3-4Y', '3-4 Years'),
        ('4-5Y', '4-5 Years'),
        ('5-6Y', '5-6 Years'),
        ('6-7Y', '6-7 Years'),
        ('7-8Y', '7-8 Years'),
        ('8-9Y', '8-9 Years'),
        ('9-10Y', '9-10 Years'),
        ('Custom', 'Custom (Specify in Description)'),
    ]

    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='products', null=True, blank=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    sub_category = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=19, decimal_places=2)
    quantity = models.PositiveIntegerField(default=0)
    material_type = models.CharField(max_length=255, blank=True, null=True)
    brand = models.CharField(max_length=255, null=True, blank=True)
    size = models.TextField(blank=True, default="", help_text="Comma-separated sizes stored here for indexing; authoritative data is in variants")
    variants = models.JSONField(
        null=True, blank=True,
        help_text='Per-size stock: [{"size": "S", "qty": 5}, {"size": "M", "qty": 3}]'
    )
    extra_fields = models.JSONField(
        null=True, blank=True,
        help_text='Category-specific fields: {"storage": "128GB", "ram": "8GB", ...}'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    order = models.PositiveIntegerField(default=0, help_text="Display order (lower = earlier)")

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"Image for {self.product.name}"


