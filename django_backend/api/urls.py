
from django.urls import path, include, re_path

from .views import (
    MoviesApiView,
    MovieRatingsApiView,
    UserMoviesApiView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

from .view_test import TokenValidationView
from rest_framework import routers
from .views import UserViewSet, GroupViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)

urlpatterns = [
    re_path(r"^movies/?(?P<id>\w+)?", MoviesApiView.as_view(), name="get_movies",),
    path('ratings', MovieRatingsApiView.as_view()),
    path('', include(router.urls)),
    path('validate-token/', TokenValidationView.as_view(), name='validate-token',),
    re_path(r'^userlist/?', UserMoviesApiView.as_view(), name='user-movie-list',),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]