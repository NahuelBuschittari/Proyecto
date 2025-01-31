from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from users.views import CustomUserViewSet, GetParkingPrices, GetParkingCharacteristics, UpdateParkingPrices, UpdateParkingCharacteristics, GetParkingDetails, GetParkingReviews, GetDataAnalysis, GetParkingCapacities, UpdateParkingCapacities

router = DefaultRouter()
router.register('users', CustomUserViewSet, basename='user')

urlpatterns = [
    # Rutas existentes de djoser
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    
    # Nuevas rutas para el registro personalizado
    path('api/', include(router.urls)),

    #update characteristics
    path('parking/<int:parking_id>/characteristics/get', GetParkingCharacteristics, name='get-parking-characteristics'),
    path('parking/<int:parking_id>/characteristics/update', UpdateParkingCharacteristics, name='post-parking-characteristics'),

    #update prices
    path('parking/<int:parking_id>/prices/get', GetParkingPrices, name='get-parking-prices'),
    path('parking/<int:parking_id>/prices/update', UpdateParkingPrices, name='update-parking-prices'),

    #details
    path('parking/<int:parking_id>/details', GetParkingDetails, name='get_parking_details'),

    # get reseñas
    path('parking/<int:parking_id>/reviews', GetParkingReviews, name='get_parking_reviews'),

    #Análisis de datos
    path('parking/<int:parking_id>/data', GetDataAnalysis, name='get_data_analysis'),

    #Actualizar Espacios
    path('parking/<int:parking_id>/spaces/get', GetParkingCapacities, name='get-parking-capacities'),
    path('parking/<int:parking_id>/spaces/update', UpdateParkingCapacities, name='post-parking-capacities'),

]