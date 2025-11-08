# carpeta reservas/urls.py

from .views import pre_reserva
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HabitacionViewSet, 
    ReservaViewSet, 
    ClienteViewSet, 
    SitioTuristicoViewSet,
    CalendarioView,
    CalendarioHabitacionView,
    ReservaCalendarioViewSet,
    InformacionHostalView
    
)

# Router de DRF (genera automáticamente las URLs)
router = DefaultRouter()
router.register(r'habitaciones', HabitacionViewSet, basename='habitacion')
router.register(r'reservas', ReservaViewSet, basename='reserva')
router.register(r'clientes', ClienteViewSet, basename='cliente')
router.register(r'sitios-turisticos', SitioTuristicoViewSet, basename='sitio-turistico')
router.register(r'calendario/reservas', ReservaCalendarioViewSet, basename='calendario-reserva')



urlpatterns = [
    path('', include(router.urls)),
    path('pre-reserva/', pre_reserva, name="pre_reserva"),
    path('calendario/', CalendarioView.as_view(), name='calendario'),
    path('calendario/habitacion/<int:habitacion_id>/', CalendarioHabitacionView.as_view(), name='calendario-habitacion'),
    path('informacion-hostal/', InformacionHostalView.as_view(), name='informacion-hostal'),
]

