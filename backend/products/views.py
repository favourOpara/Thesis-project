from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Q
from django.utils import timezone
from django.conf import settings
import requests as http_requests

from .models import Shop, Category, Product, ProductImage, StoreTextBlock, StoreContentSection, SectionImage
from abatrades.email_utils import send_product_listed, send_premium_activated, send_premium_cancelled
from .serializers import (
    ShopSerializer,
    CategorySerializer,
    ProductSerializer,
    ProductImageSerializer,
    StoreTextBlockSerializer,
    StoreContentSectionSerializer,
    SectionImageSerializer,
)

PAYSTACK_SECRET = getattr(settings, 'PAYSTACK_SECRET_KEY', '') or "sk_test_3207e50dafa844fb486185ea7aceed100089ff21"


class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'record_visit', 'products']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def _expire_premium_if_due(self, shop):
        """If billing period has ended after cancellation, revoke premium access."""
        if shop.is_premium and shop.premium_expires_at and shop.premium_expires_at <= timezone.now():
            shop.is_premium = False
            shop.premium_expires_at = None
            shop.save(update_fields=['is_premium', 'premium_expires_at'])

    def _has_active_products(self, shop):
        return shop.owner.products.filter(is_active=True).exists()

    def _is_owner(self, shop):
        return (
            self.request.user.is_authenticated
            and self.request.user == shop.owner
        )

    def get_queryset(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return Shop.objects.filter(owner=self.request.user)
        queryset = Shop.objects.all()
        # Public listing/searching: only expose shops that have at least one active product
        if self.action in ['list']:
            queryset = queryset.filter(
                owner__products__is_active=True
            ).distinct()
        category = self.request.query_params.get('category')
        ordering = self.request.query_params.get('ordering')
        if category:
            queryset = queryset.filter(
                owner__products__category__iexact=category,
                owner__products__is_active=True
            ).distinct()
        if ordering in ['visit_count', '-visit_count', 'created_at', '-created_at', 'name', '-name']:
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('-created_at')
        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        self._expire_premium_if_due(instance)
        if not self._has_active_products(instance) and not self._is_owner(instance):
            from rest_framework.exceptions import NotFound
            raise NotFound("Shop not found.")
        serializer = self.get_serializer(instance, context={'request': request})
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'], url_path='mine', permission_classes=[permissions.IsAuthenticated])
    def mine(self, request):
        try:
            shop = Shop.objects.get(owner=request.user)
            self._expire_premium_if_due(shop)
            serializer = self.get_serializer(shop, context={'request': request})
            return Response(serializer.data)
        except Shop.DoesNotExist:
            return Response(None)

    @action(detail=True, methods=['post'], url_path='visit')
    def record_visit(self, request, slug=None):
        shop = self.get_object()
        # Don't count visits for shops with no active products
        if not self._has_active_products(shop):
            return Response({'visit_count': shop.visit_count})
        Shop.objects.filter(pk=shop.pk).update(visit_count=shop.visit_count + 1)
        return Response({'visit_count': shop.visit_count + 1})

    @action(detail=True, methods=['get'], url_path='products')
    def products(self, request, slug=None):
        shop = self.get_object()
        # Block public access to product list if shop has no active products
        if not self._has_active_products(shop) and not self._is_owner(shop):
            return Response([])
        queryset = Product.objects.filter(owner=shop.owner, is_active=True)
        serializer = ProductSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def _get_or_create_paystack_plan(self):
        """Return the Paystack plan code for premium, creating it if needed."""
        plan_code = getattr(settings, 'PAYSTACK_PREMIUM_PLAN_CODE', '')
        if plan_code:
            return plan_code
        # Create plan dynamically
        try:
            res = http_requests.post(
                "https://api.paystack.co/plan",
                json={'name': 'Abatrades Premium Store', 'interval': 'monthly', 'amount': 1000000, 'currency': 'NGN'},
                headers={'Authorization': f'Bearer {PAYSTACK_SECRET}'},
                timeout=10,
            )
            data = res.json()
            if data.get('status'):
                return data['data']['plan_code']
        except Exception:
            pass
        return None

    @action(detail=False, methods=['post'], url_path='init-premium-payment',
            permission_classes=[permissions.IsAuthenticated],
            parser_classes=[JSONParser, MultiPartParser, FormParser])
    def init_premium_payment(self, request):
        """Initialize a Paystack payment (with a recurring plan) and return the authorization URL."""
        try:
            shop = Shop.objects.get(owner=request.user)
        except Shop.DoesNotExist:
            return Response({'error': 'You do not have a shop.'}, status=status.HTTP_404_NOT_FOUND)
        if shop.is_premium:
            serializer = self.get_serializer(shop, context={'request': request})
            return Response({'already_premium': True, 'shop': serializer.data})

        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        callback_url = f"{frontend_url}/seller/premium"
        plan_code = self._get_or_create_paystack_plan()

        payload = {
            'email': request.user.email,
            'amount': 1000000,
            'currency': 'NGN',
            'callback_url': callback_url,
            'metadata': {'type': 'premium_upgrade', 'user_id': request.user.id},
        }
        if plan_code:
            payload['plan'] = plan_code

        try:
            res = http_requests.post(
                "https://api.paystack.co/transaction/initialize",
                json=payload,
                headers={'Authorization': f'Bearer {PAYSTACK_SECRET}'},
                timeout=10,
            )
            data = res.json()
        except Exception as e:
            return Response({'error': f'Could not reach Paystack: {str(e)}'}, status=status.HTTP_502_BAD_GATEWAY)

        if not data.get('status'):
            return Response({'error': data.get('message', 'Payment initialisation failed.')}, status=status.HTTP_502_BAD_GATEWAY)

        return Response({
            'authorization_url': data['data']['authorization_url'],
            'reference': data['data']['reference'],
        })

    @action(detail=False, methods=['post'], url_path='upgrade-premium',
            permission_classes=[permissions.IsAuthenticated],
            parser_classes=[JSONParser, MultiPartParser, FormParser])
    def upgrade_premium(self, request):
        reference = request.data.get('reference')
        if not reference:
            return Response({'error': 'Payment reference is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            shop = Shop.objects.get(owner=request.user)
        except Shop.DoesNotExist:
            return Response({'error': 'You do not have a shop.'}, status=status.HTTP_404_NOT_FOUND)
        # Already premium — nothing to do
        if shop.is_premium:
            serializer = self.get_serializer(shop, context={'request': request})
            return Response(serializer.data)

        # Enforce 24-hour cooldown after cancellation
        if shop.premium_cancelled_at:
            cooldown_end = shop.premium_cancelled_at + timezone.timedelta(hours=24)
            if timezone.now() < cooldown_end:
                seconds_left = int((cooldown_end - timezone.now()).total_seconds())
                hours_left   = seconds_left // 3600
                mins_left    = (seconds_left % 3600) // 60
                return Response(
                    {
                        'error': 'cooldown',
                        'message': f'You can resubscribe in {hours_left}h {mins_left}m.',
                        'cooldown_ends': cooldown_end.isoformat(),
                    },
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )

        verify_url = f"https://api.paystack.co/transaction/verify/{reference}"
        ps_headers = {'Authorization': f'Bearer {PAYSTACK_SECRET}'}
        try:
            res = http_requests.get(verify_url, headers=ps_headers, timeout=10)
            data = res.json()
        except Exception as e:
            return Response({'error': f'Could not reach Paystack. Try again. ({str(e)})'}, status=status.HTTP_502_BAD_GATEWAY)

        paystack_ok = data.get('status') is True
        txn_data = data.get('data') or {}
        txn_status = txn_data.get('status', '')
        if not paystack_ok or txn_status != 'success':
            return Response(
                {'error': f'Payment not confirmed by Paystack (status: {txn_status or "unknown"}). Ref: {reference}'},
                status=status.HTTP_402_PAYMENT_REQUIRED
            )

        # Activate premium and clear any cancellation/expiry record
        already_premium = shop.is_premium
        update_fields = ['is_premium', 'premium_since', 'premium_cancelled_at', 'premium_expires_at']
        shop.is_premium = True
        shop.premium_since = timezone.now()
        shop.premium_cancelled_at = None
        shop.premium_expires_at = None

        customer = txn_data.get('customer') or {}
        if customer.get('customer_code'):
            shop.paystack_customer_code = customer['customer_code']
            update_fields.append('paystack_customer_code')

        # Save card authorization code so we can create subscriptions without future redirects
        authorization = txn_data.get('authorization') or {}
        if authorization.get('authorization_code') and not shop.paystack_authorization_code:
            shop.paystack_authorization_code = authorization['authorization_code']
            update_fields.append('paystack_authorization_code')

        # Fetch subscription code if a plan was used
        sub_data = txn_data.get('plan_object') or {}
        if not shop.paystack_subscription_code:
            try:
                sub_res = http_requests.get(
                    f"https://api.paystack.co/subscription?customer={customer.get('customer_code', '')}",
                    headers=ps_headers, timeout=10,
                )
                sub_json = sub_res.json()
                subs = (sub_json.get('data') or [])
                if subs:
                    shop.paystack_subscription_code = subs[0].get('subscription_code', '')
                    shop.paystack_email_token = subs[0].get('email_token', '')
                    update_fields += ['paystack_subscription_code', 'paystack_email_token']
            except Exception:
                pass

        shop.save(update_fields=update_fields)
        if not already_premium:
            send_premium_activated(request.user, shop)
        serializer = self.get_serializer(shop, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='init-card-setup',
            permission_classes=[permissions.IsAuthenticated],
            parser_classes=[JSONParser, MultiPartParser, FormParser])
    def init_card_setup(self, request):
        """
        Initialise a ₦100 Paystack charge purely to tokenise the seller's card.
        We refund it immediately after — no new subscription charge.
        Used by sellers who paid via bank transfer and want to add a card for auto-renewal.
        """
        try:
            shop = Shop.objects.get(owner=request.user)
        except Shop.DoesNotExist:
            return Response({'error': 'You do not have a shop.'}, status=status.HTTP_404_NOT_FOUND)

        if not shop.is_premium:
            return Response({'error': 'Your shop is not premium.'}, status=status.HTTP_400_BAD_REQUEST)

        if shop.paystack_subscription_code:
            return Response({'already_setup': True})

        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        callback_url = f"{frontend_url}/seller/premium?card_setup=1"

        try:
            res = http_requests.post(
                'https://api.paystack.co/transaction/initialize',
                json={
                    'email':        request.user.email,
                    'amount':       10000,   # ₦100 in kobo — just enough to tokenise the card
                    'currency':     'NGN',
                    'callback_url': callback_url,
                    'metadata':     {'type': 'card_setup', 'user_id': request.user.id},
                },
                headers={'Authorization': f'Bearer {PAYSTACK_SECRET}'},
                timeout=10,
            )
            data = res.json()
        except Exception as e:
            return Response({'error': f'Could not reach Paystack: {str(e)}'}, status=status.HTTP_502_BAD_GATEWAY)

        if not data.get('status'):
            return Response({'error': data.get('message', 'Could not start card setup.')}, status=status.HTTP_502_BAD_GATEWAY)

        return Response({
            'authorization_url': data['data']['authorization_url'],
            'reference':         data['data']['reference'],
        })

    @action(detail=False, methods=['post'], url_path='complete-card-setup',
            permission_classes=[permissions.IsAuthenticated],
            parser_classes=[JSONParser, MultiPartParser, FormParser])
    def complete_card_setup(self, request):
        """
        After the ₦100 tokenisation charge:
        1. Verify the transaction and save the card authorization code.
        2. Immediately refund the ₦100 — seller is not charged.
        3. Create a Paystack subscription starting 30 days from now.
        """
        reference = request.data.get('reference')
        if not reference:
            return Response({'error': 'Payment reference is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            shop = Shop.objects.get(owner=request.user)
        except Shop.DoesNotExist:
            return Response({'error': 'You do not have a shop.'}, status=status.HTTP_404_NOT_FOUND)

        if shop.paystack_subscription_code:
            serializer = self.get_serializer(shop, context={'request': request})
            return Response({'already_setup': True, 'shop': serializer.data})

        ps_headers = {'Authorization': f'Bearer {PAYSTACK_SECRET}'}

        # 1. Verify the ₦100 transaction
        try:
            verify = http_requests.get(
                f'https://api.paystack.co/transaction/verify/{reference}',
                headers=ps_headers, timeout=10,
            )
            txn = verify.json()
        except Exception as e:
            return Response({'error': f'Could not reach Paystack: {str(e)}'}, status=status.HTTP_502_BAD_GATEWAY)

        if not txn.get('status') or (txn.get('data') or {}).get('status') != 'success':
            return Response({'error': 'Card charge could not be verified.'}, status=status.HTTP_402_PAYMENT_REQUIRED)

        txn_data     = txn.get('data') or {}
        authorization = txn_data.get('authorization') or {}
        customer      = txn_data.get('customer') or {}

        auth_code     = authorization.get('authorization_code', '')
        customer_code = customer.get('customer_code', '')

        # Save authorization and customer codes
        update_fields = []
        if auth_code and not shop.paystack_authorization_code:
            shop.paystack_authorization_code = auth_code
            update_fields.append('paystack_authorization_code')
        if customer_code and not shop.paystack_customer_code:
            shop.paystack_customer_code = customer_code
            update_fields.append('paystack_customer_code')
        if update_fields:
            shop.save(update_fields=update_fields)

        # 2. Refund the ₦100 immediately
        try:
            http_requests.post(
                'https://api.paystack.co/refund',
                json={'transaction': reference},
                headers=ps_headers, timeout=10,
            )
        except Exception:
            pass  # Refund failure is non-fatal; support can process manually if needed

        # 3. Create subscription starting 30 days from now (no charge today)
        plan_code = self._get_or_create_paystack_plan()
        if not plan_code:
            return Response({'error': 'Could not find premium plan. Contact support.'}, status=status.HTTP_502_BAD_GATEWAY)

        start_date = (timezone.now() + timezone.timedelta(days=30)).strftime('%Y-%m-%dT%H:%M:%S+00:00')
        try:
            sub_res = http_requests.post(
                'https://api.paystack.co/subscription',
                json={
                    'customer':      customer_code or request.user.email,
                    'plan':          plan_code,
                    'authorization': auth_code,
                    'start_date':    start_date,
                },
                headers=ps_headers, timeout=10,
            )
            sub_data = sub_res.json()
        except Exception as e:
            return Response({'error': f'Card saved but could not create subscription: {str(e)}'}, status=status.HTTP_502_BAD_GATEWAY)

        if not sub_data.get('status'):
            return Response(
                {'error': sub_data.get('message', 'Card saved but subscription creation failed.')},
                status=status.HTTP_502_BAD_GATEWAY
            )

        sub = sub_data.get('data') or {}
        save_fields = []
        if sub.get('subscription_code'):
            shop.paystack_subscription_code = sub['subscription_code']
            save_fields.append('paystack_subscription_code')
        if sub.get('email_token'):
            shop.paystack_email_token = sub['email_token']
            save_fields.append('paystack_email_token')
        if save_fields:
            shop.save(update_fields=save_fields)

        serializer = self.get_serializer(shop, context={'request': request})
        return Response({'shop': serializer.data, 'next_charge': start_date})

    @action(detail=False, methods=['post'], url_path='setup-recurring',
            permission_classes=[permissions.IsAuthenticated],
            parser_classes=[JSONParser, MultiPartParser, FormParser])
    def setup_recurring(self, request):
        """
        Attach recurring monthly billing to an existing premium store.
        If a saved card authorization exists, creates the subscription silently (no new charge).
        Otherwise initialises a Paystack transaction so the seller can enter card details;
        the ₦10,000 charge is applied but premium is not reset (already active).
        """
        try:
            shop = Shop.objects.get(owner=request.user)
        except Shop.DoesNotExist:
            return Response({'error': 'You do not have a shop.'}, status=status.HTTP_404_NOT_FOUND)

        if shop.paystack_subscription_code:
            return Response({'already_setup': True, 'message': 'Recurring billing is already active.'})

        ps_headers = {'Authorization': f'Bearer {PAYSTACK_SECRET}'}
        plan_code  = self._get_or_create_paystack_plan()

        # ── Path A: silent subscription using stored card authorization ──────────
        if shop.paystack_authorization_code and shop.paystack_customer_code and plan_code:
            import datetime as dt
            start_date = (timezone.now() + timezone.timedelta(days=30)).strftime('%Y-%m-%dT%H:%M:%S+00:00')
            try:
                res = http_requests.post(
                    'https://api.paystack.co/subscription',
                    json={
                        'customer':      shop.paystack_customer_code,
                        'plan':          plan_code,
                        'authorization': shop.paystack_authorization_code,
                        'start_date':    start_date,
                    },
                    headers=ps_headers,
                    timeout=10,
                )
                data = res.json()
                if data.get('status'):
                    sub = data.get('data') or {}
                    update_fields = []
                    if sub.get('subscription_code'):
                        shop.paystack_subscription_code = sub['subscription_code']
                        update_fields.append('paystack_subscription_code')
                    if sub.get('email_token'):
                        shop.paystack_email_token = sub['email_token']
                        update_fields.append('paystack_email_token')
                    if update_fields:
                        shop.save(update_fields=update_fields)
                    serializer = self.get_serializer(shop, context={'request': request})
                    return Response({'silent': True, 'shop': serializer.data})
            except Exception:
                pass  # fall through to payment redirect below

        # ── Path B: no saved card — redirect to Paystack to enter card details ──
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        callback_url = f"{frontend_url}/seller/premium"
        payload = {
            'email':        request.user.email,
            'amount':       1000000,
            'currency':     'NGN',
            'callback_url': callback_url,
            'metadata':     {'type': 'setup_recurring', 'user_id': request.user.id},
        }
        if plan_code:
            payload['plan'] = plan_code
        try:
            res = http_requests.post(
                'https://api.paystack.co/transaction/initialize',
                json=payload,
                headers=ps_headers,
                timeout=10,
            )
            data = res.json()
        except Exception as e:
            return Response({'error': f'Could not reach Paystack: {str(e)}'}, status=status.HTTP_502_BAD_GATEWAY)

        if not data.get('status'):
            return Response({'error': data.get('message', 'Could not start payment.')}, status=status.HTTP_502_BAD_GATEWAY)

        return Response({
            'silent':            False,
            'authorization_url': data['data']['authorization_url'],
            'reference':         data['data']['reference'],
        })

    @action(detail=False, methods=['get'], url_path='subscription-status',
            permission_classes=[permissions.IsAuthenticated])
    def subscription_status(self, request):
        """
        Return Paystack subscription status and next billing date.
        If we don't have a subscription code stored yet (timing gap after card payment),
        look it up by customer code and save it so card users never need to set up manually.
        """
        try:
            shop = Shop.objects.get(owner=request.user)
        except Shop.DoesNotExist:
            return Response({'error': 'You do not have a shop.'}, status=status.HTTP_404_NOT_FOUND)

        ps_headers = {'Authorization': f'Bearer {PAYSTACK_SECRET}'}

        # ── Lazy subscription lookup ──────────────────────────────────────────────
        # Paystack creates the subscription asynchronously after a card payment with a
        # plan attached. If we don't have the code yet but we do have a customer code,
        # check Paystack now and save it — so card users never see the manual setup button.
        if not shop.paystack_subscription_code and shop.paystack_customer_code:
            try:
                lookup = http_requests.get(
                    f"https://api.paystack.co/subscription?customer={shop.paystack_customer_code}",
                    headers=ps_headers, timeout=10,
                )
                lookup_data = lookup.json()
                subs = lookup_data.get('data') or []
                if subs:
                    shop.paystack_subscription_code = subs[0].get('subscription_code', '')
                    shop.paystack_email_token       = subs[0].get('email_token', '')
                    update_fields = []
                    if shop.paystack_subscription_code:
                        update_fields.append('paystack_subscription_code')
                    if shop.paystack_email_token:
                        update_fields.append('paystack_email_token')
                    if update_fields:
                        shop.save(update_fields=update_fields)
            except Exception:
                pass

        if not shop.paystack_subscription_code:
            return Response({'has_subscription': False})

        try:
            res = http_requests.get(
                f"https://api.paystack.co/subscription/{shop.paystack_subscription_code}",
                headers=ps_headers,
                timeout=10,
            )
            data = res.json()
            if data.get('status'):
                sub = data.get('data') or {}
                return Response({
                    'has_subscription': True,
                    'status': sub.get('status'),
                    'next_payment_date': sub.get('next_payment_date'),
                    'amount': sub.get('amount'),
                    'subscription_code': shop.paystack_subscription_code,
                })
        except Exception:
            pass

        return Response({'has_subscription': True, 'status': 'unknown'})

    @action(detail=False, methods=['post'], url_path='cancel-premium',
            permission_classes=[permissions.IsAuthenticated],
            parser_classes=[JSONParser, MultiPartParser, FormParser])
    def cancel_premium(self, request):
        """
        Cancel subscription. Access continues until end of current billing period (premium_expires_at),
        then is_premium flips to False automatically on next load.
        Records premium_cancelled_at for the 24-hour resubscribe cooldown.
        """
        try:
            shop = Shop.objects.get(owner=request.user)
        except Shop.DoesNotExist:
            return Response({'error': 'You do not have a shop.'}, status=status.HTTP_404_NOT_FOUND)

        if not shop.is_premium:
            return Response({'error': 'Your shop is not on a premium plan.'}, status=status.HTTP_400_BAD_REQUEST)

        ps_headers = {'Authorization': f'Bearer {PAYSTACK_SECRET}'}
        expires_at = None

        if shop.paystack_subscription_code and shop.paystack_email_token:
            # Fetch next payment date — that becomes the access expiry
            try:
                sub_res = http_requests.get(
                    f"https://api.paystack.co/subscription/{shop.paystack_subscription_code}",
                    headers=ps_headers, timeout=10,
                )
                sub_data = sub_res.json()
                if sub_data.get('status'):
                    next_date_str = (sub_data.get('data') or {}).get('next_payment_date')
                    if next_date_str:
                        from django.utils.dateparse import parse_datetime
                        expires_at = parse_datetime(next_date_str)
            except Exception:
                pass

            # Disable auto-renewal on Paystack (best-effort)
            try:
                http_requests.post(
                    "https://api.paystack.co/subscription/disable",
                    json={'code': shop.paystack_subscription_code, 'token': shop.paystack_email_token},
                    headers=ps_headers, timeout=10,
                )
            except Exception:
                pass

        # Keep is_premium=True — access continues until expires_at
        shop.premium_expires_at = expires_at or (timezone.now() + timezone.timedelta(days=30))
        shop.premium_cancelled_at = timezone.now()
        shop.save(update_fields=['premium_expires_at', 'premium_cancelled_at'])

        send_premium_cancelled(request.user, shop)

        serializer = self.get_serializer(shop, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='update-video',
            permission_classes=[permissions.IsAuthenticated],
            parser_classes=[JSONParser, MultiPartParser, FormParser])
    def update_video(self, request, slug=None):
        """Update store promo video — accepts either a URL or an uploaded file."""
        shop = self.get_object()
        if shop.owner != request.user:
            return Response({'error': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)
        if not shop.is_premium:
            return Response({'error': 'Premium required.'}, status=status.HTTP_403_FORBIDDEN)

        update_fields = []

        # File upload takes priority over URL
        video_file = request.FILES.get('store_video_file')
        if video_file:
            shop.store_video_file = video_file
            shop.store_video_url = ''   # clear URL when a file is uploaded
            update_fields += ['store_video_file', 'store_video_url']
        elif 'store_video_url' in request.data:
            shop.store_video_url = request.data.get('store_video_url', '')
            shop.store_video_file = None  # clear file when URL is set
            update_fields += ['store_video_url', 'store_video_file']

        if update_fields:
            shop.save(update_fields=update_fields)

        file_url = request.build_absolute_uri(shop.store_video_file.url) if shop.store_video_file else None
        return Response({
            'store_video_url': shop.store_video_url or '',
            'store_video_file_url': file_url,
        })

    @action(detail=True, methods=['get', 'post'], url_path='text-blocks',
            permission_classes=[permissions.IsAuthenticated])
    def text_blocks(self, request, slug=None):
        shop = self.get_object()
        if shop.owner != request.user:
            return Response({'error': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)
        if not shop.is_premium:
            return Response({'error': 'Premium required.'}, status=status.HTTP_403_FORBIDDEN)
        if request.method == 'GET':
            blocks = shop.text_blocks.all()
            return Response(StoreTextBlockSerializer(blocks, many=True).data)
        serializer = StoreTextBlockSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(shop=shop)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch', 'delete'], url_path=r'text-blocks/(?P<block_id>\d+)',
            permission_classes=[permissions.IsAuthenticated])
    def text_block_detail(self, request, slug=None, block_id=None):
        shop = self.get_object()
        if shop.owner != request.user:
            return Response({'error': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)
        block = get_object_or_404(StoreTextBlock, pk=block_id, shop=shop)
        if request.method == 'DELETE':
            block.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        serializer = StoreTextBlockSerializer(block, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ── Store content sections (available to all sellers, no premium required) ──

    @action(detail=True, methods=['get', 'post'], url_path='content-sections',
            permission_classes=[permissions.IsAuthenticated],
            parser_classes=[MultiPartParser, FormParser, JSONParser])
    def content_sections(self, request, slug=None):
        shop = self.get_object()
        if shop.owner != request.user:
            return Response({'error': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)
        if request.method == 'GET':
            sections = shop.content_sections.prefetch_related('images').all()
            return Response(StoreContentSectionSerializer(sections, many=True, context={'request': request}).data)
        # POST: create a new section
        layout = request.data.get('layout', '2col')
        display_order = request.data.get('display_order', 0)
        section = StoreContentSection.objects.create(shop=shop, layout=layout, display_order=display_order)
        # Handle uploaded images
        images = request.FILES.getlist('images')
        categories = request.data.getlist('linked_categories')  # parallel list
        for i, img_file in enumerate(images):
            linked_cat = categories[i] if i < len(categories) else None
            SectionImage.objects.create(section=section, image=img_file, linked_category=linked_cat or None, display_order=i)
        return Response(StoreContentSectionSerializer(section, context={'request': request}).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch', 'delete'], url_path=r'content-sections/(?P<section_id>\d+)',
            permission_classes=[permissions.IsAuthenticated],
            parser_classes=[MultiPartParser, FormParser, JSONParser])
    def content_section_detail(self, request, slug=None, section_id=None):
        shop = self.get_object()
        if shop.owner != request.user:
            return Response({'error': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)
        section = get_object_or_404(StoreContentSection, pk=section_id, shop=shop)
        if request.method == 'DELETE':
            section.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        # PATCH: update layout/order, replace images if provided
        if 'layout' in request.data:
            section.layout = request.data['layout']
        if 'display_order' in request.data:
            section.display_order = request.data['display_order']
        section.save()
        new_images = request.FILES.getlist('images')
        if new_images:
            section.images.all().delete()
            categories = request.data.getlist('linked_categories')
            for i, img_file in enumerate(new_images):
                linked_cat = categories[i] if i < len(categories) else None
                SectionImage.objects.create(section=section, image=img_file, linked_category=linked_cat or None, display_order=i)
        # Update existing image categories if sent (no new images)
        img_ids = request.data.getlist('image_ids')
        img_cats = request.data.getlist('image_linked_categories')
        for img_id, cat in zip(img_ids, img_cats):
            SectionImage.objects.filter(pk=img_id, section=section).update(linked_category=cat or None)
        return Response(StoreContentSectionSerializer(section, context={'request': request}).data)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        queryset = super().get_queryset().filter(is_active=True, quantity__gt=0)
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(category__icontains=search) |
                Q(sub_category__icontains=search)
            )
        return queryset

    def perform_create(self, serializer):
        is_active = self.request.data.get('is_active')
        if is_active is not None:
            is_active = str(is_active).lower() in ['true', '1', 'yes']
        else:
            is_active = True
        product = serializer.save(owner=self.request.user, is_active=is_active)
        images = self.request.FILES.getlist('images')
        for image in images:
            ProductImage.objects.create(product=product, image=image)

    def perform_update(self, serializer):
        product = serializer.save()
        if product.quantity == 0 and product.is_active:
            product.is_active = False
            product.save(update_fields=['is_active'])
        images = self.request.FILES.getlist('images')
        if images:
            product.images.all().delete()
            for image in images:
                ProductImage.objects.create(product=product, image=image)


class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        serializer.save()


class OwnerProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user)

    def get_object(self):
        return get_object_or_404(self.get_queryset(), pk=self.kwargs['pk'])

    def list(self, request):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def create(self, request):
        is_active = request.data.get('is_active')
        if is_active is not None:
            is_active = str(is_active).lower() in ['true', '1', 'yes']
        else:
            is_active = True
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save(owner=self.request.user, is_active=is_active)
            images = request.FILES.getlist('images')
            for image in images:
                ProductImage.objects.create(product=product, image=image)
            send_product_listed(request.user, product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        product = self.get_object()
        serializer = self.get_serializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            product = serializer.save()
            if product.quantity == 0 and product.is_active:
                product.is_active = False
                product.save(update_fields=['is_active'])

            new_images = request.FILES.getlist('images')
            image_order_str = request.data.get('image_order', '')

            if image_order_str or new_images:
                if image_order_str:
                    # Parse ordered list of existing image IDs to keep
                    ordered_ids = [int(x) for x in image_order_str.split(',') if x.strip().isdigit()]
                    # Delete images that were removed by the seller
                    product.images.exclude(id__in=ordered_ids).delete()
                    # Update order for kept images
                    for i, img_id in enumerate(ordered_ids):
                        product.images.filter(id=img_id).update(order=i)
                    start_order = len(ordered_ids)
                else:
                    # No existing images kept — delete all and start fresh
                    product.images.all().delete()
                    start_order = 0

                # Append new uploaded images after existing ones
                for i, image in enumerate(new_images):
                    ProductImage.objects.create(product=product, image=image, order=start_order + i)

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        product = self.get_object()
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
