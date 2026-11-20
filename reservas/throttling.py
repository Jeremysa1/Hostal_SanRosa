"""
Límites de peticiones específicos.

Cada throttle tiene su propio `scope` para que su historial no se mezcle con los
throttles globales 'anon' y 'user' definidos en settings (antes compartían la
misma clave de caché y se contaminaban entre sí).
"""

from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class ReservaAnonThrottle(AnonRateThrottle):
    """Creación de reservas por usuarios anónimos: 5 por hora por IP."""

    scope = 'reservas_anon'
    rate = '5/hour'


class ReservaUserThrottle(UserRateThrottle):
    """Creación de reservas por usuarios autenticados: 20 por hora."""

    scope = 'reservas_user'
    rate = '20/hour'


class CalendarioThrottle(UserRateThrottle):
    """Panel / calendario de administración: 100 peticiones por minuto."""

    scope = 'calendario'
    rate = '100/min'
