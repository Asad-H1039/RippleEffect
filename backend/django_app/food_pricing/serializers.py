from rest_framework import serializers

from food_pricing.models import District


class BaseDistrictSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = District
        fields = ("id", "name")

    def get_name(self, obj):
        return obj.name.title()


class DistrictSerializer(BaseDistrictSerializer):
    commodities = serializers.SerializerMethodField()

    class Meta:
        model = District
        fields = ("id", "name", "commodities")

    def get_commodities(self, obj: District):
        commodities = {}
        for market in obj.market_set.all():
            for price in market.commodityprice_set.order_by("-date"):
                market_data = {
                    price.market.pk: {
                        "name": price.market.name,
                        "average_price": price.average_price,
                        "date": price.date,
                        "historical_prices": [price.average_price],
                    }
                }
                if price.commodity.pk not in commodities.keys():
                    commodities.update(
                        {price.commodity.pk: {"name": price.commodity.name, "markets": market_data}}
                    )
                else:
                    if price.market.pk not in commodities[price.commodity.pk]["markets"].keys():
                        commodities[price.commodity.pk]["markets"].update(market_data)
                    else:
                        commodities[price.commodity.pk]["markets"][price.market.pk][
                            "historical_prices"
                        ].append(price.average_price)

        return commodities
