from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model

from reservas.models import Cliente, Habitacion, Reserva
from reservas.validators import hoy


def crear_habitacion(**kwargs):
    datos = {
        'nombre': 'Habitación 1',
        'tipo': Habitacion.Tipo.DOBLE,
        'capacidad': 2,
        'precio': Decimal('45000'),
        'descripcion': 'Doble',
        'camas_info': '1 cama doble',
    }
    datos.update(kwargs)
    return Habitacion.objects.create(**datos)


def crear_cliente(**kwargs):
    datos = {'nombre': 'Ana', 'email': 'ana@example.com', 'telefono': '3001112233'}
    datos.update(kwargs)
    return Cliente.objects.create(**datos)


def crear_reserva(habitacion, cliente=None, entrada_en=1, noches=2, **kwargs):
    entrada = hoy() + timedelta(days=entrada_en)
    datos = {
        'cliente': cliente or crear_cliente(email=f'c{Cliente.objects.count()}@example.com'),
        'habitacion': habitacion,
        'fecha_entrada': entrada,
        'fecha_salida': entrada + timedelta(days=noches),
        'numero_personas': 1,
        'precio_total': Decimal('90000'),
    }
    datos.update(kwargs)
    return Reserva.objects.create(**datos)


def crear_admin():
    return get_user_model().objects.create_user('admin', password='x', is_staff=True)
