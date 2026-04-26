from rest_framework import serializers
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product_name     = serializers.ReadOnlyField(source="product.name")
    product_price    = serializers.ReadOnlyField(source="product.price")
    product_category = serializers.ReadOnlyField(source="product.category")
    main_image_url   = serializers.SerializerMethodField()
    subtotal         = serializers.ReadOnlyField()
    shop_name        = serializers.SerializerMethodField()
    shop_slug        = serializers.SerializerMethodField()
    in_stock         = serializers.SerializerMethodField()
    max_qty          = serializers.ReadOnlyField(source="product.quantity")

    class Meta:
        model  = CartItem
        fields = [
            "id", "product", "product_name", "product_price",
            "product_category", "main_image_url", "quantity",
            "subtotal", "shop_name", "shop_slug", "in_stock", "max_qty",
        ]

    def get_main_image_url(self, obj):
        if obj.product.images.exists():
            request = self.context.get("request")
            url = obj.product.images.first().image.url
            return request.build_absolute_uri(url) if request else url
        return None

    def get_shop_name(self, obj):
        try:
            return obj.product.owner.shop.name
        except Exception:
            return None

    def get_shop_slug(self, obj):
        try:
            return obj.product.owner.shop.slug
        except Exception:
            return None

    def get_in_stock(self, obj):
        return obj.product.quantity > 0


class CartSerializer(serializers.ModelSerializer):
    items      = CartItemSerializer(many=True, read_only=True)
    total      = serializers.ReadOnlyField()
    item_count = serializers.ReadOnlyField()

    class Meta:
        model  = Cart
        fields = ["id", "items", "total", "item_count"]
