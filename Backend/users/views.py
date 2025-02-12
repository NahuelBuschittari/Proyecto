import os
from math import sin, cos, sqrt, atan2, radians
from djoser.views import UserViewSet
from rest_framework import status
import requests
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Q
from django.views import View
from .models import User, Driver, Parking, Prices, Schedule, Features, Review
from datetime import datetime
from djoser.conf import settings
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from rest_framework.views import APIView
from django.core.exceptions import ValidationError
from rest_framework.exceptions import ParseError
from .serializers import ParkingSerializer

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
        queryset = Parking.objects.select_related('features', 'schedule', 'prices').all()
        # Validación del día
        current_day = request.query_params.get('day')
        valid_days = {'L', 'Ma', 'Mi', 'J', 'V', 'S', 'D', 'F'}
        if current_day and current_day not in valid_days:
            raise ParseError(f"Invalid day code: {current_day}")
        
        # Validación y filtrado por capacidad
        vehicle_type = request.query_params.get('vehicle_type', 'car-side')
        if vehicle_type not in ['car-side', 'truck-pickup', 'motorcycle', 'bicycle']:
            raise ParseError(f"Invalid vehicle_type: {vehicle_type}")

        capacity_map = {
            'car-side': 'carCapacity',
            'truck-pickup': 'carCapacity',
            'motorcycle': 'motoCapacity',
            'bicycle': 'bikeCapacity'
        }
        capacity_field = capacity_map[vehicle_type]

        # Filtrar por capacidad
        queryset = queryset.filter(**{f'{capacity_field}__gt': 0})

        if current_day:
            day_map = {
                'L': 'lunes',
                'Ma': 'martes',
                'Mi': 'miercoles',
                'J': 'jueves',
                'V': 'viernes',
                'S': 'sabado',
                'D': 'domingo',
                'F': 'feriados'
            }
            schedule_day = day_map[current_day]
            current_time = datetime.now().time()
            queryset = queryset.filter(
                Q(**{f'schedule__{schedule_day}_open__lte': current_time}) &
                Q(**{f'schedule__{schedule_day}_close__gte': current_time})
            )

       # Serialización
        try:
            serialized_parkings = ParkingSerializer(queryset, many=True).data
            print("serialized_parkings",serialized_parkings)
            return Response(serialized_parkings)
        except Exception as e:
            raise ParseError(f"Error serializing parking data: {str(e)}")

    except ParseError as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except ValidationError as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"error": "An unexpected error occurred", "detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    except Exception as e:
        return Response(
            {"error": f"Error al obtener los estacionamientos: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class ParkingFinderGetParkings(APIView):
    def calculate_distance(self, lat1, lon1, lat2, lon2):
        R = 6371000  # Earth's radius in meters
        lat1, lon1, lat2, lon2 = map(radians, [float(lat1), float(lon1), float(lat2), float(lon2)])
        
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        
        return round((R * c) / 100)
    
    def post(self, request):
        try:
            # Feature filters
            feature_filters = {}
            valid_features = [
                'isCovered', 'has24hSecurity', 'hasEVChargers', 'hasCCTV',
                'hasValetService', 'hasDisabledParking', 'hasAutoPayment',
                'hasCardAccess', 'hasCarWash', 'hasRestrooms',
                'hasBreakdownAssistance', 'hasFreeWiFi'
            ]

            for feature in valid_features:
                value = request.data.get(feature)
                if isinstance(value, bool):
                    feature_filters[feature] = value
                elif value is not None:
                    raise ParseError(f"Invalid boolean value for {feature}")

            # Validación y filtrado por capacidad
            vehicle_type = request.data.get('vehicle_type', 'Auto')
            if vehicle_type not in ['Auto', 'Camioneta', 'Moto', 'Bicicleta']:
                raise ParseError(f"Invalid vehicle_type: {vehicle_type}")

            capacity_map = {
                'Auto': 'carCapacity',
                'Camioneta': 'carCapacity',
                'Moto': 'motoCapacity',
                'Bicicleta': 'bikeCapacity'
            }
            capacity_field = capacity_map[vehicle_type]

            # Validación del día
            current_day = request.data.get('current_day')
            valid_days = {'L', 'Ma', 'Mi', 'J', 'V', 'S', 'D', 'F'}
            if current_day and current_day not in valid_days:
                raise ParseError(f"Invalid day code: {current_day}")

            # Time-related filters
            open_now = request.data.get('open_now', '') == 'true'
            selected_start_time = request.data.get('selected_start_time')
            selected_end_time = request.data.get('selected_end_time')

            # Validación de horarios
            if selected_start_time and selected_end_time:
                try:
                    datetime.strptime(selected_start_time, '%H:%M')
                    datetime.strptime(selected_end_time, '%H:%M')
                except ValueError:
                    raise ParseError("Invalid time format. Use HH:MM format")
                
            max_price = request.data.get('max_price')
            max_price = float(max_price) if max_price else None
            price_type = request.data.get('price_type', 'hora')

            # Base query
            queryset = Parking.objects.select_related('features', 'schedule', 'prices').all()

            # Aplicar filtros de características
            for feature, value in feature_filters.items():
                if value is True:
                    queryset = queryset.filter(**{f'features__{feature}': True})

            # Filtrar por capacidad
            queryset = queryset.filter(**{f'{capacity_field}__gt': 0})

            # Filtrado por horario
            if current_day:
                day_map = {
                    'L': 'lunes',
                    'Ma': 'martes',
                    'Mi': 'miercoles',
                    'J': 'jueves',
                    'V': 'viernes',
                    'S': 'sabado',
                    'D': 'domingo',
                    'F': 'feriados'
                }
                schedule_day = day_map[current_day]

                if open_now:
                    current_time = datetime.now().time()
                    queryset = queryset.filter(
                        Q(**{f'schedule__{schedule_day}_open__lte': current_time}) &
                        Q(**{f'schedule__{schedule_day}_close__gte': current_time})
                    )
                elif selected_start_time and selected_end_time:
                    queryset = queryset.filter(
                        Q(**{f'schedule__{schedule_day}_open__lte': selected_start_time}) &
                        Q(**{f'schedule__{schedule_day}_close__gte': selected_end_time})
                    )

            # Filtrado por precio
            if max_price is not None:
                price_field_map = {
                    'Auto': f'auto_{price_type}',
                    'Camioneta': f'camioneta_{price_type}',
                    'Moto': f'moto_{price_type}',
                    'Bicicleta': f'bici_{price_type}'
                }
                price_field = price_field_map[vehicle_type]
                queryset = queryset.filter(**{f'prices__{price_field}__lte': max_price})
            # Filtrar por distancia
            origin_lat = request.data.get('latitude')
            origin_lon = request.data.get('longitude')
            max_distance = request.data.get('max_distance')
            
            if origin_lat and origin_lon:
                try:
                    # origin_lat = float(origin_lat)
                    # origin_lon = float(origin_lon)
                    
                    max_distance = float(max_distance) if max_distance else None
                except ValueError:
                    raise ParseError("Invalid numeric values for latitude, longitude, or max_distance")
                
                parkings_list = list(queryset)
                for parking in parkings_list:
                    print(f"origin_lat: {type(origin_lat)} = {origin_lat}")
                    print(f"origin_lon: {type(origin_lon)} = {origin_lon}")
                    print(f"parking.latitude: {type(parking.latitude)} = {parking.latitude}")
                    print(f"parking.longitude: {type(parking.longitude)} = {parking.longitude}")
                    parking.distance = self.calculate_distance(origin_lat, origin_lon, parking.latitude, parking.longitude)
                
                if max_distance is not None:
                    parkings_list = [p for p in parkings_list if p.distance <= max_distance]
                
                parkings_list.sort(key=lambda x: x.distance)
                queryset = parkings_list

            # Serialización
            try:
                serialized_parkings = ParkingSerializer(queryset, many=True).data
                print("serialized_parkings",serialized_parkings)
                return Response(serialized_parkings)
            except Exception as e:
                raise ParseError(f"Error serializing parking data: {str(e)}")

        except ParseError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except ValidationError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": "An unexpected error occurred", "detail": str(e)},
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