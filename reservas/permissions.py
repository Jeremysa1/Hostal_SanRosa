from rest_framework import permissions


def es_staff(user):
    return bool(user and user.is_authenticated and user.is_staff)


class IsAdminUser(permissions.BasePermission):
    """Solo administradores (staff) autenticados."""

    def has_permission(self, request, view):
        return es_staff(request.user)


class IsAdminOrReadOnly(permissions.BasePermission):
    """Lectura para todos; escritura solo para administradores."""

    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS or es_staff(request.user)


class IsPublicEndpoint(permissions.AllowAny):
    """Endpoint completamente público (alias explícito de AllowAny)."""


class CanCreateReserva(permissions.BasePermission):
    """Cualquiera puede crear una reserva (POST); el resto solo administradores."""

    def has_permission(self, request, view):
        return request.method == 'POST' or es_staff(request.user)


class CanAccessCalendar(IsAdminUser):
    """Calendario de ocupación: solo administradores."""

    message = "Solo los administradores pueden acceder al calendario"
