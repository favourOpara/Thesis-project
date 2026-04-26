from django.urls import path
from . import views

urlpatterns = [
    path("",              views.get_cart,    name="cart"),
    path("add/",          views.add_to_cart, name="cart-add"),
    path("<int:item_id>/update/", views.update_item,  name="cart-update"),
    path("<int:item_id>/remove/", views.remove_item,  name="cart-remove"),
    path("clear/",        views.clear_cart,  name="cart-clear"),
]
