from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from users.viewsCele import CustomUserViewSet, GetParkingCharacteristics, UpdatePricesView, UpdateParkingCharacteristics, GetParkingDetails, GetParkingReviews, GetDataAnalysis

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
    path('api/prices/', UpdatePricesView.as_view(), name='update-prices'),

    #details
    path('parking/<int:parking_id>/details/', GetParkingDetails, name='get_parking_details'),

    # get reseñas
    path('parking/<int:parking_id>/reviews/', GetParkingReviews, name='get_parking_reviews'),

    #Análisis de datos
    path('data/', GetDataAnalysis, name='get_data_analysis'),

]