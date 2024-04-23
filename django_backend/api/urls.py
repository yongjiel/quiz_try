
from django.urls import path, include, re_path

from .views import (
    QuizApiView,
    QuizSummaryApiView,
    UserCreate
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

from .view_test import TokenValidationView


urlpatterns = [
    path('validate-token/', TokenValidationView.as_view(), name='validate-token',),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    re_path(r"^quizs/?(?P<permalink>\w+)?", QuizApiView.as_view(), name="get_quizs",),
    re_path(r"^quiz_summary/", QuizSummaryApiView.as_view(), name="get_quizs",),
    re_path(r"^questions/?(?P<id>\w+)?", QuizApiView.as_view(), name="get_questions",),
    re_path(r'users/', UserCreate.as_view(), name='account-create'),
]