import random
from django.contrib.auth.models import User
from rest_framework import serializers
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.conf import settings
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import serializers
from django.utils import timezone


class UserSerializer(serializers.ModelSerializer):
    fullname = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "fullname",
        )

    def create(self, validated_data):
        fullname = validated_data.pop('fullname', None)
        names = fullname.split(' ', 1) if fullname else ['', '']
        validated_data['first_name'] = names[0]
        validated_data['last_name'] = names[1] if len(names) > 1 else ''
        user = User.objects.create_user(**validated_data)
        return user
    
    def validate_email(self, value):
        """Check if the email is already in use."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email address is already in use.")
        return value

# class PasswordResetSerializer(serializers.Serializer):
#     email = serializers.EmailField()

#     def validate_email(self, value):
#         try:
#             user = User.objects.get(email=value)
#         except User.DoesNotExist:
#             raise serializers.ValidationError("No user with this email found.")
#         return value

#     def send_password_reset_email(self, user):
#         token_generator = PasswordResetTokenGenerator()
#         uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
#         token = token_generator.make_token(user)
        
#         # Correctly reverse the URL with both uidb64 and token
#         reset_url = f"{settings.FRONTEND_URL}{reverse('password_reset_confirm', args=[uidb64, token])}"
        
#         send_mail(
#             subject="Password Reset Request",
#             message=f"Please use the following link to reset your password: {reset_url}",
#             from_email=settings.EMAIL_HOST_USER,
#             recipient_list=[user.email],
#         )

#     def save(self):
#         user = User.objects.get(email=self.validated_data['email'])
#         self.send_password_reset_email(user)

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user with this email found.")
        return value

    def generate_otp(self):
        """Generate a 6-digit OTP"""
        return str(random.randint(100000, 999999))

    def send_password_reset_otp(self, user, otp):
        send_mail(
            subject="Password Reset OTP",
            message=f"Your OTP for password reset is: {otp}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
        )

    def save(self):
        user = User.objects.get(email=self.validated_data['email'])
        otp = self.generate_otp()
        self.send_password_reset_otp(user, otp)

        # Store OTP in cache or session (you can also store it in the database if needed)
        cache.set(f"password_reset_otp_{user.pk}", otp, timeout=300)  # Timeout in seconds
        cache.set(f"otp_expiry_{user.pk}", timezone.now(), timeout=300)  # Store the time of OTP generation
