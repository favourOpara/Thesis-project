from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from accounts.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Shop, Category, Product, ProductImage, Order, OrderItem, ShippingAddress, Payment


class ShopTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(email='test@test.com', password='password123')
        self.admin_user = CustomUser.objects.create_user(email='admin@admin.com', password='password123')
        # Create JWT token for authentication
        self.token = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token.access_token}')

    def test_create_shop(self):
        url = reverse('shop-list')
        data = {'name': 'My Shop', 'description': 'Best shop in town!'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Shop.objects.count(), 1)
        self.assertEqual(Shop.objects.get().name, 'My Shop')

    def test_create_shop_without_authentication(self):
        self.client.credentials()  # Remove the JWT token
        url = reverse('shop-list')
        data = {'name': 'Unauthorized Shop'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_shop(self):
        shop = Shop.objects.create(owner=self.user, name="Shop A")
        url = reverse('shop-detail', kwargs={'pk': shop.pk})
        data = {'name': 'Updated Shop'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        shop.refresh_from_db()
        self.assertEqual(shop.name, 'Updated Shop')

    def test_delete_shop(self):
        shop = Shop.objects.create(owner=self.user, name="Shop A")
        url = reverse('shop-detail', kwargs={'pk': shop.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Shop.objects.count(), 0)

    def test_access_shop_by_non_owner(self):
        shop = Shop.objects.create(owner=self.user, name="Shop A")
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_user.token.access_token}')  # Use admin JWT
        url = reverse('shop-detail', kwargs={'pk': shop.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class CategoryTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(email='test@test.com', password='password123')
        self.token = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token.access_token}')

    def test_create_category(self):
        url = reverse('category-list')
        data = {'name': 'Electronics', 'description': 'All electronics products'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 1)

    def test_update_category(self):
        category = Category.objects.create(name="Electronics")
        url = reverse('category-detail', kwargs={'pk': category.pk})
        data = {'name': 'Updated Electronics'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        category.refresh_from_db()
        self.assertEqual(category.name, 'Updated Electronics')

    def test_delete_category(self):
        category = Category.objects.create(name="Electronics")
        url = reverse('category-detail', kwargs={'pk': category.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Category.objects.count(), 0)


class ProductTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(email='test@test.com', password='password123')
        self.admin_user = CustomUser.objects.create_user(email='admin@admin.com', password='password123')
        self.token = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token.access_token}')
        self.shop = Shop.objects.create(owner=self.user, name="Shop A")
        self.category = Category.objects.create(name="Electronics")

    def test_create_product(self):
        url = reverse('product-list')
        data = {
            'name': 'Laptop',
            'category': self.category.id,
            'description': 'A great laptop',
            'price': '1000.00',
            'stock': 10,
            'shop': self.shop.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 1)

    def test_create_product_without_shop_owner(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_user.token.access_token}')  # Use admin JWT
        url = reverse('product-list')
        data = {
            'name': 'Laptop',
            'category': self.category.id,
            'description': 'A great laptop',
            'price': '1000.00',
            'stock': 10,
            'shop': self.shop.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_add_product_image(self):
        product = Product.objects.create(
            name="Smartphone",
            category=self.category,
            description="Best smartphone",
            price=500,
            stock=50,
            shop=self.shop
        )
        url = reverse('product-add-image', kwargs={'pk': product.pk})
        with open('test_image.jpg', 'wb') as f:
            f.write(b'fakeimagecontent')
        data = {'image': open('test_image.jpg', 'rb')}
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_product(self):
        product = Product.objects.create(
            name="Smartphone",
            category=self.category,
            description="Best smartphone",
            price=500,
            stock=50,
            shop=self.shop
        )
        url = reverse('product-detail', kwargs={'pk': product.pk})
        data = {'name': 'Updated Smartphone'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        product.refresh_from_db()
        self.assertEqual(product.name, 'Updated Smartphone')

    def test_delete_product(self):
        product = Product.objects.create(
            name="Smartphone",
            category=self.category,
            description="Best smartphone",
            price=500,
            stock=50,
            shop=self.shop
        )
        url = reverse('product-detail', kwargs={'pk': product.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Product.objects.count(), 0)


class OrderTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(email='test@test.com', password='password123')
        self.token = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token.access_token}')
        self.shop = Shop.objects.create(owner=self.user, name="Shop A")
        self.category = Category.objects.create(name="Electronics")
        self.product = Product.objects.create(
            name="Smartphone",
            category=self.category,
            description="Best smartphone",
            price=500,
            stock=50,
            shop=self.shop
        )

    def test_create_order(self):
        url = reverse('order-list')
        data = {'shop': self.shop.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 1)

    def test_add_item_to_order(self):
        order = Order.objects.create(buyer=self.user, shop=self.shop)
        url = reverse('order-add-item', kwargs={'pk': order.pk})
        data = {'product': self.product.id, 'quantity': 2}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(OrderItem.objects.count(), 1)

    def test_update_order(self):
        order = Order.objects.create(buyer=self.user, shop=self.shop)
        url = reverse('order-detail', kwargs={'pk': order.pk})
        data = {'status': 'COMPLETED'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertEqual(order.status, 'COMPLETED')

    def test_delete_order(self):
        order = Order.objects.create(buyer=self.user, shop=self.shop)
        url = reverse('order-detail', kwargs={'pk': order.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Order.objects.count(), 0)


class ShippingAddressTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(email='test@test.com', password='password123')
        self.token = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token.access_token}')
        self.shop = Shop.objects.create(owner=self.user, name="Shop A")
        self.order = Order.objects.create(buyer=self.user, shop=self.shop)

    def test_create_shipping_address(self):
        url = reverse('shipping-address-list')
        data = {
            'order': self.order.id,
            'full_name': 'John Doe',
            'address': '123 Street',
            'city': 'City',
            'state': 'State',
            'postal_code': '12345',
            'country': 'Country',
            'phone_number': '1234567890'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ShippingAddress.objects.count(), 1)

    def test_update_shipping_address(self):
        shipping_address = ShippingAddress.objects.create(
            order=self.order,
            full_name="John Doe",
            address="123 Street",
            city="City",
            state="State",
            postal_code="12345",
            country="Country",
            phone_number="1234567890"
        )
        url = reverse('shipping-address-detail', kwargs={'pk': shipping_address.pk})
        data = {'city': 'New City'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        shipping_address.refresh_from_db()
        self.assertEqual(shipping_address.city, 'New City')

    def test_delete_shipping_address(self):
        shipping_address = ShippingAddress.objects.create(
            order=self.order,
            full_name="John Doe",
            address="123 Street",
            city="City",
            state="State",
            postal_code="12345",
            country="Country",
            phone_number="1234567890"
        )
        url = reverse('shipping-address-detail', kwargs={'pk': shipping_address.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ShippingAddress.objects.count(), 0)


class PaymentTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(email='test@test.com', password='password123')
        self.token = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token.access_token}')
        self.shop = Shop.objects.create(owner=self.user, name="Shop A")
        self.order = Order.objects.create(buyer=self.user, shop=self.shop)

    def test_create_payment(self):
        url = reverse('payment-list')
        data = {'order': self.order.id, 'payment_method': 'Credit Card', 'amount': '500.00', 'is_successful': True}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_payment(self):
        payment = Payment.objects.create(order=self.order, payment_method='Credit Card', amount=500.00, is_successful=True)
        url = reverse('payment-detail', kwargs={'pk': payment.pk})
        data = {'is_successful': False}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payment.refresh_from_db()
        self.assertEqual(payment.is_successful, False)

    def test_delete_payment(self):
        payment = Payment.objects.create(order=self.order, payment_method='Credit Card', amount=500.00, is_successful=True)
        url = reverse('payment-detail', kwargs={'pk': payment.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Payment.objects.count(), 0)
