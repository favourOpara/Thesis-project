from rest_framework import serializers
from .models import Inquiry


class InquirySerializer(serializers.ModelSerializer):
    shop_name = serializers.ReadOnlyField(source='shop.name')
    shop_slug = serializers.ReadOnlyField(source='shop.slug')
    product_name = serializers.SerializerMethodField()

    class Meta:
        model = Inquiry
        fields = [
            'id', 'shop', 'shop_name', 'shop_slug',
            'product', 'product_name',
            'visitor_name', 'visitor_email', 'message',
            'is_read', 'created_at',
        ]
        read_only_fields = ['is_read', 'created_at', 'shop_name', 'shop_slug', 'product_name']

    def get_product_name(self, obj):
        return obj.product.name if obj.product else None
