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
        fields = ['id', 'image', 'image_url', 'alt_text']

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url  # This will return the Cloudinary URL
        return None

class ProductSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')
    images = ProductImageSerializer(many=True, read_only=True)
    size = serializers.MultipleChoiceField(choices=Product.SIZE_CHOICES)  # Changed to MultipleChoiceField
    main_image_url = serializers.SerializerMethodField()
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Product
        fields = [
            'id', 'owner', 'name', 'category', 'sub_category', 'description',
            'price', 'quantity', 'material_type', 'brand', 'size',
            'is_active', 'created_at', 'updated_at', 'main_image_url', 
            'images', 'uploaded_images'
        ]

    def get_main_image_url(self, obj):
        if obj.images.exists():
            return obj.images.first().image.url  # This will return the Cloudinary URL
        return None

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        product = Product.objects.create(**validated_data)

        for image in uploaded_images:
            ProductImage.objects.create(product=product, image=image)

        return product

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', None)
        instance = super().update(instance, validated_data)
        
        if uploaded_images:
            instance.images.all().delete()
            for image in uploaded_images:
                ProductImage.objects.create(product=instance, image=image)

        return instance

# Keep other serializers the same
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
            'id', 'order', 'full_name', 'address', 'city',
            'state', 'postal_code', 'country', 'phone_number'
        ]

class PaymentSerializer(serializers.ModelSerializer):
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())

    class Meta:
        model = Payment
        fields = ['id', 'order', 'payment_date', 'amount', 'payment_method', 'is_successful']