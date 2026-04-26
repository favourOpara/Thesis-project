from rest_framework import serializers
from .models import Shop, Category, Product, ProductImage


class ShopSerializer(serializers.ModelSerializer):
    owner_email = serializers.ReadOnlyField(source='owner.email')
    owner_name = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    logo_url = serializers.SerializerMethodField()
    banner_url = serializers.SerializerMethodField()
    preview_images = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()

    class Meta:
        model = Shop
        fields = [
            'id', 'owner_email', 'owner_name', 'name', 'slug', 'description',
            'logo', 'logo_url', 'banner_image', 'banner_url',
            'whatsapp', 'instagram', 'website',
            'visit_count', 'product_count', 'preview_images', 'categories',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['slug', 'visit_count', 'created_at', 'updated_at']

    def get_owner_name(self, obj):
        u = obj.owner
        if u.first_name:
            return f"{u.first_name} {u.last_name or ''}".strip()
        return u.email

    def get_product_count(self, obj):
        return obj.owner.products.filter(is_active=True).count()

    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.logo.url) if request else obj.logo.url
        return None

    def get_banner_url(self, obj):
        if obj.banner_image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.banner_image.url) if request else obj.banner_image.url
        return None

    def get_preview_images(self, obj):
        request = self.context.get('request')
        images = []
        products = obj.owner.products.filter(is_active=True).prefetch_related('images')[:4]
        for product in products:
            first_img = product.images.first()
            if first_img and first_img.image:
                url = request.build_absolute_uri(first_img.image.url) if request else first_img.image.url
                images.append(url)
            if len(images) >= 3:
                break
        return images

    def get_categories(self, obj):
        cats = obj.owner.products.filter(is_active=True).values_list('category', flat=True).distinct()
        return list(set(c for c in cats if c))[:3]


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
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ProductSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')
    images = ProductImageSerializer(many=True, read_only=True)
    size = serializers.MultipleChoiceField(choices=Product.SIZE_CHOICES)
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
            request = self.context.get('request')
            image_url = obj.images.first().image.url
            if request is not None:
                return request.build_absolute_uri(image_url)
            return image_url
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
