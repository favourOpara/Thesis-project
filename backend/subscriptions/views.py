import uuid
import requests
from datetime import timedelta

from django.conf import settings
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import SubscriptionPlan, SellerSubscription
from .serializers import SubscriptionPlanSerializer, SellerSubscriptionSerializer

PAYSTACK_SECRET = getattr(settings, "PAYSTACK_SECRET_KEY", "")


@api_view(["GET"])
@permission_classes([AllowAny])
def plan_list(request):
    plans = SubscriptionPlan.objects.all().order_by("monthly_price")
    return Response(SubscriptionPlanSerializer(plans, many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_subscription(request):
    try:
        sub = request.user.subscription
        return Response(SellerSubscriptionSerializer(sub).data)
    except SellerSubscription.DoesNotExist:
        # Return free plan info
        try:
            free_plan = SubscriptionPlan.objects.get(tier="free")
            return Response({"plan": SubscriptionPlanSerializer(free_plan).data, "is_free": True})
        except SubscriptionPlan.DoesNotExist:
            return Response({"plan": None, "is_free": True})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def initiate_upgrade(request):
    plan_id = request.data.get("plan_id")
    if not plan_id:
        return Response({"error": "plan_id is required."}, status=400)

    try:
        plan = SubscriptionPlan.objects.get(pk=plan_id)
    except SubscriptionPlan.DoesNotExist:
        return Response({"error": "Plan not found."}, status=404)

    if plan.monthly_price == 0:
        # Downgrade to free
        SellerSubscription.objects.update_or_create(
            seller=request.user,
            defaults={"plan": plan, "is_active": True, "expires_at": None}
        )
        return Response({"message": "Switched to Free plan."})

    ref = f"SUB-{uuid.uuid4().hex[:12].upper()}"
    amount_kobo = int(float(plan.monthly_price) * 100)

    ps = requests.post(
        "https://api.paystack.co/transaction/initialize",
        headers={
            "Authorization": f"Bearer {PAYSTACK_SECRET}",
            "Content-Type": "application/json",
        },
        json={
            "email":     request.user.email,
            "amount":    amount_kobo,
            "reference": ref,
            "callback_url": f"{getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')}/seller-dashboard?sub={ref}",
            "metadata":  {"plan_id": plan.id, "seller_id": request.user.id},
        },
        timeout=10,
    )

    if ps.status_code != 200:
        return Response({"error": "Payment gateway error."}, status=502)

    return Response({
        "payment_url": ps.json()["data"]["authorization_url"],
        "reference":   ref,
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def subscription_webhook(request):
    import hmac, hashlib, json

    sig      = request.META.get("HTTP_X_PAYSTACK_SIGNATURE", "")
    body     = request.body
    expected = hmac.new(PAYSTACK_SECRET.encode(), body, hashlib.sha512).hexdigest()

    if sig != expected:
        return Response(status=400)

    data  = json.loads(body)
    event = data.get("event")

    if event == "charge.success":
        meta = data["data"].get("metadata", {})
        plan_id   = meta.get("plan_id")
        seller_id = meta.get("seller_id")

        if plan_id and seller_id:
            try:
                from django.contrib.auth import get_user_model
                User = get_user_model()
                plan   = SubscriptionPlan.objects.get(pk=plan_id)
                seller = User.objects.get(pk=seller_id)
                SellerSubscription.objects.update_or_create(
                    seller=seller,
                    defaults={
                        "plan":       plan,
                        "is_active":  True,
                        "expires_at": timezone.now() + timedelta(days=30),
                        "payment_ref": data["data"]["reference"],
                    }
                )
            except Exception:
                pass

    return Response(status=200)
