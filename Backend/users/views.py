import os
from djoser.views import UserViewSet
from rest_framework import status
import requests
from rest_framework.response import Response
from django.db import transaction
from django.views import View
from .models import User, Driver, Parking, Prices, Schedule, Features, Review
from datetime import datetime
from djoser.conf import settings
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from rest_framework.exceptions import PermissionDenied

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
        current_day = request.query_params.get('day')  # Día que viene del frontend
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
def GetOpenReview(request):
    driver_id = request.query_params.get('driver_id')
    try:
        # Utilizamos select_related para optimizar el join con Parking
        review = Review.objects.filter(
            driver_id=driver_id, 
            isClosed=False
        ).select_related('parking').first()
        
        if review:
            data = {
                "id": review.id,
                "parking": {
                    "id": review.parking_id,
                    "nombre": review.parking.nombre,
                    "calle": review.parking.calle,
                    "numero": review.parking.numero,
                    "ciudad": review.parking.ciudad
                }
            }
            return Response(data)
        else:
            return Response(
                {"message": "No se encontraron reseñas abiertas para este conductor."},
                status=status.HTTP_404_NOT_FOUND
            )
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

@api_view(['DELETE'])
def DiscardReview(request,review_id):
    try:
        # Intentar obtener la reseña por su ID
        review = Review.objects.get(id=review_id)
        review.delete()  # Eliminar la reseña de la base de datos
        return Response(
            {"message": "La reseña ha sido eliminada con éxito."},
            status=status.HTTP_200_OK
        )
    except Review.DoesNotExist:
        return Response(
            {"error": "Reseña no encontrada."},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": f"Error al eliminar la reseña: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class ActivationRedirectView(View):
    def get(self, request, uid, token):
        api_url = os.getenv('API_URL', '')
        # URL del endpoint de activación de djoser
        activation_endpoint = f'{api_url}/auth/users/activation/' #Cambiar por url en constants.js
        
        # Datos para la activación
        activation_data = {
            'uid': uid,
            'token': token
        }
        
        try:
            # Realizar la petición POST al endpoint de activación
            response = requests.post(activation_endpoint, json=activation_data)
            
            if response.status_code == 204:
                # Redirigir a una página de éxito
                return render(request,'activation-success.html')
            else:
                # Redirigir a una página de error
                return render(request,'activation-error.html')
                
        except requests.RequestException:
            return render(request,'activation-error.html')
        
class PasswordResetConfirmView(View):
    
    def get(self, request, uid, token):
        api_url = os.getenv('API_URL', '')
        return render(request, 'password_reset_form.html', {'uid': uid, 'token': token, 'api_url': api_url})

    def post(self, request, uid, token):
        api_url = os.getenv('API_URL', '')
        """ Maneja la solicitud de restablecimiento de contraseña """
        new_password = request.POST.get('new_password')
        re_new_password = request.POST.get('re_new_password')

        reset_endpoint = f'{api_url}/auth/users/reset_password_confirm/'

        data = {
            'uid': uid,
            'token': token,
            'new_password': new_password,
            're_new_password': re_new_password
        }

        try:
            response = requests.post(reset_endpoint, json=data)

            if response.status_code == 204:  # Éxito
                return render(request, 'password_reset_success.html')

            elif response.status_code == 400:  # Error
                error_message = response.json()
                return render(request, 'password_reset_form.html', {'uid': uid, 'token': token, 'error': error_message})

        except requests.RequestException:
            return render(request, 'password_reset_form.html', {'uid': uid, 'token': token, 'error': 'Error en la conexión con el servidor.'})

@api_view(['POST'])
def UpdateReviewView(request):
    try:
        review_id = request.data.get('id_review')
        review = Review.objects.get(id=review_id)
        review.security = request.data.get('security', review.security)
        review.cleanliness = request.data.get('cleanliness', review.cleanliness)
        review.lighting = request.data.get('lighting', review.lighting)
        review.accessibility = request.data.get('accessibility', review.accessibility)
        review.service = request.data.get('service', review.service)
        review.comment = request.data.get('comment', review.comment)
        review.isClosed = True  
        review.save()
        
        return Response({"message": "Review actualizada correctamente"})
    except Review.DoesNotExist:
        return Response({"error": "Review no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def GetDriverProfile(request, driver_id):
    try:
        driver = Driver.objects.get(user_id=driver_id)
        data = {
            'nombre': driver.nombre,
            'apellido': driver.apellido,
            'fecha_nacimiento': driver.fecha_nacimiento,
            'email': driver.user.email
        }
        return Response(data)
    except Driver.DoesNotExist:
        return Response(
            {"error": "Conductor no encontrado"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    

@api_view(['PUT'])
def UpdateDriverProfile(request, driver_id):
    try:
        driver = Driver.objects.get(user_id=driver_id)
        driver.nombre = request.data.get('nombre', driver.nombre)
        driver.apellido = request.data.get('apellido', driver.apellido)
        driver.fecha_nacimiento = request.data.get('fecha_nacimiento', driver.fecha_nacimiento)
        driver.save()
        return Response({"message": "Perfil actualizado correctamente"})
    except Driver.DoesNotExist:
        return Response(
            {"error": "Conductor no encontrado"}, 
            status=status.HTTP_404_NOT_FOUND
        )