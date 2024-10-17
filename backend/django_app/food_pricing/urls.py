from django.urls import path

from food_pricing.views import DistrictDetailAPIView, DistrictsListAPIView

urlpatterns = [
    path("districts/", DistrictsListAPIView.as_view(), name="available-districts"),
    path("districts/<int:pk>/", DistrictDetailAPIView.as_view(), name="district-detail"),
]
