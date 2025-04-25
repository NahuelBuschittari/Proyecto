from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from users.views import CustomUserViewSet, GetParkingCharacteristics,NavigationGetParkings, ParkingFinderGetParkings, CreateReviewView, GetOpenReview, DiscardReview, ActivationRedirectView, PasswordResetConfirmView, UpdateReviewView,GetDriverProfile, UpdateDriverProfile, UpdateParkingCharacteristics, GetParkingPrices, UpdateParkingPrices, GetParkingDetails, GetParkingReviews, GetDataAnalysis, GetParkingCapacities, UpdateParkingCapacities,GetScatterData

router = DefaultRouter()
router.register('users', CustomUserViewSet, basename='user')

urlpatterns = [
    # Rutas existentes de djoser
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    
    # Nuevas rutas para el registro personalizado
    path('api/', include(router.urls)),
    path('activate/<str:uid>/<str:token>/', ActivationRedirectView.as_view(), name='activation-redirect'),
    path('password/reset/confirm/<str:uid>/<str:token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
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
    path('parking/scatter',GetScatterData,name='get_scatter_data'),
    #Actualizar Espacios
    path('parking/<int:parking_id>/spaces/get', GetParkingCapacities, name='get-parking-capacities'),
    path('parking/<int:parking_id>/spaces/update', UpdateParkingCapacities, name='post-parking-capacities'),
    path('driver/navigation', NavigationGetParkings),
    path('driver/parkingFinder',ParkingFinderGetParkings.as_view(), name='parkingFinder'),
    path('reviews/create', CreateReviewView),
    path('reviews/getOpen', GetOpenReview),
    path('reviews/<int:review_id>/discard', DiscardReview),
    path('reviews/update', UpdateReviewView),
    path('driver/<int:driver_id>/profile', GetDriverProfile),
    path('driver/<int:driver_id>/profile/update', UpdateDriverProfile),
]