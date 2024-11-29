from django.db import models

class Parking(models.Model):
    id = models.AutoField(primary_key=True)
    capacity = models.IntegerField()
    is_covered = models.BooleanField()
    entrance = models.CharField(max_length=100)
    exit = models.CharField(max_length=100)

class Price(models.Model):
    id = models.AutoField(primary_key=True)
    parking = models.OneToOneField(Parking, on_delete=models.CASCADE, related_name='prices')
    duration_hours = models.IntegerField()
    is_accessible = models.BooleanField()
    is_easy_pay = models.BooleanField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    service = models.CharField(max_length=100)
    discounts = models.CharField(max_length=200, null=True, blank=True)

class Characteristic(models.Model):
    id = models.AutoField(primary_key=True)
    parking = models.ForeignKey(Parking, on_delete=models.CASCADE, related_name='characteristics')
    is_guarded = models.BooleanField()
    has_light_security = models.BooleanField()
    has_gated_access = models.BooleanField()
    has_car_wash = models.BooleanField()
    has_battery_assistance = models.BooleanField()
    has_free_wifi = models.BooleanField()

class User(models.Model):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    name = models.CharField(max_length=100)