
from datetime import datetime, timedelta
from calendar import monthrange
from .models import Habitacion, Reserva

# Diccionarios para fechas en español
DIAS_SEMANA = {
    'Monday': 'Lunes',
    'Tuesday': 'Martes', 
    'Wednesday': 'Miércoles',
    'Thursday': 'Jueves',
    'Friday': 'Viernes',
    'Saturday': 'Sábado',
    'Sunday': 'Domingo'
}

MESES = {
    1: 'Enero', 
    2: 'Febrero', 
    3: 'Marzo', 
    4: 'Abril',
    5: 'Mayo', 
    6: 'Junio', 
    7: 'Julio', 
    8: 'Agosto',
    9: 'Septiembre', 
    10: 'Octubre', 
    11: 'Noviembre', 
    12: 'Diciembre'
}


def generar_calendario_mes(mes, anio):
    """
    Genera un calendario completo del mes con disponibilidad de todas las habitaciones
    
    Args:
        mes (int): Número del mes (1-12)
        anio (int): Año (ej: 2025)
    
    Returns:
        dict: Estructura del calendario con disponibilidad
    """
    
    # Validar mes y año
    if not (1 <= mes <= 12):
        raise ValueError("El mes debe estar entre 1 y 12")
    if anio < 2020 or anio > 2100:
        raise ValueError("Año inválido")
    
    # Obtener todas las habitaciones
    habitaciones = Habitacion.objects.all().order_by('id')
    
    # Obtener número de días en el mes
    num_dias = monthrange(anio, mes)[1]
    
    # Estructura del calendario
    calendario = {
        'mes': mes,
        'anio': anio,
        'nombre_mes': MESES[mes],
        'total_dias': num_dias,
        'habitaciones': [],
        'dias': []
    }
    
    # Agregar información de habitaciones
    for habitacion in habitaciones:
        calendario['habitaciones'].append({
            'id': habitacion.id,
            'nombre': habitacion.nombre,
            'tipo': habitacion.get_tipo_display(),
            'capacidad': habitacion.capacidad
        })
    
    # Generar cada día del mes
    for dia in range(1, num_dias + 1):
        fecha = datetime(anio, mes, dia).date()
        
        dia_data = {
            'fecha': fecha.isoformat(),
            'dia': dia,
            'dia_semana': DIAS_SEMANA[fecha.strftime('%A')],
            'habitaciones_estado': []
        }
        
        # Verificar estado de cada habitación para este día
        for habitacion in habitaciones:
            # Buscar reservas que ocupen esta habitación en esta fecha
            reservas_del_dia = Reserva.objects.filter(
                habitacion=habitacion,
                fecha_entrada__lte=fecha,
                fecha_salida__gt=fecha,
                estado__in=['pendiente', 'confirmada']
            ).select_related('cliente')
            
            if reservas_del_dia.exists():
                # Habitación ocupada
                reserva = reservas_del_dia.first()
                estado = {
                    'habitacion_id': habitacion.id,
                    'disponible': False,
                    'color': 'rojo',
                    'reserva': {
                        'id': reserva.id,
                        'cliente': reserva.cliente.nombre,
                        'telefono': reserva.cliente.telefono,
                        'email': reserva.cliente.email,
                        'fecha_entrada': reserva.fecha_entrada.isoformat(),
                        'fecha_salida': reserva.fecha_salida.isoformat(),
                        'numero_personas': reserva.numero_personas,
                        'precio_total': str(reserva.precio_total),
                        'estado': reserva.get_estado_display(),
                        'mensaje': reserva.mensaje
                    }
                }
            else:
                # Habitación disponible
                estado = {
                    'habitacion_id': habitacion.id,
                    'disponible': True,
                    'color': '',
                    'reserva': None
                }
            
            dia_data['habitaciones_estado'].append(estado)
        
        calendario['dias'].append(dia_data)
    
    return calendario


def obtener_disponibilidad_habitacion(habitacion_id, fecha_inicio, fecha_fin):
    """
    Obtiene la disponibilidad de una habitación específica en un rango de fechas
    
    Args:
        habitacion_id (int): ID de la habitación
        fecha_inicio (date): Fecha de inicio
        fecha_fin (date): Fecha de fin
    
    Returns:
        list: Lista de fechas con su disponibilidad
    """
    try:
        habitacion = Habitacion.objects.get(id=habitacion_id)
    except Habitacion.DoesNotExist:
        return []
    
    disponibilidad = []
    fecha_actual = fecha_inicio
    
    while fecha_actual <= fecha_fin:
        reservas = Reserva.objects.filter(
            habitacion=habitacion,
            fecha_entrada__lte=fecha_actual,
            fecha_salida__gt=fecha_actual,
            estado__in=['pendiente', 'confirmada']
        ).select_related('cliente')
        
        if reservas.exists():
            reserva = reservas.first()
            disponibilidad.append({
                'fecha': fecha_actual.isoformat(),
                'disponible': False,
                'reserva_id': reserva.id,
                'cliente': reserva.cliente.nombre
            })
        else:
            disponibilidad.append({
                'fecha': fecha_actual.isoformat(),
                'disponible': True,
                'reserva_id': None,
                'cliente': None
            })
        
        fecha_actual += timedelta(days=1)
    
    return disponibilidad