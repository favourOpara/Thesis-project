from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from products.models import Product  # Import Product model

# Remove @api_view(["GET"]) here (it's only for function-based views)
class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return CartItem.objects.filter(cart=cart)

    def create(self, request, *args, **kwargs):
        cart, created = Cart.objects.get_or_create(user=request.user)
        product = get_object_or_404(Product, id=request.data.get('product'))
        quantity = request.data.get('quantity', 1)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += int(quantity)
        cart_item.save()

        serializer = self.get_serializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# Apply @api_view(["GET"]) only to the function-based view
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_cart_items(request):
    """
    Check and update cart items: 
    - Remove items if the product is deleted or out of stock.
    - Return the updated cart items.
    """
    try:
        cart, created = Cart.objects.get_or_create(user=request.user)
        cart_items = CartItem.objects.filter(cart=cart)
        updated_cart = []

        for item in cart_items:
            product = Product.objects.filter(id=item.product.id).first()

            if not product or product.quantity == 0:
                print(f"Deleting item: {item.product.name}")
                # Remove the item if product is deleted or out of stock
                item.delete()
            else:
                updated_cart.append({
                    "id": item.id,
                    "product_id": item.product.id,
                    "name": item.product.name,
                    "price": str(item.product.price),
                    "quantity": item.quantity
                })

        return Response(updated_cart, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
