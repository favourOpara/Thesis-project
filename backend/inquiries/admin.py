from django.contrib import admin
from .models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ['visitor_name', 'visitor_email', 'shop', 'product', 'is_read', 'created_at']
    list_filter = ['is_read', 'shop']
    search_fields = ['visitor_name', 'visitor_email', 'message']
    readonly_fields = ['created_at']
