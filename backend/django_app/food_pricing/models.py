from django.db import models


class Province(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class District(models.Model):
    name = models.CharField(max_length=255)
    province = models.ForeignKey(Province, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Market(models.Model):
    name = models.CharField(max_length=255)
    district = models.ForeignKey(District, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Commodity(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class CommodityPrice(models.Model):
    market = models.ForeignKey(Market, on_delete=models.CASCADE)
    commodity = models.ForeignKey(Commodity, on_delete=models.CASCADE)
    average_price = models.DecimalField(max_digits=11, decimal_places=2)
    date = models.DateField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["market", "commodity", "date"], name="unique_commodity_day_price"
            )
        ]

    def __str__(self):
        return f"{self.commodity} | {self.market} | {self.average_price}"
