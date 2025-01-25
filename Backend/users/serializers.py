from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Driver, Parking, Prices, Schedule, Features

User = get_user_model()

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('email', 'password', 'isParking')

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ('nombre', 'apellido', 'fecha_nacimiento')

class PricesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prices
        exclude = ('parking',)

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        exclude = ('parking',)

class FeaturesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Features
        exclude = ('parking',)

class ParkingSerializer(serializers.ModelSerializer):
    prices = PricesSerializer(read_only=True)
    schedule = ScheduleSerializer(read_only=True)
    features = FeaturesSerializer(read_only=True)

    class Meta:
        model = Parking
        fields = ('nombre', 'calle', 'numero', 'ciudad', 'latitude', 'longitude',
                 'carCapacity', 'bikeCapacity', 'motoCapacity', 'prices',
                 'schedule', 'features')
