# urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import ParkingViewSet, DriverViewSet

router = DefaultRouter()
router.register(r'parkings', ParkingViewSet, basename='parking')
router.register(r'drivers', DriverViewSet, basename='driver')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
]