from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.timezone import now
class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Los usuarios deben tener un email")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    isParking = models.BooleanField(default=False)
    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['isParking']

    def __str__(self):
        return self.email
    
class Driver(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='driver')
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField()
    REQUIRED_FIELDS = ['nombre', 'apellido', 'fecha_nacimiento']
    def __str__(self):
        return f"{self.nombre} {self.apellido}"

class Parking(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='parking')
    nombre = models.CharField(max_length=200)
    calle = models.CharField(max_length=200)
    numero = models.CharField(max_length=20)
    ciudad = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    carCapacity = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    bikeCapacity = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    motoCapacity = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    periodo_prueba = models.BooleanField(default=True)  # Estado inicial en False
    fecha_activacion = models.DateTimeField(null=True, blank=True)  # Fecha de activación de la cuenta
    REQUIRED_FIELDS = ['nombre', 'calle', 'numero', 'ciudad', 'latitude', 'longitude', 'carCapacity', 'bikeCapacity', 'motoCapacity']
    def __str__(self):
        return self.nombre
    
class Prices(models.Model):
    parking = models.OneToOneField(Parking, on_delete=models.CASCADE,primary_key=True, related_name='prices')
    
    # Precios para Auto
    auto_fraccion = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    auto_hora = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    auto_medio_dia = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    auto_dia_completo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Precios para Camioneta
    camioneta_fraccion = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    camioneta_hora = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    camioneta_medio_dia = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    camioneta_dia_completo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Precios para Moto
    moto_fraccion = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    moto_hora = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    moto_medio_dia = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    moto_dia_completo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Precios para Bicicleta
    bici_fraccion = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bici_hora = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bici_medio_dia = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bici_dia_completo = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    REQUIRED_FIELDS = ['auto_fraccion', 'auto_hora', 'auto_medio_dia', 'auto_dia_completo', 'camioneta_fraccion', 'camioneta_hora', 'camioneta_medio_dia', 'camioneta_dia_completo', 'moto_fraccion', 'moto_hora', 'moto_medio_dia', 'moto_dia_completo', 'bici_fraccion', 'bici_hora', 'bici_medio_dia', 'bici_dia_completo']

class PriceHistory(models.Model):
    parking = models.ForeignKey(Parking, on_delete=models.CASCADE, related_name='price_history')
    fecha = models.DateField(auto_now_add=True)  # Fecha en la que se registró el precio
    auto_fraccion = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    auto_hora = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    auto_medio_dia = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    auto_dia_completo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    camioneta_fraccion = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    camioneta_hora = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    camioneta_medio_dia = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    camioneta_dia_completo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    moto_fraccion = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    moto_hora = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    moto_medio_dia = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    moto_dia_completo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    bici_fraccion = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bici_hora = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bici_medio_dia = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bici_dia_completo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    def __str__(self):
        return f"Historial de precios de {self.parking.nombre} - {self.fecha}"

    class Meta:
        ordering = ['fecha']


class SpaceHistory(models.Model):
    parking = models.ForeignKey(Parking, on_delete=models.CASCADE, related_name='space_history')
    fecha = models.DateField(auto_now_add=True)  
    car_occupied = models.PositiveIntegerField(default=0)
    bike_occupied = models.PositiveIntegerField(default=0)
    moto_occupied = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return f"Historial de ocupación de {self.parking.nombre} - {self.fecha}"

    class Meta:
        ordering = ['fecha']

class Schedule(models.Model):
    parking = models.OneToOneField(Parking, on_delete=models.CASCADE,primary_key=True, related_name='schedule')
    
    # Horarios para cada día
    lunes_open = models.TimeField()
    lunes_close = models.TimeField()
    martes_open = models.TimeField()
    martes_close = models.TimeField()
    miercoles_open = models.TimeField()
    miercoles_close = models.TimeField()
    jueves_open = models.TimeField()
    jueves_close = models.TimeField()
    viernes_open = models.TimeField()
    viernes_close = models.TimeField()
    sabado_open = models.TimeField()
    sabado_close = models.TimeField()
    domingo_open = models.TimeField()
    domingo_close = models.TimeField()
    feriados_open = models.TimeField()
    feriados_close = models.TimeField()

    REQUIRED_FIELDS = ['lunes_open', 'lunes_close', 'martes_open', 'martes_close', 'miercoles_open', 'miercoles_close', 'jueves_open', 'jueves_close', 'viernes_open', 'viernes_close', 'sabado_open', 'sabado_close', 'domingo_open', 'domingo_close', 'feriados_open', 'feriados_close']

class Features(models.Model):
    parking = models.OneToOneField(Parking, on_delete=models.CASCADE,primary_key=True, related_name='features')
    
    isCovered = models.BooleanField(default=False)
    has24hSecurity = models.BooleanField(default=False)
    hasCCTV = models.BooleanField(default=False)
    hasValetService = models.BooleanField(default=False)
    hasDisabledParking = models.BooleanField(default=False)
    hasEVChargers = models.BooleanField(default=False)
    hasAutoPayment = models.BooleanField(default=False)
    hasCardAccess = models.BooleanField(default=False)
    hasCarWash = models.BooleanField(default=False)
    hasRestrooms = models.BooleanField(default=False)
    hasBreakdownAssistance = models.BooleanField(default=False)
    hasFreeWiFi = models.BooleanField(default=False)

    REQUIRED_FIELDS = ['isCovered', 'has24hSecurity', 'hasCCTV', 'hasValetService', 'hasDisabledParking', 'hasEVChargers', 'hasAutoPayment', 'hasCardAccess', 'hasCarWash', 'hasRestrooms', 'hasBreakdownAssistance', 'hasFreeWiFi']

class Review(models.Model):
    id = models.AutoField(primary_key=True)
    parking = models.ForeignKey(Parking, on_delete=models.CASCADE, related_name='reviews')
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='reviews')
    isClosed = models.BooleanField(default=False)
    security = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    cleanliness = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    lighting = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    accessibility = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    service = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    comment = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ['parking', 'driver']

    REQUIRED_FIELDS = ['security', 'cleanliness', 'lighting', 'accessibility', 'service','comment']

