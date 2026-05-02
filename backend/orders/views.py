import uuid
import requests
from decimal import Decimal

from django.conf import settings
from django.db import models, transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from cart.models import Cart
from products.models import Product
from .models import Order, OrderItem
from .serializers import OrderSerializer, CheckoutSerializer
from abatrades.email_utils import (
    send_order_confirmation, send_new_order_to_sellers, send_order_status_update,
    send_subscription_renewed, send_subscription_failed,
)

PAYSTACK_SECRET = getattr(settings, "PAYSTACK_SECRET_KEY", "")


# ── Checkout: create order + init Paystack payment ──────────────────────────
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def checkout(request):
    serializer = CheckoutSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    try:
        cart = Cart.objects.get(user=request.user)
    except Cart.DoesNotExist:
        return Response({"error": "Your cart is empty."}, status=400)

    items = cart.items.select_related("product", "product__owner").all()
    if not items.exists():
        return Response({"error": "Your cart is empty."}, status=400)

    # Validate stock for every item
    for item in items:
        if item.product.quantity < item.quantity:
            return Response(
                {"error": f"Only {item.product.quantity} of '{item.product.name}' available."},
                status=400,
            )

    subtotal = Decimal(str(cart.total))
    data     = serializer.validated_data
    ref      = f"ABA-{uuid.uuid4().hex[:12].upper()}"

    with transaction.atomic():
        order = Order.objects.create(
            buyer            = request.user,
            shipping_name    = data["shipping_name"],
            shipping_phone   = data["shipping_phone"],
            shipping_address = data["shipping_address"],
            shipping_city    = data["shipping_city"],
            shipping_state   = data["shipping_state"],
            subtotal         = subtotal,
            total_amount     = subtotal,
            payment_ref      = ref,
        )

        for item in items:
            OrderItem.objects.create(
                order        = order,
                product      = item.product,
                seller       = item.product.owner,
                product_name = item.product.name,
                unit_price   = item.product.price,
                quantity     = item.quantity,
            )

    # Initialize Paystack payment
    amount_kobo = int(subtotal * 100)
    ps_response = requests.post(
        "https://api.paystack.co/transaction/initialize",
        headers={
            "Authorization": f"Bearer {PAYSTACK_SECRET}",
            "Content-Type":  "application/json",
        },
        json={
            "email":     request.user.email,
            "amount":    amount_kobo,
            "reference": ref,
            "callback_url": f"{getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')}/orders?ref={ref}",
            "metadata": {
                "order_id":   order.id,
                "buyer_name": data["shipping_name"],
            },
        },
        timeout=10,
    )

    if ps_response.status_code == 200:
        ps_data = ps_response.json()
        payment_url = ps_data["data"]["authorization_url"]
    else:
        # Paystack unavailable — still return order ref so user can retry
        payment_url = None

    return Response({
        "order_id":    order.id,
        "reference":   ref,
        "payment_url": payment_url,
    }, status=201)


# ── Paystack webhook ─────────────────────────────────────────────────────────
@api_view(["POST"])
@permission_classes([AllowAny])
def paystack_webhook(request):
    import hmac, hashlib, json

    signature = request.META.get("HTTP_X_PAYSTACK_SIGNATURE", "")
    body      = request.body
    expected  = hmac.new(
        PAYSTACK_SECRET.encode(), body, hashlib.sha512
    ).hexdigest()

    if signature != expected:
        return Response(status=400)

    data  = json.loads(body)
    event = data.get("event")

    if event == "charge.success":
        ref = data["data"]["reference"]
        try:
            with transaction.atomic():
                order = Order.objects.select_for_update().get(payment_ref=ref)
                if order.payment_status == "paid":
                    return Response(status=200)

                order.payment_status = "paid"
                order.status         = "processing"
                order.points_earned  = order.calculate_points()
                order.save()

                # Deduct stock
                for item in order.items.select_related("product").all():
                    if item.product:
                        Product.objects.filter(pk=item.product.pk).update(
                            quantity=models.F("quantity") - item.quantity
                        )

                # Award loyalty points
                order.buyer.loyalty_points += order.points_earned
                order.buyer.save(update_fields=["loyalty_points"])

                # Clear buyer's cart
                try:
                    order.buyer.cart.items.all().delete()
                except Exception:
                    pass

                # Send confirmation emails
                send_order_confirmation(order)
                send_new_order_to_sellers(order)

        except Order.DoesNotExist:
            pass

    # ── Subscription auto-renewal succeeded ──────────────────────────────────
    elif event == "invoice.payment_success":
        sub_code = (data.get("data") or {}).get("subscription", {}).get("subscription_code", "")
        if sub_code:
            try:
                from products.models import Shop
                shop = Shop.objects.select_related("owner").get(paystack_subscription_code=sub_code)
                # Make sure premium is still active (handles edge cases)
                if not shop.is_premium:
                    shop.is_premium = True
                    shop.premium_cancelled_at = None
                    shop.save(update_fields=["is_premium", "premium_cancelled_at"])
                next_date = (data.get("data") or {}).get("subscription", {}).get("next_payment_date")
                send_subscription_renewed(shop.owner, shop, next_date)
            except Exception:
                pass

    # ── Subscription auto-renewal failed ─────────────────────────────────────
    elif event in ("invoice.payment_failed", "subscription.not_renew"):
        sub_code = (data.get("data") or {}).get("subscription", {}).get("subscription_code", "")
        if not sub_code:
            sub_code = (data.get("data") or {}).get("subscription_code", "")
        if sub_code:
            try:
                from products.models import Shop
                from django.utils import timezone
                shop = Shop.objects.select_related("owner").get(paystack_subscription_code=sub_code)
                if event == "invoice.payment_failed":
                    # Revoke premium immediately on payment failure
                    shop.is_premium = False
                    shop.save(update_fields=["is_premium"])
                    send_subscription_failed(shop.owner, shop)
            except Exception:
                pass

    return Response(status=200)


