"""
Lógica de negocio de reservas, independiente de la capa HTTP.

Las vistas y serializers delegan aquí para que la lógica se pueda reutilizar
(admin, comandos, tests) y no quede repetida.
"""

from urllib.parse import quote

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import transaction

from .models import Cliente, Habitacion, Reserva
from .validators import validar_reserva

CAMPOS_RESERVA = ('habitacion', 'fecha_entrada', 'fecha_salida', 'numero_personas')


# ---------------------------------------------------------------------------
# Clientes
# ---------------------------------------------------------------------------
def obtener_o_crear_cliente(nombre, email, telefono):
    """Busca el cliente por email; si no existe lo crea con nombre y teléfono."""
    cliente, _ = Cliente.objects.get_or_create(
        email=email,
        defaults={'nombre': nombre, 'telefono': telefono},
    )
    return cliente


# ---------------------------------------------------------------------------
# Reservas
# ---------------------------------------------------------------------------
def _bloquear_habitacion(habitacion):
    """
    Bloquea la fila de la habitación hasta el fin de la transacción para que dos
    reservas simultáneas no puedan ocupar las mismas fechas (doble reserva).
    """
    return Habitacion.objects.select_for_update().get(pk=habitacion.pk)


@transaction.atomic
def crear_reserva(*, cliente_nombre, cliente_email, cliente_telefono, **datos_reserva):
    """Valida y crea una reserva, registrando al cliente si es nuevo."""
    habitacion = _bloquear_habitacion(datos_reserva['habitacion'])
    validar_reserva(
        habitacion,
        datos_reserva['fecha_entrada'],
        datos_reserva['fecha_salida'],
        datos_reserva['numero_personas'],
    )
    cliente = obtener_o_crear_cliente(cliente_nombre, cliente_email, cliente_telefono)
    return Reserva.objects.create(cliente=cliente, **datos_reserva)


def requiere_validacion(reserva, datos):
    """
    Una edición solo se revalida si cambia algún dato que afecte la ocupación.
    Así se puede, por ejemplo, marcar como 'completada' una reserva pasada.
    """
    if reserva is None:
        return True
    return any(
        campo in datos and datos[campo] != getattr(reserva, campo)
        for campo in CAMPOS_RESERVA
    )


def validar_datos_reserva(datos, reserva=None):
    """Valida los datos combinados (nuevos + actuales) de una reserva."""
    def valor(campo):
        return datos.get(campo, getattr(reserva, campo, None))

    if not requiere_validacion(reserva, datos):
        return
    faltantes = [campo for campo in CAMPOS_RESERVA if valor(campo) is None]
    if faltantes:
        raise ValidationError(f"Faltan campos obligatorios: {', '.join(faltantes)}")

    validar_reserva(
        valor('habitacion'),
        valor('fecha_entrada'),
        valor('fecha_salida'),
        valor('numero_personas'),
        reserva_id=reserva.pk if reserva else None,
    )


def habitacion_disponible(habitacion, fecha_entrada, fecha_salida):
    """Devuelve (disponible, número de reservas en conflicto)."""
    conflictos = Reserva.objects.filter(habitacion=habitacion).solapadas(fecha_entrada, fecha_salida)
    total = conflictos.count()
    return habitacion.disponible and total == 0, total


# ---------------------------------------------------------------------------
# Pre-reserva por WhatsApp
# ---------------------------------------------------------------------------
SEPARADOR_MENSAJE = "------------------------------------"


def construir_mensaje_pre_reserva(datos):
    lineas = [
        "Hola, deseo solicitar una reserva:",
        SEPARADOR_MENSAJE,
        f" *Nombre:* {datos['guestName']}",
        f" *Teléfono:* {datos['phoneNumber']}",
        f" *Personas:* {datos['numberOfPeople']}",
        f" *Habitación:* {datos['roomType']}",
        f" *Entrada:* {datos['checkInDate']}",
        f" *Salida:* {datos['checkOutDate']}",
        SEPARADOR_MENSAJE,
        "Gracias ",
    ]
    return "\n".join(lineas)


def construir_url_whatsapp(datos, numero=None):
    """URL de wa.me con el mensaje de pre-reserva correctamente codificado."""
    numero = numero or settings.HOSTAL_WHATSAPP
    return f"https://wa.me/{numero}?text={quote(construir_mensaje_pre_reserva(datos))}"
