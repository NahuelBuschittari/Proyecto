from rest_framework import serializers
from .models import Parking, Price, Characteristic, User

class ParkingSerializer(serializers.ModelSerializer):
    prices = serializers.StringRelatedField(many=False)  # Relación OneToOne
    characteristics = serializers.StringRelatedField(many=True)  # Relación ForeignKey

    class Meta:
        model = Parking
        fields = '__all__'

class PriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Price
        fields = '__all__'

class CharacteristicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Characteristic
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
