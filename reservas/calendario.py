"""
Generación del calendario de ocupación para el panel de administración.

Optimizado para hacer un número fijo de consultas: antes se hacía una consulta
por cada habitación y cada día del mes (≈ 6 × 31 consultas).
"""

from calendar import monthrange
from datetime import date, timedelta

from .models import Habitacion, Reserva

DIAS_SEMANA = ('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')

MESES = {
    1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril', 5: 'Mayo', 6: 'Junio',
    7: 'Julio', 8: 'Agosto', 9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre',
}

ANIO_MINIMO = 2020
ANIO_MAXIMO = 2100


def rango_fechas(inicio, fin):
    """Itera las fechas de `inicio` a `fin`, ambas incluidas."""
    for desplazamiento in range((fin - inicio).days + 1):
        yield inicio + timedelta(days=desplazamiento)


def mapa_ocupacion(habitaciones_ids, inicio, fin):
    """
    Devuelve {(habitacion_id, fecha): reserva} para las noches ocupadas entre
    `inicio` y `fin` (incluidos). Si hay varias reservas en la misma noche se
    conserva la creada más recientemente (orden por defecto del modelo).
    """
    reservas = (
        Reserva.objects
        .filter(habitacion_id__in=habitaciones_ids)
        .solapadas(inicio, fin + timedelta(days=1))
        .select_related('cliente')
        .order_by('-created_at')
    )

    ocupacion = {}
    for reserva in reservas:
        desde = max(reserva.fecha_entrada, inicio)
        hasta = min(reserva.fecha_salida - timedelta(days=1), fin)
        for fecha in rango_fechas(desde, hasta):
            ocupacion.setdefault((reserva.habitacion_id, fecha), reserva)
    return ocupacion


def _estado_habitacion(habitacion_id, reserva):
    if reserva is None:
        return {'habitacion_id': habitacion_id, 'disponible': True, 'color': '', 'reserva': None}

    return {
        'habitacion_id': habitacion_id,
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
            'mensaje': reserva.mensaje,
        },
    }


def generar_calendario_mes(mes, anio):
    """Calendario del mes con el estado de cada habitación por día."""
    if not 1 <= mes <= 12:
        raise ValueError("El mes debe estar entre 1 y 12")
    if not ANIO_MINIMO <= anio <= ANIO_MAXIMO:
        raise ValueError("Año inválido")

    habitaciones = list(Habitacion.objects.order_by('id'))
    ids = [h.id for h in habitaciones]

    total_dias = monthrange(anio, mes)[1]
    primer_dia = date(anio, mes, 1)
    ultimo_dia = date(anio, mes, total_dias)
    ocupacion = mapa_ocupacion(ids, primer_dia, ultimo_dia)

    return {
        'mes': mes,
        'anio': anio,
        'nombre_mes': MESES[mes],
        'total_dias': total_dias,
        'habitaciones': [
            {
                'id': h.id,
                'nombre': h.nombre,
                'tipo': h.get_tipo_display(),
                'capacidad': h.capacidad,
            }
            for h in habitaciones
        ],
        'dias': [
            {
                'fecha': fecha.isoformat(),
                'dia': fecha.day,
                'dia_semana': DIAS_SEMANA[fecha.weekday()],
                'habitaciones_estado': [
                    _estado_habitacion(h_id, ocupacion.get((h_id, fecha))) for h_id in ids
                ],
            }
            for fecha in rango_fechas(primer_dia, ultimo_dia)
        ],
    }


def obtener_disponibilidad_habitacion(habitacion_id, fecha_inicio, fecha_fin):
    """Disponibilidad día a día de una habitación (lista vacía si no existe)."""
    if not Habitacion.objects.filter(id=habitacion_id).exists():
        return []

    ocupacion = mapa_ocupacion([habitacion_id], fecha_inicio, fecha_fin)
    disponibilidad = []
    for fecha in rango_fechas(fecha_inicio, fecha_fin):
        reserva = ocupacion.get((habitacion_id, fecha))
        disponibilidad.append({
            'fecha': fecha.isoformat(),
            'disponible': reserva is None,
            'reserva_id': reserva.id if reserva else None,
            'cliente': reserva.cliente.nombre if reserva else None,
        })
    return disponibilidad
