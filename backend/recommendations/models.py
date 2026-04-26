from django.db import models
from products.models import Product

class OutfitBundle(models.Model):
    """
    Represents a curated outfit combination with a specific style theme.
    Each bundle contains 3-4 complementary products that create a complete look.
    """
    THEME_CHOICES = [
        # General Fashion Themes
        ('office_chic', 'Office Chic'),
        ('casual_friday', 'Casual Friday'),
        ('date_night', 'Date Night'),
        ('weekend_vibes', 'Weekend Vibes'),
        ('athleisure', 'Athleisure'),
        ('brunch_ready', 'Brunch Ready'),
        ('night_out', 'Night Out'),
        ('business_casual', 'Business Casual'),
        ('street_style', 'Street Style'),
        ('beach_day', 'Beach Day'),

        # Gym-Specific Themes
        ('gym_workout', 'Gym Workout'),
        ('yoga_session', 'Yoga Session'),
        ('running_gear', 'Running Gear'),
        ('training_essentials', 'Training Essentials'),
        ('fitness_focus', 'Fitness Focus'),
        ('cardio_ready', 'Cardio Ready'),
        ('strength_training', 'Strength Training'),
        ('active_recovery', 'Active Recovery'),
    ]

    name = models.CharField(max_length=255, help_text="Catchy name for the outfit (e.g., 'Power Suit Ensemble')")
    theme = models.CharField(max_length=50, choices=THEME_CHOICES, help_text="Style theme for this outfit")
    description = models.TextField(blank=True, null=True, help_text="Optional description of the outfit styling")
    products = models.ManyToManyField(Product, related_name='outfit_bundles', help_text="3-4 products that make up this outfit")
    is_active = models.BooleanField(default=True, help_text="Whether this outfit should be shown to users")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Outfit Bundle'
        verbose_name_plural = 'Outfit Bundles'

    def __str__(self):
        return f"{self.get_theme_display()} - {self.name}"

    def product_count(self):
        """Returns the number of products in this bundle"""
        return self.products.count()

    product_count.short_description = 'Products'
