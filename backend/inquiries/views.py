from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from products.models import Shop
from .models import Inquiry
from .serializers import InquirySerializer


class SubmitInquiryView(APIView):
    """
    POST /api/inquiries/
    Anyone (no auth) can submit an inquiry to a shop.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = InquirySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Your inquiry has been sent. The seller will be in touch.'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SellerInquiryListView(APIView):
    """
    GET /api/inquiries/mine/
    Returns all inquiries for the authenticated seller's shop.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        shop = get_object_or_404(Shop, owner=request.user)
        inquiries = Inquiry.objects.filter(shop=shop)
        serializer = InquirySerializer(inquiries, many=True)
        return Response(serializer.data)


class MarkInquiryReadView(APIView):
    """
    PATCH /api/inquiries/<id>/read/
    Lets the seller mark an inquiry as read.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        shop = get_object_or_404(Shop, owner=request.user)
        inquiry = get_object_or_404(Inquiry, pk=pk, shop=shop)
        inquiry.is_read = True
        inquiry.save(update_fields=['is_read'])
        return Response({'status': 'marked as read'})
