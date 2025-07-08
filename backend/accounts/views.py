from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, update_session_auth_hash
from .serializers import SignUpSerializer, UpdateProfileSerializer, ChangePasswordSerializer
from .models import CustomUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.middleware import csrf
from rest_framework.decorators import api_view, permission_classes

# Sign Up View
class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "message": "User created successfully",
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login View - UPDATED for case-insensitive email
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({
                "success": False,
                "message": "Email and password are required"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Case-insensitive email lookup
            user = CustomUser.objects.get(email__iexact=email)
        except CustomUser.DoesNotExist:
            return Response({
                "success": False,
                "message": "Invalid credentials"
            }, status=status.HTTP_401_UNAUTHORIZED)

        # Check password
        if user.check_password(password):
            if user.is_active:
                refresh = RefreshToken.for_user(user)
                return Response({
                    "success": True,
                    "message": "Login successful",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh)
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "success": False,
                    "message": "Account is disabled"
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                "success": False,
                "message": "Invalid credentials"
            }, status=status.HTTP_401_UNAUTHORIZED)

# Change Password View
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can change password
    authentication_classes = [JWTAuthentication]  # JWT authentication for security

    def post(self, request):
        user = request.user  # Get the authenticated user
        serializer = ChangePasswordSerializer(data=request.data, context={'user': user})

        if serializer.is_valid():
            # Extract the old and new password
            old_password = serializer.validated_data.get('old_password')
            new_password = serializer.validated_data.get('new_password')

            # Set the new password
            user.set_password(new_password)
            user.save()

            # Update session hash to keep the user logged in after password change
            update_session_auth_hash(request, user)  # Maintains session even after password change

            return Response({"success": "Password updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Logout View
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"success": False, "message": "Refresh token not provided"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Blacklist the refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"success": True, "message": "Logout successful"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Delete Account View
class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        try:
            # Delete the user
            user.delete()

            # Return success response
            return Response(
                {"message": "Account deleted successfully."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_400_BAD_REQUEST
            )

# User Info View
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    if request.user.is_authenticated:
        user = request.user
        return Response({
            "name": user.first_name or user.email,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": user.phone_number,
            "address": user.address,
            "user_type": getattr(user, 'user_type', 'Unknown')
        })
    else:
        return Response({"error": "User is anonymous"}, status=401)

# Profile Update View
class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UpdateProfileSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        serializer = UpdateProfileSerializer(user, data=request.data, partial=True)  # Allow partial updates
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully!", "data": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Test View for CSRF Token (can be removed in production)
@api_view(['GET', 'POST'])
@csrf_exempt
def test_view(request):
    print(request.META)
    csrf_token = csrf.get_token(request)
    print("CSRF Token in View:", csrf_token)
    data = {"message": "Hello, world!"}
    return Response(data)