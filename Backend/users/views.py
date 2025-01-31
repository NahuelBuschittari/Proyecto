from djoser.views import UserViewSet
from rest_framework import status
from rest_framework.response import Response
from django.db import transaction
from .models import User, Driver, Parking, Prices, Schedule, Features, Review, PriceHistory, SpaceHistory
from datetime import datetime
from djoser.conf import settings
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from datetime import time
from django.http import HttpResponse

def format_time(t):
    return t.strftime('%H:%M') if isinstance(t, time) else None



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

@api_view(['GET'])
def GetParkingPrices(request, parking_id):
    try:
        prices = Prices.objects.get(parking_id=parking_id)
      
        data = {
            'Auto': {
                'Fracción Auto': prices.auto_fraccion,
                'Hora Auto': prices.auto_hora,
                'Medio día Auto': prices.auto_medio_dia,
                'Día Auto': prices.auto_dia_completo
            },
            'Camioneta': {
                'Fracción Camioneta': prices.camioneta_fraccion,
                'Hora Camioneta': prices.camioneta_hora,
                'Medio día Camioneta': prices.camioneta_medio_dia,
                'Día Camioneta': prices.camioneta_dia_completo
            },
            'Moto': {
                'Fracción Moto': prices.moto_fraccion,
                'Hora Moto': prices.moto_hora,
                'Medio día Moto': prices.moto_medio_dia,
                'Día Moto': prices.moto_dia_completo
            },
            'Bicicleta': {
                'Fracción Bicicleta': prices.bici_fraccion,
                'Hora Bicicleta': prices.bici_hora,
                'Medio día Bicicleta': prices.bici_medio_dia,
                'Día Bicicleta': prices.bici_dia_completo
            }
        }
        
        return Response(data, status=status.HTTP_200_OK)
        
    except Parking.DoesNotExist:
        return Response(
            {'error': 'Estacionamiento no encontrado'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def UpdateParkingPrices(request, parking_id):
    vehicle_type = request.data.get('vehicleType')
    new_prices = request.data.get('prices', {})

    if not vehicle_type or not isinstance(new_prices, dict):
        return Response(
            {'error': 'Datos incompletos. Se requiere tipo de vehículo y precios válidos.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        prices = Prices.objects.get(parking_id=parking_id)
        
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

        PriceHistory.objects.create(
            parking=prices.parking,  
            auto_fraccion=prices.auto_fraccion,
            auto_hora=prices.auto_hora,
            auto_medio_dia=prices.auto_medio_dia,
            auto_dia_completo=prices.auto_dia_completo,
            camioneta_fraccion=prices.camioneta_fraccion,
            camioneta_hora=prices.camioneta_hora,
            camioneta_medio_dia=prices.camioneta_medio_dia,
            camioneta_dia_completo=prices.camioneta_dia_completo,
            moto_fraccion=prices.moto_fraccion,
            moto_hora=prices.moto_hora,
            moto_medio_dia=prices.moto_medio_dia,
            moto_dia_completo=prices.moto_dia_completo,
            bici_fraccion=prices.bici_fraccion,
            bici_hora=prices.bici_hora,
            bici_medio_dia=prices.bici_medio_dia,
            bici_dia_completo=prices.bici_dia_completo
        )
        return Response(
        {'message': 'Precios actualizados correctamente.'}, 
        status=status.HTTP_200_OK
        )


    except Parking.DoesNotExist:
        return Response(
            {'error': 'No se encontró un estacionamiento asociado al usuario.'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def GetParkingDetails(request, parking_id):
    try:
        parking= Parking.objects.get(user_id=parking_id)
        prices = Prices.objects.get(parking_id=parking_id)
        schedule = Schedule.objects.get(parking_id=parking_id)
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
                'lunes': {'open': schedule.lunes_open, 'close': schedule.lunes_close},
                'martes': {'open': schedule.martes_open, 'close': schedule.martes_close},
                'miercoles': {'open': schedule.miercoles_open, 'close': schedule.miercoles_close},
                'jueves': {'open': schedule.jueves_open, 'close': schedule.jueves_close},
                'viernes': {'open': schedule.viernes_open, 'close': schedule.viernes_close},
                'sabado': {'open': schedule.sabado_open, 'close': schedule.sabado_close},
                'domingo': {'open': schedule.domingo_open, 'close': schedule.domingo_close},
                'feriados': {'open': schedule.feriados_open, 'close': schedule.feriados_close}
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
        reviews = Review.objects.filter(parking_id=parking_id)
        
        if not reviews:
            return Response({"error": "No hay reseñas para este estacionamiento"}, status=status.HTTP_404_NOT_FOUND)
        
        review_data = []
        for review in reviews:
            review_data.append({
                'Usuario': review.driver.nombre + ' ' + review.driver.apellido,
                'Comentario': review.comment,
                'Seguridad': review.security,
                'Limpieza': review.cleanliness,
                'Iluminación': review.lighting,
                'Accesibilidad': review.accessibility,
                'Servicio': review.service
            })

        return Response(review_data)

    except Parking.DoesNotExist:
        return Response({"error": "Estacionamiento no encontrado"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def GetDataAnalysis(request, parking_id):
    try:
        # Obtener los históricos de precios y de espacios ocupados
        price_history = PriceHistory.objects.filter(parking_id=parking_id).order_by('fecha')
        space_history = SpaceHistory.objects.filter(parking_id=parking_id).order_by('fecha')

        # Si no se encuentran registros en PriceHistory o SpaceHistory
        if not price_history:
            return Response({"error": "No hay historial de precios para este estacionamiento."}, status=status.HTTP_404_NOT_FOUND)
        
        if not space_history:
            return Response({"error": "No hay historial de ocupación para este estacionamiento."}, status=status.HTTP_404_NOT_FOUND)

        # Formatear los datos para el análisis
        price_data = []
        for entry in price_history:
            price_data.append({
                "fecha": entry.fecha,
                "auto_fraccion": entry.auto_fraccion,
                "auto_hora": entry.auto_hora,
                "auto_medio_dia": entry.auto_medio_dia,
                "auto_dia_completo": entry.auto_dia_completo,
                "camioneta_fraccion": entry.camioneta_fraccion,
                "camioneta_hora": entry.camioneta_hora,
                "camioneta_medio_dia": entry.camioneta_medio_dia,
                "camioneta_dia_completo": entry.camioneta_dia_completo,
                "moto_fraccion": entry.moto_fraccion,
                "moto_hora": entry.moto_hora,
                "moto_medio_dia": entry.moto_medio_dia,
                "moto_dia_completo": entry.moto_dia_completo,
                "bici_fraccion": entry.bici_fraccion,
                "bici_hora": entry.bici_hora,
                "bici_medio_dia": entry.bici_medio_dia,
                "bici_dia_completo": entry.bici_dia_completo,
            })
        
        space_data = []
        for entry in space_history:
            space_data.append({
                "fecha": entry.fecha,
                "car_occupied": entry.car_occupied,
                "bike_occupied": entry.bike_occupied,
                "moto_occupied": entry.moto_occupied,
            })

        # Preparar la respuesta con los datos obtenidos
        data = {
            "price_history": price_data,
            "space_history": space_data,
        }
        
        return Response(data)

    except Parking.DoesNotExist:
        return Response({"error": "Estacionamiento no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": f"Error interno: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def GetParkingCapacities(request, parking_id):
    try:
        parking = Parking.objects.get(user_id=parking_id)
        data = {
            'carCapacity': parking.carCapacity,
            'bikeCapacity': parking.bikeCapacity,
            'motoCapacity': parking.motoCapacity,
        }
        return Response(data)
    except Parking.DoesNotExist:
        return Response(
            {"error": "Estacionamiento no encontrado"}, 
            status=status.HTTP_404_NOT_FOUND
        )

import logging

# Create a logger
logger = logging.getLogger(__name__)

@api_view(['POST'])
def UpdateParkingCapacities(request, parking_id):
    try:
        logger.info(f"Updating parking capacities for parking ID {parking_id}")
        parking = Parking.objects.get(user_id=parking_id)
        parking.carCapacity = request.data.get('carCapacity', parking.carCapacity)
        parking.bikeCapacity = request.data.get('bikeCapacity', parking.bikeCapacity)
        parking.motoCapacity = request.data.get('motoCapacity', parking.motoCapacity)
        parking.save()
        
        SpaceHistory.objects.create(
            parking=parking,
            car_occupied=parking.carCapacity,  
            bike_occupied=parking.bikeCapacity,  
            moto_occupied=parking.motoCapacity,  
        )
        logger.info(f"Parking capacities updated successfully for parking ID {parking_id}")
        return Response({"message": "Capacidades del estacionamiento actualizadas correctamente"})
    except Parking.DoesNotExist:
        logger.error(f"Parking not found for ID {parking_id}")
        return Response({"error": "Estacionamiento no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error updating parking capacities for ID {parking_id}: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)