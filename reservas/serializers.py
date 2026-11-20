from contextlib import contextmanager

from django.core.exceptions import ValidationError as DjangoValidationError
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from . import services
from .models import Cliente, Habitacion, InformacionHostal, Reserva, SitioTuristico
from .validators import hoy


@contextmanager
def errores_como_drf():
    """Traduce ValidationError de Django al formato de errores de DRF."""
    try:
        yield
    except DjangoValidationError as error:
        raise serializers.ValidationError(error.messages) from error


# ---------------------------------------------------------
# HABITACIONES
# ---------------------------------------------------------
class HabitacionSerializer(serializers.ModelSerializer):
    """Habitaciones para la página pública."""

    class Meta:
        model = Habitacion
        fields = [
            'id', 'nombre', 'tipo', 'capacidad', 'precio',
            'descripcion', 'disponible', 'imagen', 'camas_info',
            'wifi', 'tv', 'estacionamiento', 'mascotas',
            'closet', 'lavanderia', 'checkin_hora', 'checkout_hora',
        ]
        read_only_fields = ['id']


class HabitacionResumenSerializer(serializers.ModelSerializer):
    """Datos mínimos de una habitación (calendario / listados compactos)."""

    tipo = serializers.CharField(source='get_tipo_display', read_only=True)

    class Meta:
        model = Habitacion
        fields = ['id', 'nombre', 'tipo', 'capacidad']


# ---------------------------------------------------------
# CLIENTES
# ---------------------------------------------------------
class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'email', 'telefono', 'fecha_registro']
        read_only_fields = ['id', 'fecha_registro']


class ClienteResumenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'email', 'telefono']


# ---------------------------------------------------------
# RESERVAS
# ---------------------------------------------------------
class DatosClienteMixin(serializers.Serializer):
    """Campos de cliente que llegan "planos" junto con la reserva."""

    cliente_nombre = serializers.CharField(write_only=True)
    cliente_email = serializers.EmailField(write_only=True)
    cliente_telefono = serializers.CharField(write_only=True)

    CAMPOS_CLIENTE = ('cliente_nombre', 'cliente_email', 'cliente_telefono')

    def extraer_datos_cliente(self, validated_data):
        return {campo: validated_data.pop(campo) for campo in self.CAMPOS_CLIENTE if campo in validated_data}

    def crear_reserva(self, validated_data):
        with errores_como_drf():
            return services.crear_reserva(**validated_data)


class ReservaCreateSerializer(DatosClienteMixin, serializers.ModelSerializer):
    """Creación de reservas desde la web."""

    class Meta:
        model = Reserva
        fields = [
            'habitacion', 'fecha_entrada', 'fecha_salida',
            'numero_personas', 'mensaje', 'precio_total',
            'cliente_nombre', 'cliente_email', 'cliente_telefono',
        ]

    def validate(self, data):
        with errores_como_drf():
            services.validar_datos_reserva(data)
        return data

    def create(self, validated_data):
        return self.crear_reserva(validated_data)


class ReservaListSerializer(serializers.ModelSerializer):
    """Listado de reservas con cliente y habitación anidados (panel admin)."""

    cliente = ClienteSerializer(read_only=True)
    habitacion = HabitacionSerializer(read_only=True)

    class Meta:
        model = Reserva
        fields = '__all__'


