from django.contrib import admin

from food_pricing.models import Commodity, CommodityPrice, District, Market, Province


@admin.register(Province)
class ProvinceAdmin(admin.ModelAdmin):
    pass


@admin.register(District)
class DistrictPriceAdmin(admin.ModelAdmin):
    pass


@admin.register(Market)
class MarketPriceAdmin(admin.ModelAdmin):
    pass


@admin.register(Commodity)
class CommodityAdmin(admin.ModelAdmin):
    pass


@admin.register(CommodityPrice)
class CommodityPriceAdmin(admin.ModelAdmin):
    pass
