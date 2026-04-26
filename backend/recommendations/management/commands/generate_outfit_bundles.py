"""
Django management command to auto-generate outfit bundles based on brand and product categories.

Usage:
    python manage.py generate_outfit_bundles
    python manage.py generate_outfit_bundles --clear  # Clear existing auto-generated bundles first
"""

from django.core.management.base import BaseCommand
from django.db.models import Count, Q
from products.models import Product
from recommendations.models import OutfitBundle
from collections import defaultdict
import random


class Command(BaseCommand):
    help = 'Auto-generate outfit bundles based on brand and complementary product categories'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing auto-generated bundles before creating new ones',
        )
        parser.add_argument(
            '--min-products',
            type=int,
            default=3,
            help='Minimum number of products needed from a brand to create a bundle',
        )

    def handle(self, *args, **options):
        clear_existing = options['clear']
        min_products = options['min_products']

        self.stdout.write(self.style.SUCCESS('Starting outfit bundle generation...'))

        # Clear existing auto-generated bundles if requested
        if clear_existing:
            deleted_count = OutfitBundle.objects.filter(
                description__contains='[AUTO-GENERATED]'
            ).count()
            OutfitBundle.objects.filter(description__contains='[AUTO-GENERATED]').delete()
            self.stdout.write(self.style.WARNING(f'Cleared {deleted_count} existing auto-generated bundles'))

        # Get all active products with brands
        products = Product.objects.filter(
            is_active=True,
            brand__isnull=False
        ).exclude(brand='')

        # Group products by brand
        brand_products = defaultdict(list)
        for product in products:
            brand_products[product.brand.lower().strip()].append(product)

        bundles_created = 0

        # For each brand, try to create outfit bundles
        for brand, brand_product_list in brand_products.items():
            if len(brand_product_list) < min_products:
                continue

            # Create bundles for this brand
            created = self._create_bundles_for_brand(brand, brand_product_list)
            bundles_created += created

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {bundles_created} outfit bundles!')
        )

    def _create_bundles_for_brand(self, brand, products):
        """Create outfit bundles for a specific brand"""
        bundles_created = 0

        # Categorize products
        categorized = self._categorize_products(products)

        # Define complementary category sets
        outfit_templates = [
            # Full outfit combinations
            {
                'categories': ['tops', 'bottoms', 'shoes', 'accessories'],
                'min_required': 3,
                'theme': 'casual_friday',
                'name_template': '{brand} Casual Ensemble'
            },
            {
                'categories': ['tops', 'bottoms', 'shoes'],
                'min_required': 3,
                'theme': 'weekend_vibes',
                'name_template': '{brand} Weekend Style'
            },
            {
                'categories': ['dresses', 'shoes', 'accessories'],
                'min_required': 2,
                'theme': 'date_night',
                'name_template': '{brand} Date Night Look'
            },
            {
                'categories': ['activewear', 'shoes', 'accessories'],
                'min_required': 2,
                'theme': 'athleisure',
                'name_template': '{brand} Active Collection'
            },
            {
                'categories': ['formal', 'shoes', 'accessories'],
                'min_required': 2,
                'theme': 'office_chic',
                'name_template': '{brand} Office Ready'
            },
        ]

        # Try each template
        for template in outfit_templates:
            bundle = self._try_create_bundle(brand, categorized, template)
            if bundle:
                bundles_created += 1

        return bundles_created

    def _categorize_products(self, products):
        """Categorize products into logical groups"""
        categories = {
            'tops': [],
            'bottoms': [],
            'dresses': [],
            'shoes': [],
            'accessories': [],
            'activewear': [],
            'formal': [],
            'outerwear': []
        }

        for product in products:
            category_lower = product.category.lower()
            sub_category_lower = product.sub_category.lower() if product.sub_category else ''
            name_lower = product.name.lower()
            combined = f"{category_lower} {sub_category_lower} {name_lower}"

            # Categorize based on keywords
            if any(kw in combined for kw in ['shirt', 'blouse', 'top', 't-shirt', 'tee', 'tank']):
                categories['tops'].append(product)
            elif any(kw in combined for kw in ['pant', 'trouser', 'jean', 'short', 'skirt']):
                categories['bottoms'].append(product)
            elif any(kw in combined for kw in ['dress', 'gown']):
                categories['dresses'].append(product)
            elif any(kw in combined for kw in ['shoe', 'sneaker', 'boot', 'sandal', 'heel']):
                categories['shoes'].append(product)
            elif any(kw in combined for kw in ['bag', 'purse', 'wallet', 'belt', 'watch', 'jewelry', 'accessory', 'hat', 'scarf']):
                categories['accessories'].append(product)
            elif any(kw in combined for kw in ['gym', 'sport', 'athletic', 'workout', 'activewear', 'jogger', 'legging']):
                categories['activewear'].append(product)
            elif any(kw in combined for kw in ['suit', 'blazer', 'formal', 'business']):
                categories['formal'].append(product)
            elif any(kw in combined for kw in ['jacket', 'coat', 'cardigan', 'hoodie', 'sweater']):
                categories['outerwear'].append(product)
            else:
                # Default categorization
                if 'clothing' in category_lower or 'apparel' in category_lower:
                    categories['tops'].append(product)

        return categories

    def _try_create_bundle(self, brand, categorized, template):
        """Try to create a bundle based on a template"""
        selected_products = []

        # Try to get one product from each required category
        for cat in template['categories']:
            if categorized[cat]:
                # Randomly select one product from this category
                product = random.choice(categorized[cat])
                selected_products.append(product)

        # Check if we have enough products
        if len(selected_products) < template['min_required']:
            return None

        # Limit to 4 products max
        selected_products = selected_products[:4]

        # Check if this exact combination already exists
        existing = OutfitBundle.objects.filter(
            theme=template['theme'],
            name=template['name_template'].format(brand=brand.title())
        ).first()

        if existing:
            return None

        # Create the bundle
        bundle = OutfitBundle.objects.create(
            name=template['name_template'].format(brand=brand.title()),
            theme=template['theme'],
            description=f"Auto-curated {brand.title()} collection featuring complementary pieces. [AUTO-GENERATED]",
            is_active=True
        )

        # Add products to the bundle
        bundle.products.set(selected_products)
        bundle.save()

        return bundle
