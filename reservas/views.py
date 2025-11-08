
# reservas/views.py

from datetime import datetime
from urllib.parse import quote

from django.conf import settings
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiResponse
)
from drf_spectacular.types import OpenApiTypes

from .models import (
    Habitacion,
    Cliente,
    Reserva,
    SitioTuristico,
    InformacionHostal
)

from .serializers import (
    PreReservaSerializer,
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

from .throttling import (
    ReservaAnonThrottle,
    ReservaUserThrottle,
    CalendarioThrottle
)

from .permissions import (
    IsAdminUser,
    IsPublicEndpoint,
    CanCreateReserva,
    CanAccessCalendar
)

from .utils import (
    generar_calendario_mes,
    obtener_disponibilidad_habitacion
)

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
    throttle_classes = [ReservaAnonThrottle, ReservaUserThrottle]

    @action(detail=False, methods=['get'])
    def todas(self, request):
        """Incluye también habitaciones no disponibles (solo admin)."""
        qs = Habitacion.objects.all() if request.user.is_staff else self.queryset
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=True, methods=['get'])
    def disponibilidad(self, request, pk=None):
        """
        Verifica disponibilidad en rango de fechas.
        GET /habitaciones/{id}/disponibilidad/?fecha_entrada=YYYY-MM-DD&fecha_salida=YYYY-MM-DD
        """
        habitacion = self.get_object()
        fecha_entrada = request.query_params.get('fecha_entrada')
        fecha_salida = request.query_params.get('fecha_salida')

        if not fecha_entrada or not fecha_salida:
            return Response({'error': 'Debe enviar fecha_entrada y fecha_salida'}, status=400)

        try:
            fecha_entrada = datetime.strptime(fecha_entrada, '%Y-%m-%d').date()
            fecha_salida = datetime.strptime(fecha_salida, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Formato de fecha inválido (YYYY-MM-DD)'}, status=400)

        reservas_conflicto = Reserva.objects.filter(
            habitacion=habitacion,
            estado__in=['pendiente', 'confirmada'],
            fecha_entrada__lt=fecha_salida,
            fecha_salida__gt=fecha_entrada
        )

        return Response({
            'habitacion': habitacion.nombre,
            'disponible': not reservas_conflicto.exists() and habitacion.disponible,
            'reservas_conflicto': reservas_conflicto.count()
        })

# -------------------------------------------------------------------
# PRE-RESERVA (WhatsApp) ★ IMPORTANT ★
# -------------------------------------------------------------------

@api_view(['POST'])
def pre_reserva(request):
    """
    Recibe datos del formulario y retorna el enlace de WhatsApp.
    No crea reserva en la base de datos.
    """
    serializer = PreReservaSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    data = serializer.validated_data

    hostal_whatsapp = settings.HOSTAL_WHATSAPP  # Número de WhatsApp del hostal desde settings.py seguro en .env

    mensaje = (
        "Hola, deseo solicitar una reserva:%0A"
        "------------------------------------%0A"
        f"👤 *Nombre:* {data['guestName']}%0A"
        f"📞 *Teléfono:* {data['phoneNumber']}%0A"
        f"👥 *Personas:* {data['numberOfPeople']}%0A"
        f"🛏️ *Habitación:* {data['roomType']}%0A"
        f"📅 *Entrada:* {data['checkInDate']}%0A"
        f"📆 *Salida:* {data['checkOutDate']}%0A"
        "------------------------------------%0A"
        "Gracias "
    )

    whatsapp_url = f"https://wa.me/{hostal_whatsapp}?text={mensaje}"

    return Response({"whatsapp_url": whatsapp_url}, status=200)

# -------------------------------------------------------------------
# RESERVAS REALES (backend / panel)
# -------------------------------------------------------------------

class ReservaViewSet(viewsets.ModelViewSet):
    """
    Crea reservas reales en la DB (solo cuando el administrador confirma).
    POST /api/reservas/
    GET /api/reservas/  (solo admin)
    """
    queryset = Reserva.objects.all()
    permission_classes = [CanCreateReserva]
    throttle_classes = [CalendarioThrottle]

    def get_serializer_class(self):
        return ReservaCreateSerializer if self.action == 'create' else ReservaListSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reserva = serializer.save()

        return Response({
            'reserva': ReservaListSerializer(reserva).data,
            'mensaje': 'Reserva registrada exitosamente'
        }, status=201)

# -------------------------------------------------------------------
# CLIENTES (SOLO ADMIN)
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
        return SitioTuristicoDetailSerializer if self.action == 'retrieve' else SitioTuristicoListSerializer

# -------------------------------------------------------------------
# CALENDARIO ADMIN
# -------------------------------------------------------------------

class CalendarioView(APIView):
    permission_classes = [CanAccessCalendar]
    throttle_classes = [CalendarioThrottle]

    def get(self, request):
        mes = request.query_params.get('mes') or datetime.now().month
        anio = request.query_params.get('anio') or datetime.now().year
        calendario = generar_calendario_mes(int(mes), int(anio))
        return Response(CalendarioSerializer(calendario).data)


class CalendarioHabitacionView(APIView):
    permission_classes = [CanAccessCalendar]
    throttle_classes = [CalendarioThrottle]

    def get(self, request, habitacion_id):
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')

        if not fecha_inicio or not fecha_fin:
            return Response({'error': 'Debe enviar fecha_inicio y fecha_fin'}, status=400)

        disponibilidad = obtener_disponibilidad_habitacion(habitacion_id, fecha_inicio, fecha_fin)

        return Response({
            'habitacion_id': habitacion_id,
            'disponibilidad': disponibilidad
        })


class ReservaCalendarioViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all().select_related('cliente', 'habitacion')
    serializer_class = ReservaCalendarioSerializer
    permission_classes = [CanAccessCalendar]

# -------------------------------------------------------------------
# INFORMACIÓN DEL HOSTAL
# -------------------------------------------------------------------

class InformacionHostalView(APIView):
    permission_classes = [IsPublicEndpoint]

    def get(self, request):
        info = InformacionHostal.get_info()
        return Response(InformacionHostalSerializer(info).data)
