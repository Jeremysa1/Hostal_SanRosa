#carpeta reservas/views.py

from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from drf_spectacular.types import OpenApiTypes
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from urllib.parse import quote
from datetime import datetime
from .models import Habitacion, Cliente, Reserva, SitioTuristico, InformacionHostal
from .throttling import ReservaAnonThrottle, ReservaUserThrottle, CalendarioThrottle
from .serializers import (
    HabitacionSerializer, 
    ClienteSerializer, 
    ReservaCreateSerializer,
    ReservaListSerializer,
    SitioTuristicoListSerializer,
    SitioTuristicoDetailSerializer,
    CalendarioSerializer,
    ReservaCalendarioSerializer,
    InformacionHostalSerializer
)
from .utils import generar_calendario_mes, obtener_disponibilidad_habitacion
from .permissions import (
    IsAdminOrReadOnly,
    IsAdminUser,
    IsPublicEndpoint,
    CanCreateReserva,
    CanAccessCalendar
)


class HabitacionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para habitaciones (solo lectura para el público)
    GET /api/habitaciones/ - Lista todas las habitaciones disponibles
    GET /api/habitaciones/{id}/ - Detalle de una habitación
    """
    queryset = Habitacion.objects.filter(disponible=True)
    serializer_class = HabitacionSerializer
    permission_classes = [IsPublicEndpoint]  # ← Público
    throttle_classes = [ReservaAnonThrottle, ReservaUserThrottle] # ← Limitar reservas
    
    @action(detail=False, methods=['get'])
    def todas(self, request):
        """Endpoint para obtener todas las habitaciones (incluso no disponibles)"""
        # Solo admin puede ver habitaciones no disponibles
        if request.user and request.user.is_staff:
            habitaciones = Habitacion.objects.all()
        else:
            habitaciones = Habitacion.objects.filter(disponible=True)
        serializer = self.get_serializer(habitaciones, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def disponibilidad(self, request, pk=None):
        """
        Verifica disponibilidad de una habitación en fechas específicas
        GET /api/habitaciones/{id}/disponibilidad/?fecha_entrada=2025-10-15&fecha_salida=2025-10-17
        """
        habitacion = self.get_object()
        fecha_entrada = request.query_params.get('fecha_entrada')
        fecha_salida = request.query_params.get('fecha_salida')
        
        if not fecha_entrada or not fecha_salida:
            return Response({
                'error': 'Se requieren fecha_entrada y fecha_salida'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            fecha_entrada = datetime.strptime(fecha_entrada, '%Y-%m-%d').date()
            fecha_salida = datetime.strptime(fecha_salida, '%Y-%m-%d').date()
        except ValueError:
            return Response({
                'error': 'Formato de fecha inválido. Use YYYY-MM-DD'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar reservas existentes que se solapen
        reservas_conflicto = Reserva.objects.filter(
            habitacion=habitacion,
            estado__in=['pendiente', 'confirmada'],
            fecha_entrada__lt=fecha_salida,
            fecha_salida__gt=fecha_entrada
        )
        
        disponible = not reservas_conflicto.exists() and habitacion.disponible
        
        return Response({
            'disponible': disponible,
            'habitacion': habitacion.nombre,
            'fecha_entrada': fecha_entrada,
            'fecha_salida': fecha_salida,
            'reservas_conflicto': reservas_conflicto.count()
        })


class ReservaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para reservas
    POST /api/reservas/ - Crear nueva reserva (PÚBLICO)
    GET /api/reservas/ - Listar todas las reservas (SOLO ADMIN)
    """
    queryset = Reserva.objects.all()
    permission_classes = [CanCreateReserva]  # ← Público puede crear, admin puede ver todo
    throttle_classes = [CalendarioThrottle]  # ← Limitar acceso al calendario
    
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
            f"*Nueva Reserva - Hostal Santa Rosa*\n\n"
            f"*Cliente:* {reserva.cliente.nombre}\n"
            f"*Email:* {reserva.cliente.email}\n"
            f"*Teléfono:* {reserva.cliente.telefono}\n\n"
            f"*Habitación:* {habitacion.nombre} ({habitacion.get_tipo_display()})\n"
            f"*Check-in:* {reserva.fecha_entrada}\n"
            f"*Check-out:* {reserva.fecha_salida}\n"
            f"*Personas:* {reserva.numero_personas}\n"
            f"*Precio Total:* ${reserva.precio_total}\n"
        )
        
        if reserva.mensaje:
            mensaje += f"\n💬 *Mensaje:* {reserva.mensaje}"
        
        # Obtener número de WhatsApp de la configuración del hostal
        from decouple import config
        whatsapp_number = config('WHATSAPP_NUMBER', default='573001234567')
        whatsapp_url = f"https://wa.me/{whatsapp_number}?text={quote(mensaje)}"
        
        return Response({
            'reserva': ReservaListSerializer(reserva).data,
            'whatsapp_url': whatsapp_url,
            'mensaje': 'Reserva creada exitosamente'
        }, status=status.HTTP_201_CREATED)


class ClienteViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para clientes (solo lectura, solo admin)"""
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [IsAdminUser]  # ← Solo administradores


class SitioTuristicoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para sitios turísticos (solo lectura para el público)
    GET /api/sitios-turisticos/ - Lista todos los sitios activos
    GET /api/sitios-turisticos/{id}/ - Detalle completo de un sitio
    """
    queryset = SitioTuristico.objects.filter(activo=True)
    permission_classes = [IsPublicEndpoint]  # ← Público
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SitioTuristicoDetailSerializer
        return SitioTuristicoListSerializer


class CalendarioView(APIView):
    """
    Vista para obtener el calendario mensual con disponibilidad
    GET /api/calendario/?mes=10&anio=2025
    SOLO ADMINISTRADORES
    """
    permission_classes = [CanAccessCalendar]
    throttle_classes = [CalendarioThrottle]
    
    @extend_schema(
        parameters=[
            OpenApiParameter('mes', OpenApiTypes.INT, description='Mes (1-12)'),
            OpenApiParameter('anio', OpenApiTypes.INT, description='Año (ej: 2025)'),
        ],
        responses={200: CalendarioSerializer},
        description='Obtiene el calendario mensual con disponibilidad de todas las habitaciones'
    )
    def get(self, request):
        mes = request.query_params.get('mes')
        anio = request.query_params.get('anio')
        
        if not mes or not anio:
            hoy = datetime.now()
            mes = hoy.month
            anio = hoy.year
        else:
            try:
                mes = int(mes)
                anio = int(anio)
            except ValueError:
                return Response({
                    'error': 'Mes y año deben ser números enteros'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            calendario = generar_calendario_mes(mes, anio)
            serializer = CalendarioSerializer(calendario)
            return Response(serializer.data)
        except ValueError as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class CalendarioHabitacionView(APIView):
    """
    Vista para obtener disponibilidad de una habitación específica
    GET /api/calendario/habitacion/{id}/?fecha_inicio=2025-10-01&fecha_fin=2025-10-31
    SOLO ADMINISTRADORES
    """
    permission_classes = [CanAccessCalendar]
    throttle_classes = [CalendarioThrottle]
    
    @extend_schema(
        parameters=[
            OpenApiParameter('fecha_inicio', OpenApiTypes.DATE, description='Fecha inicio (YYYY-MM-DD)'),
            OpenApiParameter('fecha_fin', OpenApiTypes.DATE, description='Fecha fin (YYYY-MM-DD)'),
        ],
        responses={
            200: OpenApiResponse(
                description='Disponibilidad de la habitación',
                response={
                    'type': 'object',
                    'properties': {
                        'habitacion_id': {'type': 'integer'},
                        'fecha_inicio': {'type': 'string', 'format': 'date'},
                        'fecha_fin': {'type': 'string', 'format': 'date'},
                        'disponibilidad': {'type': 'array'}
                    }
                }
            )
        },
        description='Obtiene la disponibilidad de una habitación en un rango de fechas'
    )
    def get(self, request, habitacion_id):
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')
        
        if not fecha_inicio or not fecha_fin:
            return Response({
                'error': 'Se requieren fecha_inicio y fecha_fin'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            fecha_inicio = datetime.strptime(fecha_inicio, '%Y-%m-%d').date()
            fecha_fin = datetime.strptime(fecha_fin, '%Y-%m-%d').date()
        except ValueError:
            return Response({
                'error': 'Formato de fecha inválido. Use YYYY-MM-DD'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        disponibilidad = obtener_disponibilidad_habitacion(habitacion_id, fecha_inicio, fecha_fin)
        
        return Response({
            'habitacion_id': habitacion_id,
            'fecha_inicio': fecha_inicio.isoformat(),
            'fecha_fin': fecha_fin.isoformat(),
            'disponibilidad': disponibilidad
        })


class ReservaCalendarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar reservas desde el calendario (app móvil)
    SOLO ADMINISTRADORES
    """
    queryset = Reserva.objects.all().select_related('cliente', 'habitacion')
    serializer_class = ReservaCalendarioSerializer
    permission_classes = [CanAccessCalendar]  # ← Solo admin
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtros opcionales
        habitacion_id = self.request.query_params.get('habitacion')
        estado = self.request.query_params.get('estado')
        fecha_desde = self.request.query_params.get('fecha_desde')
        fecha_hasta = self.request.query_params.get('fecha_hasta')
        
        if habitacion_id:
            queryset = queryset.filter(habitacion_id=habitacion_id)
        
        if estado:
            queryset = queryset.filter(estado=estado)
        
        if fecha_desde:
            queryset = queryset.filter(fecha_entrada__gte=fecha_desde)
        
        if fecha_hasta:
            queryset = queryset.filter(fecha_salida__lte=fecha_hasta)
        
        return queryset.order_by('-fecha_entrada')

class InformacionHostalView(APIView):
    """
    Vista para obtener la información del hostal
    GET /api/informacion-hostal/
    PÚBLICO
    """
    permission_classes = [IsPublicEndpoint]
    
    @extend_schema(
        responses={200: InformacionHostalSerializer},
        description='Obtiene la información general del hostal'
    )
    def get(self, request):
        info = InformacionHostal.get_info()
        serializer = InformacionHostalSerializer(info)
        return Response(serializer.data)