from rest_framework import serializers
from .models import CustomUser

class SignUpSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    user_type = serializers.ChoiceField(
        choices=CustomUser.USER_TYPE_CHOICES, required=False
    )

    class Meta:
        model = CustomUser
        # fields = ["name", "email", "password", "confirm_password", "phone_number", "address", "user_type"]
        fields = ["email", "password", "confirm_password", "user_type"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")        
        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        user_type = validated_data.pop("user_type", "buyer")
        user = CustomUser.objects.create_user(**validated_data)

        if user_type:
            user.user_type = user_type
            user.save()

        return user

from rest_framework import serializers
from .models import CustomUser

class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["first_name", "last_name", "email", "phone_number", "address"]
        extra_kwargs = {
            "email": {"read_only": True},  # Email is not editable
        }
