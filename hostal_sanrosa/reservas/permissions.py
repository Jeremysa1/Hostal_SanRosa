
from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado:
    - Administradores (staff) pueden hacer cualquier cosa
    - Usuarios anónimos solo pueden leer (GET)
    """
    
    def has_permission(self, request, view):
        # Permitir métodos de lectura (GET, HEAD, OPTIONS) a todos
        if request.method in permissions.SAFE_METHODS:
            return True
        # Para métodos de escritura (POST, PUT, PATCH, DELETE), 
        # el usuario debe estar autenticado y ser staff
        return request.user and request.user.is_staff


class IsAdminUser(permissions.BasePermission):
    """
    Permiso solo para administradores autenticados
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff


class IsPublicEndpoint(permissions.BasePermission):
    """
    Permiso para endpoints completamente públicos
    """
    
    def has_permission(self, request, view):
        return True


class CanCreateReserva(permissions.BasePermission):
    """
    Permiso para crear reservas (público puede crear)
    Solo admin puede ver todas las reservas
    """
    
    def has_permission(self, request, view):
        # POST (crear reserva) está permitido para todos
        if request.method == 'POST':
            return True
        # GET, PUT, PATCH, DELETE solo para administradores
        return request.user and request.user.is_authenticated and request.user.is_staff


class CanAccessCalendar(permissions.BasePermission):
    """
    Permiso para acceder al calendario (solo administradores)
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff
    
    message = "Solo los administradores pueden acceder al calendario"