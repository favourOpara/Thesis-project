from django.contrib import admin
from .models import (
    Shop, StoreBlock, BlockImage,
    CategoryPage, CategoryBlock, CategoryBlockImage,
    StoreContentSection, SectionImage, StoreTextBlock,
)

admin.site.register(Shop)
admin.site.register(StoreBlock)
admin.site.register(BlockImage)
admin.site.register(CategoryPage)
admin.site.register(CategoryBlock)
admin.site.register(CategoryBlockImage)
admin.site.register(StoreContentSection)
admin.site.register(SectionImage)
admin.site.register(StoreTextBlock)
