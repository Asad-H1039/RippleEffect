from django.contrib.auth.models import User
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_str
from django.core.cache import cache
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import PasswordResetSerializer

from django_app.serializers import UserSerializer, PasswordResetSerializer


class RegisterView(CreateAPIView):
    serializer_class = UserSerializer

    @swagger_auto_schema(
        operation_description="Register a new user with username, email, fullname, and password",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['username', 'email', 'fullname', 'password'],
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='Unique username for the user', example="johndoe"),
                'email': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_EMAIL, description='Email address of the user', example="johndoe@example.com"),
                'fullname': openapi.Schema(type=openapi.TYPE_STRING, description='Full name of the user (e.g., "John Doe")', example="John Doe"),
                'password': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_PASSWORD, description='Password for the user', example="SuperSecretPassword123"),
            },
        ),
        responses={
            201: openapi.Response('User successfully registered'),
            400: openapi.Response('Bad request, validation errors'),
        }
    )
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # fullname = request.data.get("fullname", "")
        # names = fullname.split(' ', 1)
        # firstname = names[0] if names else ""
        # lastname = names[1] if len(names) > 1 else ""

        # User.objects.create_user(
        #     username=request.data["username"],
        #     email=request.data.get("email", ""),
        #     first_name=firstname,
        #     last_name=lastname,
        #     password=request.data["password"],
        # )
        # return Response("ok", status=HTTP_201_CREATED)
        user = serializer.save()
        return Response({"detail": "User successfully registered."}, status=status.HTTP_201_CREATED)

# class PasswordResetView(APIView):
#     def post(self, request):
#         serializer = PasswordResetSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"detail": "Password reset link has been sent to your email."}, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class PasswordResetConfirmView(APIView):
#     def post(self, request, uidb64, token):
#         try:
#             uid = force_str(urlsafe_base64_decode(uidb64))
#             user = User.objects.get(pk=uid)
#         except (TypeError, ValueError, OverflowError, User.DoesNotExist):
#             user = None

#         if user is not None and PasswordResetTokenGenerator().check_token(user, token):
#             user.set_password(request.data['password'])
#             user.save()
#             return Response({"detail": "Password has been reset."}, status=status.HTTP_200_OK)
#         else:
#             return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetView(APIView):
    @swagger_auto_schema(
        operation_description="Request a password reset by providing an email address.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['email'],
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='The email address for the password reset request.'),
            },
        ),
        responses={
            200: openapi.Response(description="Password reset link has been sent to your email."),
            400: openapi.Response(description="Validation error."),
        }
    )
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "OTP has been sent to your email."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    @swagger_auto_schema(
        operation_description="Confirm the password reset using email, OTP, and the new password.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['email', 'otp', 'password'],
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='The email address associated with the password reset.'),
                'otp': openapi.Schema(type=openapi.TYPE_STRING, description='The OTP sent via email.'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='The new password to set.'),
            },
        ),
        responses={
            200: openapi.Response(description="Password has been reset successfully."),
            400: openapi.Response(description="Invalid OTP or validation error."),
        }
    )
    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        new_password = request.data.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Invalid email."}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the stored OTP and the expiry time
        cached_otp = cache.get(f"password_reset_otp_{user.pk}")
        otp_expiry = cache.get(f"otp_expiry_{user.pk}")

        # Check if OTP exists and matches
        if cached_otp and cached_otp == otp:
            # Check if OTP is expired (example: 5 minutes)
            otp_lifetime = (timezone.now() - otp_expiry).total_seconds()
            if otp_lifetime > 300:
                return Response({"detail": "OTP has expired."}, status=status.HTTP_400_BAD_REQUEST)

            # Set new password
            user.set_password(new_password)
            user.save()

            # Clear OTP from cache after successful reset
            cache.delete(f"password_reset_otp_{user.pk}")
            cache.delete(f"otp_expiry_{user.pk}")

            return Response({"detail": "Password has been reset."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)