from drf_spectacular.utils import OpenApiParameter, extend_schema, inline_serializer
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from . import services
from .calendario import generar_calendario_mes, obtener_disponibilidad_habitacion
from .models import Cliente, Habitacion, InformacionHostal, Reserva, SitioTuristico
from .permissions import CanAccessCalendar, CanCreateReserva, IsAdminUser, IsPublicEndpoint
from .serializers import (
    CalendarioQuerySerializer,
    CalendarioSerializer,
    ClienteSerializer,
    HabitacionSerializer,
    InformacionHostalSerializer,
    PreReservaSerializer,
    RangoFechasQuerySerializer,
    ReservaCalendarioSerializer,
    ReservaCreateSerializer,
    ReservaListSerializer,
    SitioTuristicoDetailSerializer,
    SitioTuristicoListSerializer,
)
from .throttling import CalendarioThrottle, ReservaAnonThrottle, ReservaUserThrottle


def validar_query(serializer_class, request, **kwargs):
    """Valida los parámetros de la query string; responde 400 si son inválidos."""
    serializer = serializer_class(data=request.query_params, **kwargs)
    serializer.is_valid(raise_exception=True)
    return serializer.validated_data


# -------------------------------------------------------------------
# HABITACIONES
# -------------------------------------------------------------------
class HabitacionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Habitaciones disponibles para el público.

    GET /api/habitaciones/
    GET /api/habitaciones/{id}/
    """

    queryset = Habitacion.objects.filter(disponible=True)
    serializer_class = HabitacionSerializer
    permission_classes = [IsPublicEndpoint]

    @action(detail=False, methods=['get'])
    def todas(self, request):
        """Lista sin paginar. Los administradores ven también las no disponibles."""
        qs = Habitacion.objects.all() if request.user.is_staff else self.get_queryset()
        return Response(self.get_serializer(qs, many=True).data)

    @extend_schema(parameters=[
        OpenApiParameter('fecha_entrada', str, required=True, description='YYYY-MM-DD'),
        OpenApiParameter('fecha_salida', str, required=True, description='YYYY-MM-DD'),
    ])
    @action(detail=True, methods=['get'])
    def disponibilidad(self, request, pk=None):
        """GET /habitaciones/{id}/disponibilidad/?fecha_entrada=YYYY-MM-DD&fecha_salida=YYYY-MM-DD"""
        habitacion = self.get_object()
        fechas = validar_query(
            RangoFechasQuerySerializer, request,
            campo_inicio='fecha_entrada', campo_fin='fecha_salida',
        )
        disponible, conflictos = services.habitacion_disponible(
            habitacion, fechas['fecha_entrada'], fechas['fecha_salida']
        )
        return Response({
            'habitacion': habitacion.nombre,
            'disponible': disponible,
            'reservas_conflicto': conflictos,
        })


# -------------------------------------------------------------------
# PRE-RESERVA (WhatsApp)
# -------------------------------------------------------------------
@extend_schema(
    request=PreReservaSerializer,
    responses={200: inline_serializer('PreReservaRespuesta', {'whatsapp_url': serializers.URLField()})},
)
@api_view(['POST'])
@permission_classes([IsPublicEndpoint])
def pre_reserva(request):
    """Valida el formulario y devuelve el enlace de WhatsApp. No guarda nada en la BD."""
    serializer = PreReservaSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({'whatsapp_url': services.construir_url_whatsapp(serializer.validated_data)})


# -------------------------------------------------------------------
# RESERVAS
# -------------------------------------------------------------------
class ReservaViewSet(viewsets.ModelViewSet):
    """
    POST /api/reservas/  → crear reserva (público)
    GET  /api/reservas/  → listado (solo admin)
    """

    queryset = Reserva.objects.select_related('cliente', 'habitacion')
    permission_classes = [CanCreateReserva]

    def get_throttles(self):
        if self.action == 'create':
            return [ReservaAnonThrottle(), ReservaUserThrottle()]
        return [CalendarioThrottle()]

    def get_serializer_class(self):
        return ReservaCreateSerializer if self.action == 'create' else ReservaListSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reserva = serializer.save()
        return Response(
            {
                'reserva': ReservaListSerializer(reserva).data,
                'mensaje': 'Reserva registrada exitosamente',
            },
            status=status.HTTP_201_CREATED,
        )


# -------------------------------------------------------------------
# CLIENTES (solo admin)
# -------------------------------------------------------------------
class ClienteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [IsAdminUser]


# -------------------------------------------------------------------
# SITIOS TURÍSTICOS
# -------------------------------------------------------------------
class SitioTuristicoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SitioTuristico.objects.filter(activo=True)
    permission_classes = [IsPublicEndpoint]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SitioTuristicoDetailSerializer
        return SitioTuristicoListSerializer


# -------------------------------------------------------------------
# CALENDARIO (solo admin)
# -------------------------------------------------------------------
class CalendarioView(APIView):
    permission_classes = [CanAccessCalendar]
    throttle_classes = [CalendarioThrottle]

    @extend_schema(parameters=[CalendarioQuerySerializer], responses=CalendarioSerializer)
    def get(self, request):
        params = validar_query(CalendarioQuerySerializer, request)
        calendario = generar_calendario_mes(params['mes'], params['anio'])
        return Response(CalendarioSerializer(calendario).data)


class CalendarioHabitacionView(APIView):
    permission_classes = [CanAccessCalendar]
    throttle_classes = [CalendarioThrottle]

    @extend_schema(
        parameters=[
            OpenApiParameter('fecha_inicio', str, required=True, description='YYYY-MM-DD'),
            OpenApiParameter('fecha_fin', str, required=True, description='YYYY-MM-DD'),
        ],
        responses=inline_serializer('DisponibilidadHabitacion', {
            'habitacion_id': serializers.IntegerField(),
            'disponibilidad': serializers.ListField(child=serializers.DictField()),
        }),
    )
    def get(self, request, habitacion_id):
        fechas = validar_query(RangoFechasQuerySerializer, request)
        disponibilidad = obtener_disponibilidad_habitacion(
            habitacion_id, fechas['fecha_inicio'], fechas['fecha_fin']
        )
        return Response({'habitacion_id': habitacion_id, 'disponibilidad': disponibilidad})


class ReservaCalendarioViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.select_related('cliente', 'habitacion')
    serializer_class = ReservaCalendarioSerializer
    permission_classes = [CanAccessCalendar]


# -------------------------------------------------------------------
# INFORMACIÓN DEL HOSTAL
# -------------------------------------------------------------------
class InformacionHostalView(APIView):
    permission_classes = [IsPublicEndpoint]

    @extend_schema(responses=InformacionHostalSerializer)
    def get(self, request):
        return Response(InformacionHostalSerializer(InformacionHostal.get_info()).data)
