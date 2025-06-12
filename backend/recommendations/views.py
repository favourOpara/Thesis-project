# recommendations/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from products.models import Product
from .serializers import RecommendedProductSerializer

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
