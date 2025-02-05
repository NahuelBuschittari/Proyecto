from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from users.views import CustomUserViewSet, GetParkingCharacteristics,NavigationGetParkings, CreateReviewView, GetOpenReview, DiscardReview, ActivationRedirectView, PasswordResetConfirmView, UpdateReviewView, GetDriverProfile, UpdateDriverProfile


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
    path('parking/<int:parking_id>/characteristics', GetParkingCharacteristics),
    path('driver/navigation', NavigationGetParkings),
    path('reviews/create', CreateReviewView),
    path('reviews/getOpen', GetOpenReview),
    path('reviews/<int:review_id>/discard', DiscardReview),
    path('reviews/update', UpdateReviewView),
    path('driver/<int:driver_id>/profile', GetDriverProfile),
    path('driver/<int:driver_id>/profile/update', UpdateDriverProfile),
]