from django.urls import path
from . import views

urlpatterns = [
    path("plans/",            views.plan_list,          name="subscription-plans"),
    path("mine/",             views.my_subscription,    name="my-subscription"),
    path("upgrade/",          views.initiate_upgrade,   name="subscription-upgrade"),
    path("webhook/paystack/", views.subscription_webhook, name="subscription-webhook"),
]
