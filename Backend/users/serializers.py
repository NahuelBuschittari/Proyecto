# serializers.py

from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Parking, Driver, ParkingPrices, ParkingSchedule, ParkingFeatures

User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'surname', 'birthDate', 'password')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'surname', 'birthDate')

class ParkingPricesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingPrices
        exclude = ('id', 'parking')

class ParkingScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingSchedule
        exclude = ('id', 'parking')

class ParkingFeaturesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingFeatures
        exclude = ('id', 'parking')

class ParkingCreateSerializer(serializers.ModelSerializer):
    prices = ParkingPricesSerializer()
    schedule = ParkingScheduleSerializer()
    features = ParkingFeaturesSerializer()
    
    class Meta:
        model = Parking
        fields = '__all__'
        read_only_fields = ('user',)

    def create(self, validated_data):
        prices_data = validated_data.pop('prices')
        schedule_data = validated_data.pop('schedule')
        features_data = validated_data.pop('features')
        
        parking = Parking.objects.create(**validated_data)
        
        ParkingPrices.objects.create(parking=parking, **prices_data)
        ParkingSchedule.objects.create(parking=parking, **schedule_data)
        ParkingFeatures.objects.create(parking=parking, **features_data)
        
        return parking

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'
        read_only_fields = ('user',)