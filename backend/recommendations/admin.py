from django.contrib import admin
from .models import OutfitBundle


@admin.register(OutfitBundle)
class OutfitBundleAdmin(admin.ModelAdmin):
    """
    Admin interface for managing outfit bundles.
    Allows creating curated outfit combinations with style themes.
    """
    list_display = ['name', 'theme', 'product_count', 'is_active', 'created_at']
    list_filter = ['theme', 'is_active', 'created_at']
    search_fields = ['name', 'description']
    filter_horizontal = ['products']  # Nice UI for selecting multiple products
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Outfit Information', {
            'fields': ('name', 'theme', 'description')
        }),
        ('Products', {
            'fields': ('products',),
            'description': 'Select 3-4 products that make up this outfit combination'
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        """Optimize queries by prefetching products"""
        queryset = super().get_queryset(request)
        return queryset.prefetch_related('products')