class ReservaCalendarioSerializer(DatosClienteMixin, serializers.ModelSerializer):
    """Gestión de reservas desde el calendario admin (app móvil)."""

    cliente_nombre = serializers.CharField(write_only=True, required=False)
    cliente_email = serializers.EmailField(write_only=True, required=False)
    cliente_telefono = serializers.CharField(write_only=True, required=False)

    cliente_info = serializers.SerializerMethodField()
    habitacion_info = serializers.SerializerMethodField()

    class Meta:
        model = Reserva
        fields = [
            'id', 'habitacion', 'fecha_entrada', 'fecha_salida',
            'numero_personas', 'mensaje', 'precio_total', 'estado',
            'cliente_nombre', 'cliente_email', 'cliente_telefono',
            'cliente_info', 'habitacion_info', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    @extend_schema_field(ClienteResumenSerializer)
    def get_cliente_info(self, obj):
        return ClienteResumenSerializer(obj.cliente).data

    @extend_schema_field(HabitacionResumenSerializer)
    def get_habitacion_info(self, obj):
        return HabitacionResumenSerializer(obj.habitacion).data

    def validate(self, data):
        if self.instance is None:
            faltantes = [campo for campo in self.CAMPOS_CLIENTE if not data.get(campo)]
            if faltantes:
                raise serializers.ValidationError(
                    {campo: 'Este campo es requerido para crear una reserva.' for campo in faltantes}
                )
        with errores_como_drf():
            services.validar_datos_reserva(data, reserva=self.instance)
        return data

    def create(self, validated_data):
        return self.crear_reserva(validated_data)

    def update(self, instance, validated_data):
        # Los datos del cliente solo se usan al crear; al editar se ignoran.
        self.extraer_datos_cliente(validated_data)
        return super().update(instance, validated_data)


# ---------------------------------------------------------
# PRE-RESERVA (WHATSAPP)
# ---------------------------------------------------------
class PreReservaSerializer(serializers.Serializer):
    """Datos del formulario web (nombres en camelCase por contrato con el frontend)."""

    guestName = serializers.CharField()
    numberOfPeople = serializers.IntegerField(
        min_value=1,
        error_messages={'min_value': 'El número de personas debe ser al menos 1.'},
    )
    checkInDate = serializers.DateField()
    checkOutDate = serializers.DateField()
    phoneNumber = serializers.CharField()
    roomType = serializers.CharField()

    def validate(self, data):
        check_in = data['checkInDate']
        check_out = data['checkOutDate']

        if check_out <= check_in:
            raise serializers.ValidationError(
                "La fecha de salida debe ser posterior a la fecha de llegada."
            )
        if check_in < hoy():
            raise serializers.ValidationError("La fecha de llegada no puede ser en el pasado.")
        return data


# ---------------------------------------------------------
# SITIOS TURÍSTICOS
# ---------------------------------------------------------
class SitioTuristicoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SitioTuristico
        fields = ['id', 'nombre', 'descripcion_corta', 'imagen_principal', 'ubicacion']


class SitioTuristicoDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = SitioTuristico
        fields = [
            'id', 'nombre', 'descripcion_corta', 'descripcion_completa',
            'imagen_principal', 'imagen_detalle',
            'ubicacion', 'coordenadas_lat', 'coordenadas_lng',
            'actividades', 'tips',
        ]


# ---------------------------------------------------------
# CALENDARIO
# ---------------------------------------------------------
class CalendarioSerializer(serializers.Serializer):
    mes = serializers.IntegerField()
    anio = serializers.IntegerField()
    nombre_mes = serializers.CharField()
    total_dias = serializers.IntegerField()
    habitaciones = serializers.ListField()
    dias = serializers.ListField()


class CalendarioQuerySerializer(serializers.Serializer):
    """Parámetros ?mes=&anio= del calendario (por defecto, el mes actual)."""

    mes = serializers.IntegerField(required=False, min_value=1, max_value=12)
    anio = serializers.IntegerField(required=False, min_value=2020, max_value=2100)

    def validate(self, data):
        fecha_hoy = hoy()
        data.setdefault('mes', fecha_hoy.month)
        data.setdefault('anio', fecha_hoy.year)
        return data


class RangoFechasQuerySerializer(serializers.Serializer):
    """Parámetros de un rango de fechas en query string (YYYY-MM-DD)."""

    MAX_DIAS = 366

    def __init__(self, *args, campo_inicio='fecha_inicio', campo_fin='fecha_fin', **kwargs):
        super().__init__(*args, **kwargs)
        self.campo_inicio = campo_inicio
        self.campo_fin = campo_fin
        mensaje = {'invalid': 'Formato de fecha inválido (YYYY-MM-DD)'}
        self.fields[campo_inicio] = serializers.DateField(error_messages=mensaje)
        self.fields[campo_fin] = serializers.DateField(error_messages=mensaje)

    def validate(self, data):
        inicio, fin = data[self.campo_inicio], data[self.campo_fin]
        if fin < inicio:
            raise serializers.ValidationError(f'{self.campo_fin} debe ser posterior a {self.campo_inicio}')
        if (fin - inicio).days > self.MAX_DIAS:
            raise serializers.ValidationError(f'El rango no puede superar {self.MAX_DIAS} días')
        return data


# ---------------------------------------------------------
# INFORMACIÓN GENERAL DEL HOSTAL
# ---------------------------------------------------------
class InformacionHostalSerializer(serializers.ModelSerializer):
    espacios_comunes = serializers.SerializerMethodField()
    caracteristicas_destacadas = serializers.SerializerMethodField()
    ubicacion_completa = serializers.SerializerMethodField()

    class Meta:
        model = InformacionHostal
        fields = [
            'id', 'nombre', 'eslogan', 'descripcion_corta', 'descripcion_completa',
            'direccion', 'ciudad', 'departamento', 'pais',
            'coordenadas_lat', 'coordenadas_lng', 'ubicacion_completa',
            'telefono', 'email', 'whatsapp', 'instagram', 'facebook',
            'checkin_desde', 'checkout_hasta',
            'espacios_comunes', 'caracteristicas_destacadas',
            'politicas_cancelacion', 'politicas_mascotas', 'politicas_fumar',
            'logo', 'imagen_principal', 'copyright_text',
        ]

    @extend_schema_field(serializers.ListField(child=serializers.DictField()))
    def get_espacios_comunes(self, obj):
        return obj.items_activos(InformacionHostal.ESPACIOS_COMUNES)

    @extend_schema_field(serializers.ListField(child=serializers.DictField()))
    def get_caracteristicas_destacadas(self, obj):
        return obj.items_activos(InformacionHostal.CARACTERISTICAS_DESTACADAS)

    def get_ubicacion_completa(self, obj) -> str:
        return f"{obj.ciudad}, {obj.departamento}"
