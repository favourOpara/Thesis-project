"""
Django signals for automatic outfit bundle generation.

This module automatically generates outfit bundles when sellers add or update products.
"""

from django.db.models.signals import post_save
from django.dispatch import receiver
from products.models import Product
from recommendations.models import OutfitBundle
from collections import defaultdict
import random


@receiver(post_save, sender=Product)
def auto_generate_outfit_bundle(sender, instance, created, **kwargs):
    """
    Automatically generate or update outfit bundles when a product is created or updated.

    This function:
    1. Tries to create same-brand bundles if enough products exist
    2. Falls back to mixed-brand bundles based on complementary categories
    3. Ensures diverse outfit recommendations
    """

    # Only process if product is active
    if not instance.is_active:
        return

    # Try same-brand bundles first if product has a brand
    if instance.brand:
        brand = instance.brand.lower().strip()
        brand_products = Product.objects.filter(
            is_active=True,
            brand__iexact=brand
        )

        # If enough products from same brand, create brand-specific bundles
        if brand_products.count() >= 3:
            _generate_bundles_for_brand(brand, list(brand_products))
            return

    # Fallback: Create mixed-brand bundles from all available products
    # Even with fewer products, try to create what we can
    all_products = Product.objects.filter(is_active=True)

    if all_products.count() >= 2:  # Reduced minimum from 3 to 2
        _generate_mixed_brand_bundles(list(all_products))


def _categorize_products(products):
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

        # Categorize based on expanded keywords
        # TOPS: shirts, blouses, tops, etc.
        if any(kw in combined for kw in [
            'shirt', 'blouse', 'top', 't-shirt', 'tee', 'tank', 'polo', 'tunic',
            'camisole', 'halter', 'crop', 'vest', 'waistcoat', 'bodysuit', 'cami',
            'henley', 'turtleneck', 'sweater vest', 'pullover'
        ]):
            categories['tops'].append(product)

        # BOTTOMS: pants, skirts, shorts, etc.
        elif any(kw in combined for kw in [
            'pant', 'trouser', 'jean', 'short', 'skirt', 'chino', 'slack',
            'capri', 'legging', 'tight', 'culotte', 'palazzo', 'bermuda',
            'cargo', 'khaki', 'jogger', 'sweatpant', 'trackpant'
        ]):
            categories['bottoms'].append(product)

        # DRESSES: all dress types
        elif any(kw in combined for kw in [
            'dress', 'gown', 'maxi', 'midi', 'mini dress', 'cocktail', 'evening gown',
            'sundress', 'wrap dress', 'shift dress', 'sheath', 'a-line', 'ball gown',
            'prom dress', 'bridesmaid', 'wedding dress'
        ]):
            categories['dresses'].append(product)

        # SHOES: all footwear types
        elif any(kw in combined for kw in [
            'shoe', 'sneaker', 'boot', 'sandal', 'heel', 'loafer', 'oxford',
            'pump', 'stiletto', 'wedge', 'flat', 'slipper', 'moccasin',
            'espadrille', 'ankle boot', 'knee boot', 'trainer', 'runner',
            'cleat', 'croc', 'flip flop', 'slide', 'mary jane', 'ballet flat'
        ]):
            categories['shoes'].append(product)

        # ACCESSORIES: bags, jewelry, etc.
        elif any(kw in combined for kw in [
            'bag', 'purse', 'wallet', 'belt', 'watch', 'jewelry', 'accessory',
            'hat', 'scarf', 'sunglass', 'glasses', 'tie', 'bowtie', 'cufflink',
            'bracelet', 'necklace', 'earring', 'ring', 'handbag', 'clutch',
            'tote', 'backpack', 'briefcase', 'messenger', 'satchel', 'crossbody',
            'fanny pack', 'bum bag', 'duffle', 'beanie', 'cap', 'beret',
            'glove', 'sock', 'stocking', 'bandana', 'headband', 'hair clip'
        ]):
            categories['accessories'].append(product)

        # ACTIVEWEAR: gym, sports, athletic wear
        elif any(kw in combined for kw in [
            'gym', 'sport', 'athletic', 'workout', 'activewear', 'jogger', 'legging',
            'yoga', 'pilates', 'running', 'training', 'tracksuit', 'sweatpant',
            'sports bra', 'compression', 'fitness', 'performance', 'moisture wicking',
            'gym wear', 'exercise', 'cycling', 'tennis', 'basketball', 'football',
            'soccer', 'track', 'marathon', 'crossfit', 'athletic wear'
        ]):
            categories['activewear'].append(product)

        # FORMAL: business, office, formal wear
        elif any(kw in combined for kw in [
            'suit', 'blazer', 'formal', 'business', 'tuxedo', 'tux', 'evening wear',
            'office wear', 'corporate', 'dress shirt', 'dress pant', 'pencil skirt',
            'business casual', 'work wear', 'professional', 'executive', 'tailored',
            'three-piece', 'two-piece', 'pinstripe', 'double-breasted', 'sport coat',
            'dress shoe', 'oxford shirt', 'dress trouser'
        ]):
            categories['formal'].append(product)

        # OUTERWEAR: jackets, coats, etc.
        elif any(kw in combined for kw in [
            'jacket', 'coat', 'cardigan', 'hoodie', 'sweater', 'trench', 'parka',
            'windbreaker', 'bomber', 'peacoat', 'overcoat', 'gilet', 'shawl',
            'cape', 'poncho', 'blazer jacket', 'denim jacket', 'leather jacket',
            'puffer', 'down jacket', 'fleece', 'anorak', 'raincoat', 'mackintosh',
            'vest jacket', 'varsity', 'track jacket', 'zip-up', 'pullover'
        ]):
            categories['outerwear'].append(product)

        else:
            # Default categorization
            if 'clothing' in category_lower or 'apparel' in category_lower:
                categories['tops'].append(product)

    return categories