# ── Buyer: list own orders ───────────────────────────────────────────────────
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_orders(request):
    orders = Order.objects.filter(buyer=request.user).prefetch_related("items")
    return Response(OrderSerializer(orders, many=True).data)


# ── Buyer: single order detail ───────────────────────────────────────────────
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def order_detail(request, order_id):
    try:
        order = Order.objects.prefetch_related("items").get(
            pk=order_id, buyer=request.user
        )
    except Order.DoesNotExist:
        return Response({"error": "Not found."}, status=404)
    return Response(OrderSerializer(order).data)


# ── Verify payment after redirect ────────────────────────────────────────────
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def verify_payment(request, ref):
    ps = requests.get(
        f"https://api.paystack.co/transaction/verify/{ref}",
        headers={"Authorization": f"Bearer {PAYSTACK_SECRET}"},
        timeout=10,
    )
    if ps.status_code != 200:
        return Response({"error": "Could not verify payment."}, status=502)

    data = ps.json()["data"]
    if data["status"] == "success":
        try:
            with transaction.atomic():
                order = Order.objects.select_for_update().get(
                    payment_ref=ref, buyer=request.user
                )
                if order.payment_status != "paid":
                    order.payment_status = "paid"
                    order.status         = "processing"
                    order.points_earned  = order.calculate_points()
                    order.save()

                    for item in order.items.select_related("product").all():
                        if item.product:
                            Product.objects.filter(pk=item.product.pk).update(
                                quantity=models.F("quantity") - item.quantity
                            )

                    order.buyer.loyalty_points += order.points_earned
                    order.buyer.save(update_fields=["loyalty_points"])

                    try:
                        order.buyer.cart.items.all().delete()
                    except Exception:
                        pass

                    send_order_confirmation(order)
                    send_new_order_to_sellers(order)

        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=404)

    try:
        order = Order.objects.get(payment_ref=ref, buyer=request.user)
        return Response(OrderSerializer(order).data)
    except Order.DoesNotExist:
        return Response({"error": "Order not found."}, status=404)


# ── Seller: incoming orders ───────────────────────────────────────────────────
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seller_orders(request):
    from django.db.models import Sum as DSum
    orders = (
        Order.objects
        .filter(items__seller=request.user, payment_status="paid")
        .distinct()
        .prefetch_related("items")
        .order_by("-created_at")
    )
    return Response(OrderSerializer(orders, many=True).data)


# ── Seller: update order status ───────────────────────────────────────────────
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    new_status = request.data.get("status")
    valid = ["processing", "shipped", "delivered", "cancelled"]
    if new_status not in valid:
        return Response({"error": f"Status must be one of {valid}."}, status=400)

    try:
        order = Order.objects.get(pk=order_id, items__seller=request.user)
    except Order.DoesNotExist:
        return Response({"error": "Not found."}, status=404)

    order.status = new_status
    order.save(update_fields=["status"])
    send_order_status_update(order)
    return Response(OrderSerializer(order).data)
