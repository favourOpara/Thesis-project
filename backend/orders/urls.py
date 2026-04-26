from django.urls import path
from . import views

urlpatterns = [
    path("checkout/",                      views.checkout,             name="checkout"),
    path("webhook/paystack/",              views.paystack_webhook,     name="paystack-webhook"),
    path("my/",                            views.my_orders,            name="my-orders"),
    path("my/<int:order_id>/",             views.order_detail,         name="order-detail"),
    path("verify/<str:ref>/",             views.verify_payment,        name="verify-payment"),
    path("seller/",                        views.seller_orders,         name="seller-orders"),
    path("seller/<int:order_id>/status/",  views.update_order_status,  name="seller-order-status"),
]
