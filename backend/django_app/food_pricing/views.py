from rest_framework import filters, generics

from food_pricing.models import District
from food_pricing.serializers import BaseDistrictSerializer, DistrictSerializer


class DistrictsListAPIView(generics.ListAPIView):
    serializer_class = BaseDistrictSerializer
    queryset = District.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]


class DistrictDetailAPIView(generics.RetrieveAPIView):
    serializer_class = DistrictSerializer
    queryset = District.objects.all()
