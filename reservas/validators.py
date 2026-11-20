"""
Reglas de negocio para validar reservas.

Lanzan ``django.core.exceptions.ValidationError`` para poder usarse tanto desde
serializers como desde formularios o el admin.
"""

from django.core.exceptions import ValidationError
from django.utils import timezone

from .models import Reserva

DIAS_MINIMOS_RESERVA = 1
DIAS_MAXIMOS_RESERVA = 30


def hoy():
    """Fecha actual en la zona horaria del proyecto (America/Bogota)."""
    return timezone.localdate()


def validar_fechas_reserva(fecha_entrada, fecha_salida):
    """La entrada debe ser anterior a la salida y no estar en el pasado."""
    if fecha_entrada >= fecha_salida:
        raise ValidationError('La fecha de entrada debe ser anterior a la fecha de salida')

    fecha_hoy = hoy()
    if fecha_entrada < fecha_hoy:
        raise ValidationError(f'La fecha de entrada no puede ser anterior a hoy ({fecha_hoy})')


def validar_rango_fechas(
    fecha_entrada,
    fecha_salida,
    dias_minimos=DIAS_MINIMOS_RESERVA,
    dias_maximos=DIAS_MAXIMOS_RESERVA,
):
    """La estancia debe durar entre `dias_minimos` y `dias_maximos` noches."""
    dias_reserva = (fecha_salida - fecha_entrada).days

    if dias_reserva < dias_minimos:
        raise ValidationError(
            f'La reserva debe ser de al menos {dias_minimos} día(s). '
            f'Tu reserva es de {dias_reserva} día(s).'
        )
    if dias_reserva > dias_maximos:
        raise ValidationError(
            f'La reserva no puede ser mayor a {dias_maximos} días. '
            f'Tu reserva es de {dias_reserva} días.'
        )


def validar_capacidad_habitacion(habitacion, numero_personas):
    """El número de personas debe estar entre 1 y la capacidad de la habitación."""
    if numero_personas < 1:
        raise ValidationError('El número de personas debe ser al menos 1')
    if numero_personas > habitacion.capacidad:
        raise ValidationError(
            f'La habitación "{habitacion.nombre}" tiene capacidad para '
            f'{habitacion.capacidad} persona(s), pero intentas reservar para '
            f'{numero_personas} persona(s)'
        )


def validar_disponibilidad_habitacion(habitacion, fecha_entrada, fecha_salida, reserva_id=None):
    """
    La habitación debe estar habilitada y sin reservas activas que se solapen.

    `reserva_id` excluye una reserva existente (útil al editarla).
    """
    if not habitacion.disponible:
        raise ValidationError(f'La habitación "{habitacion.nombre}" no está disponible actualmente')

    conflictos = Reserva.objects.filter(habitacion=habitacion).solapadas(fecha_entrada, fecha_salida)
    if reserva_id:
        conflictos = conflictos.exclude(id=reserva_id)

    conflicto = conflictos.order_by('fecha_entrada').first()
    if conflicto:
        raise ValidationError(
            f'La habitación "{habitacion.nombre}" ya está reservada del '
            f'{conflicto.fecha_entrada} al {conflicto.fecha_salida}. '
            f'Por favor selecciona otras fechas.'
        )


def validar_reserva(habitacion, fecha_entrada, fecha_salida, numero_personas, reserva_id=None):
    """Aplica todas las reglas de una reserva en el orden habitual."""
    validar_fechas_reserva(fecha_entrada, fecha_salida)
    validar_rango_fechas(fecha_entrada, fecha_salida)
    validar_capacidad_habitacion(habitacion, numero_personas)
    validar_disponibilidad_habitacion(habitacion, fecha_entrada, fecha_salida, reserva_id=reserva_id)
