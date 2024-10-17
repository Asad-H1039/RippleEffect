from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.urls import path, include

from django_app.views import RegisterView,PasswordResetView,PasswordResetConfirmView

schema_view = get_schema_view(
    openapi.Info(
        title="Ripple Farm API Documentation",
        default_version="v1",
        description="API documentation for your project",
        terms_of_service="https://localhost:8000/terms/",
        contact=openapi.Contact(email="fypse6@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    #permission_classes=(permissions.AllowAny,),
)
urlpatterns = (
    [
        path("admin/", admin.site.urls),
        path("api/docs/", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),  # Swagger UI
        path("api/redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),  # ReDoc UI
        path("api/token/", TokenObtainPairView.as_view(), name="obtain_token"),
        path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
        path("api/token/verify/", TokenVerifyView.as_view(), name="verify_token"),
        path("api/register/", RegisterView.as_view(), name="register"),
        path("api/courses/", include("courses.urls")),
        path("api/chatbot/", include("chatbot.urls")),
        path("api/food-pricing/", include("food_pricing.urls")),
        path("api/articles/", include("articles.urls")),
        # path('api/password-reset/', PasswordResetView.as_view(), name='password_reset'),
        # path('api/password-reset-confirm/<str:uidb64>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
        path('api/password-reset/', PasswordResetView.as_view(), name='password_reset'),
        path('api/password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    ]
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
)
