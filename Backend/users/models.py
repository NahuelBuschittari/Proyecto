from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models

class UserAccountManager(BaseUserManager):
    def create_user(self, email,password=None):
        if not email:
            raise ValueError("Los usuarios deben tener un email")
        email=self.normalize_email(email)
        user=self.model(email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_parking_user(self,email,name,password=None):
        if not email:
            raise ValueError("Los usuarios deben tener un email")
        email=self.normalize_email(email)
        user=self.model(email=email,name=name)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_driver_user(self,email,name,surname,birthDate,password=None ):
        if not email:
            raise ValueError("Los usuarios deben tener un email")
        email=self.normalize_email(email)
        user=self.model(email=email,name=name,surname=surname,birthDate=birthDate)
        user.set_password(password)
        user.save(using=self._db)
        return user

class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255,unique=True)
    name=models.CharField(max_length=100)
    surname=models.CharField(max_length=100)
    birthDate=models.DateField()
    is_active= models.BooleanField(default=False)
    is_staff= models.BooleanField(default=False)
    objects=UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def get_full_name(self):
        return self.name
    def __str__(self):
        return self.email
    
class Parking(models.Model):
    user = models.OneToOneField(UserAccount, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    
    # Dirección
    street = models.CharField(max_length=100)
    street_number = models.CharField(max_length=10)
    city = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    
    # Capacidades
    car_capacity = models.PositiveIntegerField(default=0)
    bike_capacity = models.PositiveIntegerField(default=0)
    moto_capacity = models.PositiveIntegerField(default=0)

    # Estado
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class ParkingPrices(models.Model):
    parking = models.OneToOneField(Parking, on_delete=models.CASCADE, related_name='prices')
    
    # Precios Auto
    car_fraction_price = models.DecimalField(max_digits=10, decimal_places=2)
    car_hour_price = models.DecimalField(max_digits=10, decimal_places=2)
    car_half_day_price = models.DecimalField(max_digits=10, decimal_places=2)
    car_full_day_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Precios Camioneta
    truck_fraction_price = models.DecimalField(max_digits=10, decimal_places=2)
    truck_hour_price = models.DecimalField(max_digits=10, decimal_places=2)
    truck_half_day_price = models.DecimalField(max_digits=10, decimal_places=2)
    truck_full_day_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Precios Moto
    moto_fraction_price = models.DecimalField(max_digits=10, decimal_places=2)
    moto_hour_price = models.DecimalField(max_digits=10, decimal_places=2)
    moto_half_day_price = models.DecimalField(max_digits=10, decimal_places=2)
    moto_full_day_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Precios Bicicleta
    bike_fraction_price = models.DecimalField(max_digits=10, decimal_places=2)
    bike_hour_price = models.DecimalField(max_digits=10, decimal_places=2)
    bike_half_day_price = models.DecimalField(max_digits=10, decimal_places=2)
    bike_full_day_price = models.DecimalField(max_digits=10, decimal_places=2)

class ParkingSchedule(models.Model):
    parking = models.OneToOneField(Parking, on_delete=models.CASCADE, related_name='schedule')
    
    monday_open_time = models.TimeField()
    monday_close_time = models.TimeField()
    tuesday_open_time = models.TimeField()
    tuesday_close_time = models.TimeField()
    wednesday_open_time = models.TimeField()
    wednesday_close_time = models.TimeField()
    thursday_open_time = models.TimeField()
    thursday_close_time = models.TimeField()
    friday_open_time = models.TimeField()
    friday_close_time = models.TimeField()
    saturday_open_time = models.TimeField()
    saturday_close_time = models.TimeField()
    sunday_open_time = models.TimeField()
    sunday_close_time = models.TimeField()
    holiday_open_time = models.TimeField()
    holiday_close_time = models.TimeField()

class ParkingFeatures(models.Model):
    parking = models.OneToOneField(Parking, on_delete=models.CASCADE, related_name='features')
    is_covered = models.BooleanField(default=False)
    has_24h_security = models.BooleanField(default=False)
    has_cctv = models.BooleanField(default=False)
    has_valet_service = models.BooleanField(default=False)
    has_disabled_parking = models.BooleanField(default=False)
    has_ev_chargers = models.BooleanField(default=False)
    has_auto_payment = models.BooleanField(default=False)
    has_card_access = models.BooleanField(default=False)
    has_car_wash = models.BooleanField(default=False)
    has_restrooms = models.BooleanField(default=False)
    has_breakdown_assistance = models.BooleanField(default=False)
    has_free_wifi = models.BooleanField(default=False)
    
class Driver(models.Model):
    user=models.OneToOneField(UserAccount,on_delete=models.CASCADE)
    name=models.CharField(max_length=100)
    surname=models.CharField(max_length=100)
    birthDate=models.DateField()
    is_active=models.BooleanField(default=False)
    is_staff=models.BooleanField(default=False)

    def __str__(self):
        return self.name