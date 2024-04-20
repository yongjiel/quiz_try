from rest_framework.authtoken.models import Token
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


@authentication_classes([])
@permission_classes([])
class TokenValidationView(APIView):
    def post(self, request):
        token_key = request.data.get('key')  # Get token from request data
        print(token_key)
        print("------")
        print(Token.objects.all())
        try:
            token = Token.objects.get(key=token_key)
        except Token.DoesNotExist:
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Token is valid."}, status=status.HTTP_200_OK)