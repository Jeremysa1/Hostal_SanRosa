
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HabitacionViewSet, ReservaViewSet, ClienteViewSet

# Router de DRF (genera automáticamente las URLs)
router = DefaultRouter()
router.register(r'habitaciones', HabitacionViewSet, basename='habitacion')
router.register(r'reservas', ReservaViewSet, basename='reserva')
router.register(r'clientes', ClienteViewSet, basename='cliente')

urlpatterns = [
    path('', include(router.urls)),
]

