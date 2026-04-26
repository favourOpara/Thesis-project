from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = OrderItem
        fields = ["id", "product", "product_name", "unit_price", "quantity", "subtotal"]


class OrderSerializer(serializers.ModelSerializer):
    items        = OrderItemSerializer(many=True, read_only=True)
    buyer_email  = serializers.ReadOnlyField(source="buyer.email")
    buyer_name   = serializers.SerializerMethodField()

    class Meta:
        model  = Order
        fields = [
            "id", "buyer_email", "buyer_name", "status",
            "shipping_name", "shipping_phone", "shipping_address",
            "shipping_city", "shipping_state",
            "subtotal", "discount_amount", "total_amount",
            "payment_ref", "payment_status", "points_earned",
            "items", "created_at", "updated_at",
        ]
        read_only_fields = ["payment_status", "payment_ref", "points_earned", "created_at", "updated_at"]

    def get_buyer_name(self, obj):
        u = obj.buyer
        return f"{u.first_name or ''} {u.last_name or ''}".strip() or u.email


class CheckoutSerializer(serializers.Serializer):
    shipping_name    = serializers.CharField()
    shipping_phone   = serializers.CharField()
    shipping_address = serializers.CharField()
    shipping_city    = serializers.CharField()
    shipping_state   = serializers.CharField()
