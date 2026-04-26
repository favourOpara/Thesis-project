# recommendations/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from products.models import Product
from .models import OutfitBundle
from .serializers import RecommendedProductSerializer, OutfitBundleSerializer
import random

class RecommendedForYouView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            user = request.user if request.user.is_authenticated else None
            if user and user.is_authenticated:
                recommended_products = Product.objects.filter(is_active=True).order_by("?")[:8]
            else:
                recommended_products = Product.objects.filter(is_active=True).order_by("?")[:8]
            serializer = RecommendedProductSerializer(recommended_products, many=True, context={'request': request})
            return Response(serializer.data)
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return Response({"error": str(e)}, status=500)


class StylingOutfitView(APIView):
    """
    API endpoint for the "Styling with Abatrades" section.
    Returns a random themed outfit bundle for display.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            # Get all active outfit bundles that have products
            active_bundles = OutfitBundle.objects.filter(is_active=True).prefetch_related('products')

            # Filter to bundles that have at least 2 products (lowered from 3)
            valid_bundles = [bundle for bundle in active_bundles if bundle.products.filter(is_active=True).count() >= 2]

            if not valid_bundles:
                # Fallback: show ONLY clothing-related products
                clothing_categories = ['Clothing materials', 'Body accessories', 'Cosmetic and beauty products', 'Jewelry and watches']
                all_products = Product.objects.filter(
                    is_active=True,
                    category__in=clothing_categories
                ).order_by('?')[:4]

                serializer = RecommendedProductSerializer(all_products, many=True, context={'request': request})
                return Response({
                    'outfit_bundle': None,
                    'products': serializer.data,
                    'fallback': True
                })

            # Select a random bundle from valid bundles
            selected_bundle = random.choice(valid_bundles)

            # Serialize the bundle with all product details
            serializer = OutfitBundleSerializer(selected_bundle, context={'request': request})

            return Response({
                'outfit_bundle': serializer.data,
                'fallback': False
            })

        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return Response({"error": str(e)}, status=500)


class GymWearsBundleView(APIView):
    """
    API endpoint for the "Gym Wears" section.
    Returns athleisure/activewear themed outfit bundles.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            # Get active bundles with GYM-SPECIFIC themes only
            gym_themes = [
                'gym_workout',
                'yoga_session',
                'running_gear',
                'training_essentials',
                'fitness_focus',
                'cardio_ready',
                'strength_training',
                'active_recovery',
            ]
            active_bundles = OutfitBundle.objects.filter(
                is_active=True,
                theme__in=gym_themes
            ).prefetch_related('products')

            # Filter to bundles that have at least 2 active products
            valid_bundles = [
                bundle for bundle in active_bundles
                if bundle.products.filter(is_active=True).count() >= 2
            ]

            if not valid_bundles:
                # Fallback: show only activewear/athletic products
                gym_keywords = [
                    'gym', 'sport', 'athletic', 'workout', 'activewear', 'jogger',
                    'yoga', 'training', 'fitness', 'running', 'exercise', 'track'
                ]

                # Filter products that contain gym keywords in name, category, or sub_category
                gym_products = Product.objects.filter(is_active=True)
                filtered_products = []

                for product in gym_products:
                    combined = f"{product.name} {product.category} {product.sub_category or ''}".lower()
                    if any(keyword in combined for keyword in gym_keywords):
                        filtered_products.append(product)

                # Get up to 4 gym products
                gym_products = filtered_products[:4]

                serializer = RecommendedProductSerializer(gym_products, many=True, context={'request': request})
                return Response({
                    'outfit_bundle': None,
                    'products': serializer.data,
                    'fallback': True
                })

            # Select a random gym bundle
            selected_bundle = random.choice(valid_bundles)

            # Serialize the bundle
            serializer = OutfitBundleSerializer(selected_bundle, context={'request': request})

            return Response({
                'outfit_bundle': serializer.data,
                'fallback': False
            })

        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return Response({"error": str(e)}, status=500)
