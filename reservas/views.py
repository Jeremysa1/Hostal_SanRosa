
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from urllib.parse import quote
from .models import Habitacion, Cliente, Reserva
from .serializers import (
    HabitacionSerializer, 
    ClienteSerializer, 
    ReservaCreateSerializer,
    ReservaListSerializer
)

class HabitacionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para habitaciones (solo lectura para el público)
    GET /api/habitaciones/ - Lista todas las habitaciones disponibles
    GET /api/habitaciones/{id}/ - Detalle de una habitación
    """
    queryset = Habitacion.objects.filter(disponible=True)
    serializer_class = HabitacionSerializer
    
    @action(detail=False, methods=['get'])
    def todas(self, request):
        """Endpoint para obtener todas las habitaciones (incluso no disponibles)"""
        habitaciones = Habitacion.objects.all()
        serializer = self.get_serializer(habitaciones, many=True)
        return Response(serializer.data)


class ReservaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para reservas
    POST /api/reservas/ - Crear nueva reserva
    GET /api/reservas/ - Listar todas las reservas
    """
    queryset = Reserva.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ReservaCreateSerializer
        return ReservaListSerializer
    
    def create(self, request, *args, **kwargs):
        """Crear reserva y generar URL de WhatsApp"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reserva = serializer.save()
        
        # Generar mensaje para WhatsApp
        habitacion = reserva.habitacion
        mensaje = (
            f"🏨 *Nueva Reserva - Hostal Santa Rosa*\n\n"
            f"👤 *Cliente:* {reserva.cliente.nombre}\n"
            f"📧 *Email:* {reserva.cliente.email}\n"
            f"📱 *Teléfono:* {reserva.cliente.telefono}\n\n"
            f"🛏 *Habitación:* {habitacion.nombre} ({habitacion.get_tipo_display()})\n"
            f"📅 *Check-in:* {reserva.fecha_entrada}\n"
            f"📅 *Check-out:* {reserva.fecha_salida}\n"
            f"👥 *Personas:* {reserva.numero_personas}\n"
            f"💰 *Precio Total:* ${reserva.precio_total}\n"
        )
        
        if reserva.mensaje:
            mensaje += f"\n💬 *Mensaje:* {reserva.mensaje}"
        
        # Número de WhatsApp de Viviana (utilizar numero de viviana)
        whatsapp_number = "57"  # Formato: código país + número sin +
        whatsapp_url = f"https://wa.me/{whatsapp_number}?text={quote(mensaje)}"
        
        return Response({
            'reserva': ReservaListSerializer(reserva).data,
            'whatsapp_url': whatsapp_url,
            'mensaje': 'Reserva creada exitosamente'
        }, status=status.HTTP_201_CREATED)


class ClienteViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para clientes (solo lectura)"""
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer