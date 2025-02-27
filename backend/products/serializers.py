from rest_framework import serializers
from .models import Shop, Category, Product, ProductImage, Order, OrderItem, ShippingAddress, Payment

class ShopSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Shop
        fields = ['id', 'owner', 'name', 'description', 'created_at', 'updated_at']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'alt_text']

    def get_image_url(self, obj):
        """Returns the full URL for the image."""
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


class ProductSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')
    
    # ✅ Fetch all related images using the related_name 'images'
    images = ProductImageSerializer(many=True, read_only=True)

    # ✅ Fetch the `main_image` URL if it exists
    main_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'owner',
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
            'main_image_url',  # ✅ New field for main image
            'images',  # ✅ List of additional images
        ]

    def get_main_image_url(self, obj):
        """Returns the full URL of the main image."""
        request = self.context.get('request')
        if obj.main_image:
            return request.build_absolute_uri(obj.main_image.url) if request else obj.main_image.url
        return None


class OrderSerializer(serializers.ModelSerializer):
    buyer = serializers.ReadOnlyField(source='buyer.username')
    shop = serializers.PrimaryKeyRelatedField(queryset=Shop.objects.all())
    items = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'buyer', 'shop', 'order_date', 'status', 'total_price', 'items']


class OrderItemSerializer(serializers.ModelSerializer):
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'quantity', 'price']


class ShippingAddressSerializer(serializers.ModelSerializer):
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())

    class Meta:
        model = ShippingAddress
        fields = [
            'id',
            'order',
            'full_name',
            'address',
            'city',
            'state',
            'postal_code',
            'country',
            'phone_number'
        ]


class PaymentSerializer(serializers.ModelSerializer):
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())

    class Meta:
        model = Payment
        fields = ['id', 'order', 'payment_date', 'amount', 'payment_method', 'is_successful']
