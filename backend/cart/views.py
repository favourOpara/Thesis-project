from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Cart, CartItem
from .serializers import CartSerializer
from products.models import Product


def _get_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart = _get_cart(request.user)
    return Response(CartSerializer(cart, context={"request": request}).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get("product_id")
    quantity   = int(request.data.get("quantity", 1))

    if not product_id:
        return Response({"error": "product_id is required."}, status=400)

    product = get_object_or_404(Product, pk=product_id, is_active=True)

    if product.quantity == 0:
        return Response({"error": "This product is out of stock."}, status=400)

    cart = _get_cart(request.user)
    item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    item.quantity = min(item.quantity + quantity if not created else quantity, product.quantity)
    item.save()

    return Response(CartSerializer(cart, context={"request": request}).data, status=201)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_item(request, item_id):
    quantity = request.data.get("quantity")
    if quantity is None:
        return Response({"error": "quantity is required."}, status=400)

    cart = _get_cart(request.user)
    item = get_object_or_404(CartItem, pk=item_id, cart=cart)

    quantity = int(quantity)
    if quantity <= 0:
        item.delete()
    else:
        item.quantity = min(quantity, item.product.quantity)
        item.save()

    return Response(CartSerializer(cart, context={"request": request}).data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_item(request, item_id):
    cart = _get_cart(request.user)
    item = get_object_or_404(CartItem, pk=item_id, cart=cart)
    item.delete()
    return Response(CartSerializer(cart, context={"request": request}).data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    cart = _get_cart(request.user)
    cart.items.all().delete()
    return Response(CartSerializer(cart, context={"request": request}).data)
