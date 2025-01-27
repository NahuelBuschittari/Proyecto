from djoser.views import UserViewSet
from rest_framework import status
from rest_framework.response import Response
from django.db import transaction
from .models import User, Driver, Parking, Prices, Schedule, Features
from datetime import datetime
from djoser.conf import settings
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView

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

@api_view(['POST'])
def UpdateParkingCharacteristics(request, parking_id):
    try:
        features = Features.objects.get(parking_id=parking_id)
        features.isCovered = request.data.get('isCovered', features.isCovered)
        features.has24hSecurity = request.data.get('has24hSecurity', features.has24hSecurity)
        features.hasCCTV = request.data.get('hasCCTV', features.hasCCTV)
        features.hasValetService = request.data.get('hasValetService', features.hasValetService)
        features.hasDisabledParking = request.data.get('hasDisabledParking', features.hasDisabledParking)
        features.hasEVChargers = request.data.get('hasEVChargers', features.hasEVChargers)
        features.hasAutoPayment = request.data.get('hasAutoPayment', features.hasAutoPayment)
        features.hasCardAccess = request.data.get('hasCardAccess', features.hasCardAccess)
        features.hasCarWash = request.data.get('hasCarWash', features.hasCarWash)
        features.hasRestrooms = request.data.get('hasRestrooms', features.hasRestrooms)
        features.hasBreakdownAssistance = request.data.get('hasBreakdownAssistance', features.hasBreakdownAssistance)
        features.hasFreeWiFi = request.data.get('hasFreeWiFi', features.hasFreeWiFi)
        features.save()
        return Response({"message": "Características actualizadas correctamente"})
    except Features.DoesNotExist:
        return Response({"error": "Estacionamiento no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UpdatePricesView(APIView):
    def put(self, request):
        vehicle_type = request.data.get('vehicleType')
        new_prices = request.data.get('prices')

        if not vehicle_type or not new_prices:
            return Response(
                {'error': 'Datos incompletos. Se requiere tipo de vehículo y precios.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            parking = Parking.objects.get(user=request.user)
            prices = parking.prices

            # Actualizar precios según el tipo de vehículo
            if vehicle_type == 'Auto':
                prices.auto_fraccion = new_prices.get('Fracción Auto', prices.auto_fraccion)
                prices.auto_hora = new_prices.get('Hora Auto', prices.auto_hora)
                prices.auto_medio_dia = new_prices.get('Medio día Auto', prices.auto_medio_dia)
                prices.auto_dia_completo = new_prices.get('Día Auto', prices.auto_dia_completo)
            elif vehicle_type == 'Camioneta':
                prices.camioneta_fraccion = new_prices.get('Fracción Camioneta', prices.camioneta_fraccion)
                prices.camioneta_hora = new_prices.get('Hora Camioneta', prices.camioneta_hora)
                prices.camioneta_medio_dia = new_prices.get('Medio día Camioneta', prices.camioneta_medio_dia)
                prices.camioneta_dia_completo = new_prices.get('Día Camioneta', prices.camioneta_dia_completo)
            elif vehicle_type == 'Moto':
                prices.moto_fraccion = new_prices.get('Fracción Moto', prices.moto_fraccion)
                prices.moto_hora = new_prices.get('Hora Moto', prices.moto_hora)
                prices.moto_medio_dia = new_prices.get('Medio día Moto', prices.moto_medio_dia)
                prices.moto_dia_completo = new_prices.get('Día Moto', prices.moto_dia_completo)
            elif vehicle_type == 'Bicicleta':
                prices.bici_fraccion = new_prices.get('Fracción Bicicleta', prices.bici_fraccion)
                prices.bici_hora = new_prices.get('Hora Bicicleta', prices.bici_hora)
                prices.bici_medio_dia = new_prices.get('Medio día Bicicleta', prices.bici_medio_dia)
                prices.bici_dia_completo = new_prices.get('Día Bicicleta', prices.bici_dia_completo)

            prices.save()

            return Response({'message': 'Precios actualizados correctamente.'}, status=status.HTTP_200_OK)

        except Parking.DoesNotExist:
            return Response(
                {'error': 'No se encontró un estacionamiento asociado al usuario.'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Ocurrió un error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['GET'])
def GetParkingDetails(request, parking_id):
    try:
        parking = Parking.objects.get(id=parking_id)
        prices = parking.prices
        schedule = parking.schedule
        
        # Obtener características
        features = Features.objects.get(parking_id=parking_id)

        data = {
            'name': parking.nombre,
            'address': f"{parking.calle} {parking.numero}, {parking.ciudad}",
            'carCapacity': parking.carCapacity,
            'bikeCapacity': parking.bikeCapacity,
            'motoCapacity': parking.motoCapacity,
            'prices': {
                'auto_fraccion': prices.auto_fraccion,
                'auto_hora': prices.auto_hora,
                'auto_medio_dia': prices.auto_medio_dia,
                'auto_dia_completo': prices.auto_dia_completo,
                'camioneta_fraccion': prices.camioneta_fraccion,
                'camioneta_hora': prices.camioneta_hora,
                'camioneta_medio_dia': prices.camioneta_medio_dia,
                'camioneta_dia_completo': prices.camioneta_dia_completo,
                'moto_fraccion': prices.moto_fraccion,
                'moto_hora': prices.moto_hora,
                'moto_medio_dia': prices.moto_medio_dia,
                'moto_dia_completo': prices.moto_dia_completo,
                'bici_fraccion': prices.bici_fraccion,
                'bici_hora': prices.bici_hora,
                'bici_medio_dia': prices.bici_medio_dia,
                'bici_dia_completo': prices.bici_dia_completo
            },
            'schedule': {
                'monday': {'open': schedule.lunes_open, 'close': schedule.lunes_close},
                'tuesday': {'open': schedule.martes_open, 'close': schedule.martes_close},
                'wednesday': {'open': schedule.miercoles_open, 'close': schedule.miercoles_close},
                'thursday': {'open': schedule.jueves_open, 'close': schedule.jueves_close},
                'friday': {'open': schedule.viernes_open, 'close': schedule.viernes_close},
                'saturday': {'open': schedule.sabado_open, 'close': schedule.sabado_close},
                'sunday': {'open': schedule.domingo_open, 'close': schedule.domingo_close},
                'holidays': {'open': schedule.feriados_open, 'close': schedule.feriados_close}
            },
            'features': {
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
                'hasFreeWiFi': features.hasFreeWiFi
            }
        }

        return Response(data)

    except Parking.DoesNotExist:
        return Response({"error": "Estacionamiento no encontrado"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def GetParkingReviews(request, parking_id):
    try:
        parking = Parking.objects.get(id=parking_id)
        reviews = parking.reviews.all()
        
        review_data = []
        for review in reviews:
            review_data.append({
                'user': review.user.username,
                'comment': review.comment,
                'rating': review.rating
            })

        return Response(review_data)

    except Parking.DoesNotExist:
        return Response({"error": "Estacionamiento no encontrado"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def GetDataAnalysis(request):
    user_id = request.query_params.get('user_id')

    if not user_id:
        return Response({"error": "user_id no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        price_evolution = get_price_evolution(user_id)
        capacity_utilization = get_capacity_utilization(user_id)
        hourly_demand = get_hourly_demand(user_id)
        vehicle_type_occupancy = get_vehicle_type_occupancy(user_id)

        data = {
            'priceEvolution': price_evolution,
            'capacityUtilization': capacity_utilization,
            'hourlyDemand': hourly_demand,
            'vehicleTypeOccupancy': vehicle_type_occupancy,
        }

        return Response(data)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

