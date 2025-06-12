# recommendations/serializers.py

from rest_framework import serializers
from products.models import Product, ProductImage

class RecommendedProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_url', 'alt_text']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None

class RecommendedProductSerializer(serializers.ModelSerializer):
    images = RecommendedProductImageSerializer(many=True, read_only=True)
    size = serializers.MultipleChoiceField(choices=Product.SIZE_CHOICES)
    main_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'category',
            'sub_category',
            'description',
            'price',
            'quantity',
            'material_type',
            'brand',
            'size',
            'is_active',
            'created_at',
            'updated_at',
            'main_image_url',
            'images'
        ]

    def get_main_image_url(self, obj):
        request = self.context.get('request')
        if obj.images.exists():
            return request.build_absolute_uri(obj.images.first().image.url) if request else obj.images.first().image.url
        return None
