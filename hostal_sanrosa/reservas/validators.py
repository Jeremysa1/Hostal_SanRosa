
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import date, datetime
from .models import Reserva, Habitacion


def validar_fecha_no_pasada(fecha):
    """Valida que la fecha no sea anterior a hoy"""
    hoy = date.today()
    if fecha < hoy:
        raise ValidationError(
            f'La fecha {fecha} no puede ser anterior a hoy ({hoy})'
        )


def validar_fechas_reserva(fecha_entrada, fecha_salida):
    """Valida que fecha_entrada sea anterior a fecha_salida"""
    if fecha_entrada >= fecha_salida:
        raise ValidationError(
            'La fecha de entrada debe ser anterior a la fecha de salida'
        )
    
    # Validar que las fechas no sean pasadas
    hoy = date.today()
    if fecha_entrada < hoy:
        raise ValidationError(
            f'La fecha de entrada no puede ser anterior a hoy ({hoy})'
        )
    
    if fecha_salida < hoy:
        raise ValidationError(
            f'La fecha de salida no puede ser anterior a hoy ({hoy})'
        )


def validar_capacidad_habitacion(habitacion, numero_personas):
    """Valida que el número de personas no exceda la capacidad de la habitación"""
    if numero_personas > habitacion.capacidad:
        raise ValidationError(
            f'La habitación "{habitacion.nombre}" tiene capacidad para {habitacion.capacidad} persona(s), '
            f'pero intentas reservar para {numero_personas} persona(s)'
        )
    
    if numero_personas < 1:
        raise ValidationError(
            'El número de personas debe ser al menos 1'
        )


def validar_disponibilidad_habitacion(habitacion, fecha_entrada, fecha_salida, reserva_id=None):
    """
    Valida que la habitación esté disponible en las fechas solicitadas
    
    Args:
        habitacion: Instancia de Habitacion
        fecha_entrada: Fecha de entrada
        fecha_salida: Fecha de salida
        reserva_id: ID de reserva (para excluir al actualizar una reserva existente)
    """
    # Verificar si la habitación está marcada como disponible
    if not habitacion.disponible:
        raise ValidationError(
            f'La habitación "{habitacion.nombre}" no está disponible actualmente'
        )
    
    # Buscar reservas que se solapen con las fechas solicitadas
    reservas_conflicto = Reserva.objects.filter(
        habitacion=habitacion,
        estado__in=['pendiente', 'confirmada'],
        fecha_entrada__lt=fecha_salida,  # La reserva existente empieza antes de que termine la nueva
        fecha_salida__gt=fecha_entrada   # La reserva existente termina después de que empiece la nueva
    )
    
    # Si estamos actualizando una reserva, excluirla de la búsqueda
    if reserva_id:
        reservas_conflicto = reservas_conflicto.exclude(id=reserva_id)
    
    if reservas_conflicto.exists():
        reserva = reservas_conflicto.first()
        raise ValidationError(
            f'La habitación "{habitacion.nombre}" ya está reservada del '
            f'{reserva.fecha_entrada} al {reserva.fecha_salida}. '
            f'Por favor selecciona otras fechas.'
        )


def validar_rango_fechas(fecha_entrada, fecha_salida, dias_minimos=1, dias_maximos=30):
    """
    Valida el rango de días de una reserva
    
    Args:
        fecha_entrada: Fecha de entrada
        fecha_salida: Fecha de salida
        dias_minimos: Número mínimo de días (default: 1)
        dias_maximos: Número máximo de días (default: 30)
    """
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
    