def _try_create_bundle(brand, categorized, template):
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
    bundle_name = template['name_template'].format(brand=brand.title())

    # Get or update existing bundle
    bundle, created = OutfitBundle.objects.update_or_create(
        theme=template['theme'],
        name=bundle_name,
        defaults={
            'description': f"Auto-curated {brand.title()} collection featuring complementary pieces. [AUTO-GENERATED]",
            'is_active': True
        }
    )

    # Update products (this will replace existing products if bundle existed)
    bundle.products.set(selected_products)
    bundle.save()

    return bundle


def _generate_bundles_for_brand(brand, products):
    """Generate outfit bundles for a specific brand"""

    # Categorize products
    categorized = _categorize_products(products)

    # Define complementary category sets
    outfit_templates = [
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
        # GYM-SPECIFIC BUNDLES (separate from general styling)
        {
            'categories': ['activewear', 'shoes'],
            'min_required': 2,
            'theme': 'gym_workout',
            'name_template': '{brand} Gym Essentials'
        },
        {
            'categories': ['activewear', 'accessories'],
            'min_required': 2,
            'theme': 'training_essentials',
            'name_template': '{brand} Training Kit'
        },
        {
            'categories': ['activewear', 'shoes', 'accessories'],
            'min_required': 2,
            'theme': 'fitness_focus',
            'name_template': '{brand} Fitness Bundle'
        },
        {
            'categories': ['activewear', 'shoes'],
            'min_required': 2,
            'theme': 'strength_training',
            'name_template': '{brand} Power Workout'
        },
        {
            'categories': ['activewear', 'accessories'],
            'min_required': 2,
            'theme': 'active_recovery',
            'name_template': '{brand} Recovery Set'
        },
        {
            'categories': ['activewear', 'shoes'],
            'min_required': 2,
            'theme': 'running_gear',
            'name_template': '{brand} Run Club'
        },
        {
            'categories': ['activewear', 'accessories'],
            'min_required': 2,
            'theme': 'yoga_session',
            'name_template': '{brand} Yoga Studio'
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
        _try_create_bundle(brand, categorized, template)


def _generate_mixed_brand_bundles(products):
    """Generate outfit bundles from mixed brands based on complementary categories"""

    # Categorize all products
    categorized = _categorize_products(products)

    # Define mixed-brand outfit templates
    mixed_templates = [
        {
            'categories': ['tops', 'bottoms', 'shoes', 'accessories'],
            'min_required': 3,
            'theme': 'casual_friday',
            'name_template': 'Casual Mix & Match'
        },
        {
            'categories': ['tops', 'bottoms', 'shoes'],
            'min_required': 3,
            'theme': 'weekend_vibes',
            'name_template': 'Weekend Style Mix'
        },
        {
            'categories': ['dresses', 'shoes', 'accessories'],
            'min_required': 2,
            'theme': 'date_night',
            'name_template': 'Date Night Combo'
        },
        # GYM-SPECIFIC MIXED BUNDLES
        {
            'categories': ['activewear', 'shoes'],
            'min_required': 2,
            'theme': 'gym_workout',
            'name_template': 'Gym Ready Set'
        },
        {
            'categories': ['activewear', 'accessories'],
            'min_required': 2,
            'theme': 'yoga_session',
            'name_template': 'Yoga Flow Essentials'
        },
        {
            'categories': ['activewear', 'shoes', 'accessories'],
            'min_required': 2,
            'theme': 'running_gear',
            'name_template': 'Runner\'s Choice'
        },
        {
            'categories': ['activewear'],
            'min_required': 2,
            'theme': 'cardio_ready',
            'name_template': 'Cardio Blast Kit'
        },
        {
            'categories': ['activewear', 'shoes'],
            'min_required': 2,
            'theme': 'strength_training',
            'name_template': 'Strength Zone'
        },
        {
            'categories': ['activewear', 'accessories'],
            'min_required': 2,
            'theme': 'active_recovery',
            'name_template': 'Recovery Essentials'
        },
        {
            'categories': ['activewear', 'shoes', 'accessories'],
            'min_required': 2,
            'theme': 'training_essentials',
            'name_template': 'Training Ground'
        },
        {
            'categories': ['activewear'],
            'min_required': 2,
            'theme': 'fitness_focus',
            'name_template': 'Fitness First'
        },
        {
            'categories': ['formal', 'shoes', 'accessories'],
            'min_required': 2,
            'theme': 'office_chic',
            'name_template': 'Office Professional'
        },
        {
            'categories': ['tops', 'bottoms'],
            'min_required': 2,
            'theme': 'street_style',
            'name_template': 'Street Style Pick'
        },
    ]

    # Try each template with "Mixed" as the "brand"
    for template in mixed_templates:
        _try_create_bundle('Mixed', categorized, template)
