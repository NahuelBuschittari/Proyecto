# from django.urls import path, include, re_path
# from django.views.generic import TemplateView
# urlpatterns = [
#     path('auth/', include('djoser.urls')),
#     path('auth/', include('djoser.urls.jwt')),
# ]

# urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]

from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from users.views import CustomUserViewSet

router = DefaultRouter()
router.register('users', CustomUserViewSet, basename='user')

urlpatterns = [
    # Rutas existentes de djoser
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    
    # Nuevas rutas para el registro personalizado
    path('api/', include(router.urls)),
]

# Mantener la ruta catch-all para el frontend
urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]