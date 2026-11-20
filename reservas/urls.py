from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'habitaciones', views.HabitacionViewSet, basename='habitacion')
router.register(r'reservas', views.ReservaViewSet, basename='reserva')
router.register(r'clientes', views.ClienteViewSet, basename='cliente')
router.register(r'sitios-turisticos', views.SitioTuristicoViewSet, basename='sitio-turistico')
router.register(r'calendario/reservas', views.ReservaCalendarioViewSet, basename='calendario-reserva')

urlpatterns = [
    path('', include(router.urls)),
    path('pre-reserva/', views.pre_reserva, name='pre_reserva'),
    path('calendario/', views.CalendarioView.as_view(), name='calendario'),
    path(
        'calendario/habitacion/<int:habitacion_id>/',
        views.CalendarioHabitacionView.as_view(),
        name='calendario-habitacion',
    ),
    path('informacion-hostal/', views.InformacionHostalView.as_view(), name='informacion-hostal'),
]
