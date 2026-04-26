from django.urls import path
from .views import SubmitInquiryView, SellerInquiryListView, MarkInquiryReadView

urlpatterns = [
    path('', SubmitInquiryView.as_view(), name='submit-inquiry'),
    path('mine/', SellerInquiryListView.as_view(), name='seller-inquiries'),
    path('<int:pk>/read/', MarkInquiryReadView.as_view(), name='mark-inquiry-read'),
]
