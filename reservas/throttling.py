
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class ReservaAnonThrottle(AnonRateThrottle):
    """
    Limita las reservas de usuarios anónimos
    5 reservas por hora por IP
    """
    rate = '5/hour'


class ReservaUserThrottle(UserRateThrottle):
    """
    Limita las reservas de usuarios autenticados
    20 reservas por hora
    """
    rate = '20/hour'


class CalendarioThrottle(UserRateThrottle):
    """
    Limita acceso al calendario
    100 peticiones por minuto para admin
    """
    rate = '100/min'