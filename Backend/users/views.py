# views.py

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import ParkingCreateSerializer, DriverSerializer
from .models import Parking, Driver

class ParkingViewSet(viewsets.ModelViewSet):
    serializer_class = ParkingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Parking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DriverViewSet(viewsets.ModelViewSet):
    serializer_class = DriverSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Driver.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)