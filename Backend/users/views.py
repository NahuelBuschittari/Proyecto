from djoser.views import UserViewSet
from rest_framework import status
from rest_framework.response import Response
from django.db import transaction
from .models import User, Driver, Parking, Prices, Schedule, Features, Review
from datetime import datetime
from djoser.conf import settings
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404

class CustomUserViewSet(UserViewSet):

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        # Extraer y validar los datos básicos del usuario
        user_data = {
            'email': request.data.get('email'),
            'password': request.data.get('password'),
            're_password': request.data.get('re_password'),
            'isParking': request.data.get('isParking', False)
        }
        
        # Verificar que las contraseñas coincidan
        if request.data.get('password') != request.data.get('re_password'):
            return Response(
                {'error': 'Las contraseñas no coinciden'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Crear el usuario usando el serializador de djoser
        serializer = self.get_serializer(data=user_data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        try:
            if user.isParking:
                # Crear estacionamiento
                parking = Parking.objects.create(
                    user=user,
                    nombre=request.data.get('nombre'),
                    calle=request.data.get('calle'),
                    numero=request.data.get('numero'),
                    ciudad=request.data.get('ciudad'),
                    latitude=request.data.get('latitude'),
                    longitude=request.data.get('longitude'),
                    carCapacity=request.data.get('carCapacity'),
                    bikeCapacity=request.data.get('bikeCapacity'),
                    motoCapacity=request.data.get('motoCapacity')
                )

                # Crear precios
                Prices.objects.create(
                    parking=parking,
                    auto_fraccion=request.data.get('auto_fraccion'),
                    auto_hora=request.data.get('auto_hora'),
                    auto_medio_dia=request.data.get('auto_medio_dia'),
                    auto_dia_completo=request.data.get('auto_dia_completo'),
                    camioneta_fraccion=request.data.get('camioneta_fraccion'),
                    camioneta_hora=request.data.get('camioneta_hora'),
                    camioneta_medio_dia=request.data.get('camioneta_medio_dia'),
                    camioneta_dia_completo=request.data.get('camioneta_dia_completo'),
                    moto_fraccion=request.data.get('moto_fraccion'),
                    moto_hora=request.data.get('moto_hora'),
                    moto_medio_dia=request.data.get('moto_medio_dia'),
                    moto_dia_completo=request.data.get('moto_dia_completo'),
                    bici_fraccion=request.data.get('bici_fraccion'),
                    bici_hora=request.data.get('bici_hora'),
                    bici_medio_dia=request.data.get('bici_medio_dia'),
                    bici_dia_completo=request.data.get('bici_dia_completo')
                )

                # Crear horarios
                Schedule.objects.create(
                    parking=parking,
                    lunes_open=request.data.get('lunes_open'),
                    lunes_close=request.data.get('lunes_close'),
                    martes_open=request.data.get('martes_open'),
                    martes_close=request.data.get('martes_close'),
                    miercoles_open=request.data.get('miercoles_open'),
                    miercoles_close=request.data.get('miercoles_close'),
                    jueves_open=request.data.get('jueves_open'),
                    jueves_close=request.data.get('jueves_close'),
                    viernes_open=request.data.get('viernes_open'),
                    viernes_close=request.data.get('viernes_close'),
                    sabado_open=request.data.get('sabado_open'),
                    sabado_close=request.data.get('sabado_close'),
                    domingo_open=request.data.get('domingo_open'),
                    domingo_close=request.data.get('domingo_close'),
                    feriados_open=request.data.get('feriados_open'),
                    feriados_close=request.data.get('feriados_close')
                )

                # Crear características
                Features.objects.create(
                    parking=parking,
                    isCovered=request.data.get('isCovered', False),
                    has24hSecurity=request.data.get('has24hSecurity', False),
                    hasCCTV=request.data.get('hasCCTV', False),
                    hasValetService=request.data.get('hasValetService', False),
                    hasDisabledParking=request.data.get('hasDisabledParking', False),
                    hasEVChargers=request.data.get('hasEVChargers', False),
                    hasAutoPayment=request.data.get('hasAutoPayment', False),
                    hasCardAccess=request.data.get('hasCardAccess', False),
                    hasCarWash=request.data.get('hasCarWash', False),
                    hasRestrooms=request.data.get('hasRestrooms', False),
                    hasBreakdownAssistance=request.data.get('hasBreakdownAssistance', False),
                    hasFreeWiFi=request.data.get('hasFreeWiFi', False)
                )
            else:
                # Crear conductor
                Driver.objects.create(
                    user=user,
                    nombre=request.data.get('nombre'),
                    apellido=request.data.get('apellido'),
                    fecha_nacimiento=datetime.strptime(
                        request.data.get('fecha_nacimiento'), 
                        '%Y-%m-%d'
                    ).date()
                )
            if settings.SEND_ACTIVATION_EMAIL:
                    context = {'user': user}
                    to = [user.email]
                    settings.EMAIL.activation(self.request, context).send(to)    
        except Exception as e:
            # Si algo falla, eliminar el usuario y propagar el error
            user.delete()
            raise e

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, 
            status=status.HTTP_201_CREATED, 
            headers=headers
        )

@api_view(['GET'])
def GetParkingCharacteristics(request, parking_id):
    try:
        features = Features.objects.get(parking_id=parking_id)
        data = {
            'isCovered': features.isCovered,
            'has24hSecurity': features.has24hSecurity,
            'hasCCTV': features.hasCCTV,
            'hasValetService': features.hasValetService,
            'hasDisabledParking': features.hasDisabledParking,
            'hasEVChargers': features.hasEVChargers,
            'hasAutoPayment': features.hasAutoPayment,
            'hasCardAccess': features.hasCardAccess,
            'hasCarWash': features.hasCarWash,
            'hasRestrooms': features.hasRestrooms,
            'hasBreakdownAssistance': features.hasBreakdownAssistance,
            'hasFreeWiFi': features.hasFreeWiFi,
        }
        return Response(data)
    except Features.DoesNotExist:
        return Response(
            {"error": "Características no encontradas"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
@api_view(['GET'])
def NavigationGetParkings(request):
    """
    Get all available parkings with their features, schedules, and prices
    filtered by vehicle type and current day
    """
    try:
        # Get query parameters
        vehicle_type = request.query_params.get('vehicle_type')  # Tipo de vehículo
        #current_day = request.query_params.get('day')  # Día que viene del frontend
        current_day="L"
        print("vehicle_type", vehicle_type)
        print("current_day", current_day)
        hora_actual = datetime.now().time()
        print("Hora actual:", hora_actual)
        # Mapeo de abreviaciones a nombres completos de días
        day_mapping = {
            'L': 'lunes',
            'Ma': 'martes',
            'Mi': 'miercoles',
            'J': 'jueves',
            'V': 'viernes',
            'S': 'sabado',
            'D': 'domingo',
            'F': 'feriados'  # Agregamos el caso de feriados
        }
        
        # Convertir la abreviación a nombre completo
        schedule_day = day_mapping[current_day]
        print("schedule_day",schedule_day)
        # Get all parkings with their related data using select_related
        parkings = Parking.objects.select_related('features', 'schedule', 'prices').all()
        
        available_parkings = []
        
        for parking in parkings:
            # Check capacity based on vehicle type
            capacity = 0
            if vehicle_type in ['car-side', 'truck-pickup']:
                capacity = parking.carCapacity
            elif vehicle_type == 'motorcycle':
                capacity = parking.motoCapacity
            elif vehicle_type == 'bicycle':
                capacity = parking.bikeCapacity

            print("capacity",capacity)
            # Only include parking if there's available capacity
            if capacity > 0:
                # Get opening and closing times for current day
                open_time = getattr(parking.schedule, f'{schedule_day}_open')
                close_time = getattr(parking.schedule, f'{schedule_day}_close')
                if open_time<hora_actual and close_time>hora_actual:
                    parking_data = {
                        'userData': {
                            'id': parking.user.id,
                            'name': parking.nombre,
                            'address': {
                                'latitude': float(parking.latitude),
                                'longitude': float(parking.longitude),
                                'street': parking.calle,
                                'number': parking.numero,
                                'city': parking.ciudad
                            }
                        },
                        'capacities': {
                            'carCapacity': parking.carCapacity,
                            'motoCapacity': parking.motoCapacity,
                            'bikeCapacity': parking.bikeCapacity
                        },
                        'schedule': {
                                'openTime': open_time.strftime('%H:%M'),
                                'closeTime': close_time.strftime('%H:%M')
                        },
                        'prices': {
                            'Auto': {
                                'fraccion': float(parking.prices.auto_fraccion),
                                'hora': float(parking.prices.auto_hora),
                                'medio dia': float(parking.prices.auto_medio_dia),
                                'dia completo': float(parking.prices.auto_dia_completo)
                            },
                            'Camioneta': {
                                'fraccion': float(parking.prices.camioneta_fraccion),
                                'hora': float(parking.prices.camioneta_hora),
                                'medio dia': float(parking.prices.camioneta_medio_dia),
                                'dia completo': float(parking.prices.camioneta_dia_completo)
                            },
                            'Moto': {
                                'fraccion': float(parking.prices.moto_fraccion),
                                'hora': float(parking.prices.moto_hora),
                                'medio dia': float(parking.prices.moto_medio_dia),
                                'dia completo': float(parking.prices.moto_dia_completo)
                            },
                            'Bicicleta': {
                                'fraccion': float(parking.prices.bici_fraccion),
                                'hora': float(parking.prices.bici_hora),
                                'medio dia': float(parking.prices.bici_medio_dia),
                                'dia completo': float(parking.prices.bici_dia_completo)
                            }
                        },
                        'features': {
                            'isCovered': parking.features.isCovered,
                            'has24hSecurity': parking.features.has24hSecurity,
                            'hasCCTV': parking.features.hasCCTV,
                            'hasValetService': parking.features.hasValetService,
                            'hasDisabledParking': parking.features.hasDisabledParking,
                            'hasEVChargers': parking.features.hasEVChargers,
                            'hasAutoPayment': parking.features.hasAutoPayment,
                            'hasCardAccess': parking.features.hasCardAccess,
                            'hasCarWash': parking.features.hasCarWash,
                            'hasRestrooms': parking.features.hasRestrooms,
                            'hasBreakdownAssistance': parking.features.hasBreakdownAssistance,
                            'hasFreeWiFi': parking.features.hasFreeWiFi
                        }
                    }
                    available_parkings.append(parking_data)

        return Response(available_parkings)

    except Exception as e:
        return Response(
            {"error": f"Error al obtener los estacionamientos: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def GetOpenReviews(request):
    driver_id = request.query_params.get('driver_id')
    try:
        # Utilizamos select_related para hacer el join con Parking
        reviews = Review.objects.filter(
            driver_id=driver_id, 
            isClosed=False
        ).select_related('parking')
        
        data = [
            {
                "id": review.id,
                "parking": {
                    "id": review.parking_id,
                    "nombre": review.parking.nombre,
                    "calle": review.parking.calle,
                    "numero": review.parking.numero,
                    "ciudad": review.parking.ciudad
                }
            }
            for review in reviews
        ]
        return Response(data)
    except Exception as e:
        return Response(
            {"error": f"Error al obtener las reseñas: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['POST'])
def CreateReviewView(request):
    # Obtener los datos de la solicitud
    id_parking = request.data.get('idParking')
    id_driver = request.data.get('idDriver')

    # Validar que el estacionamiento y el conductor existan
    parking = get_object_or_404(Parking, user_id=id_parking)
    driver = get_object_or_404(Driver, user_id=id_driver)

    # Verificar que no exista una reseña previa entre este parking y driver
    if Review.objects.filter(parking=parking, driver=driver).exists():
        return Response({"error": "A review already exists for this parking and driver."}, 
                        status=status.HTTP_400_BAD_REQUEST)

    # Crear la nueva reseña con valores por defecto
    review = Review.objects.create(parking=parking, driver=driver)

    return Response({
        "id": review.id,
        "parking": review.parking.user_id,
        "driver": review.driver.user_id,
        "isClosed": review.isClosed,
        "security": review.security,
        "cleanliness": review.cleanliness,
        "lighting": review.lighting,
        "accessibility": review.accessibility,
        "service": review.service,
        "comment": review.comment
    }, status=status.HTTP_201_CREATED)