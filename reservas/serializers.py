
# reservas/serializers.py

from datetime import date
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field

from .models import Habitacion, Cliente, Reserva, SitioTuristico, InformacionHostal
from .validators import (
    validar_fechas_reserva,
    validar_capacidad_habitacion,
    validar_disponibilidad_habitacion,
    validar_rango_fechas
)


# ---------------------------------------------------------
# HABITACIONES
# ---------------------------------------------------------
class HabitacionSerializer(serializers.ModelSerializer):
    """Serializer para mostrar habitaciones en la página pública."""
    
    class Meta:
        model = Habitacion
        fields = [
            'id', 'nombre', 'tipo', 'capacidad', 'precio', 
            'descripcion', 'disponible', 'imagen', 'camas_info',
            'wifi', 'tv', 'estacionamiento', 'mascotas', 
            'closet', 'lavanderia', 'checkin_hora', 'checkout_hora'
        ]
        read_only_fields = ['id']


# ---------------------------------------------------------
# CLIENTES
# ---------------------------------------------------------
class ClienteSerializer(serializers.ModelSerializer):
    """Serializer para mostrar datos del cliente."""
    
    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'email', 'telefono', 'fecha_registro']
        read_only_fields = ['id', 'fecha_registro']


# ---------------------------------------------------------
# RESERVA - CREACIÓN DESDE WEB
# ---------------------------------------------------------
class ReservaCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear reservas reales (DB)."""

    cliente_nombre = serializers.CharField(write_only=True)
    cliente_email = serializers.EmailField(write_only=True)
    cliente_telefono = serializers.CharField(write_only=True)
    
    class Meta:
        model = Reserva
        fields = [
            'habitacion', 'fecha_entrada', 'fecha_salida',
            'numero_personas', 'mensaje', 'precio_total',
            'cliente_nombre', 'cliente_email', 'cliente_telefono'
        ]
    
    def validate(self, data):
        habitacion = data.get('habitacion')
        fecha_entrada = data.get('fecha_entrada')
        fecha_salida = data.get('fecha_salida')
        numero_personas = data.get('numero_personas')
        
        try:
            validar_fechas_reserva(fecha_entrada, fecha_salida)
            validar_rango_fechas(fecha_entrada, fecha_salida, dias_minimos=1, dias_maximos=30)
            validar_capacidad_habitacion(habitacion, numero_personas)
            validar_disponibilidad_habitacion(habitacion, fecha_entrada, fecha_salida)
        except DjangoValidationError as e:
            raise serializers.ValidationError(str(e))
        
        return data
    
    def create(self, validated_data):
        cliente_nombre = validated_data.pop('cliente_nombre')
        cliente_email = validated_data.pop('cliente_email')
        cliente_telefono = validated_data.pop('cliente_telefono')
        
        cliente, _ = Cliente.objects.get_or_create(
            email=cliente_email,
            defaults={'nombre': cliente_nombre, 'telefono': cliente_telefono}
        )
        
        return Reserva.objects.create(cliente=cliente, **validated_data)
    
class ReservaListSerializer(serializers.ModelSerializer):
    """Serializer para listar reservas (usado en panel admin)."""
    
    cliente = ClienteSerializer(read_only=True)
    habitacion = HabitacionSerializer(read_only=True)
    
    class Meta:
        model = Reserva
        fields = '__all__'

# ---------------------------------------------------------
# PRE-RESERVA (WHATSAPP)

class PreReservaSerializer(serializers.Serializer):
    guestName = serializers.CharField()
    numberOfPeople = serializers.IntegerField()
    checkInDate = serializers.DateField()
    checkOutDate = serializers.DateField()
    phoneNumber = serializers.CharField()
    roomType = serializers.CharField()

    def validate_numberOfPeople(self, value):
        if value < 1:
            raise serializers.ValidationError("El número de personas debe ser al menos 1.")
        return value

    def validate(self, data):
        check_in = data.get('checkInDate')
        check_out = data.get('checkOutDate')

        # Verifica que la salida sea después de la llegada
        if check_in and check_out and check_out <= check_in:
            raise serializers.ValidationError("La fecha de salida debe ser posterior a la fecha de llegada.")

        # Opcional: no permitir reservas en el pasado
        if check_in and check_in < date.today():
            raise serializers.ValidationError("La fecha de llegada no puede ser en el pasado.")

        return data

# ---------------------------------------------------------
# SITIOS TURÍSTICOS
# ---------------------------------------------------------
class SitioTuristicoListSerializer(serializers.ModelSerializer):
    """Serializer para listado tipo tarjetas."""
    
    class Meta:
        model = SitioTuristico
        fields = ['id', 'nombre', 'descripcion_corta', 'imagen_principal', 'ubicacion']


class SitioTuristicoDetailSerializer(serializers.ModelSerializer):
    """Serializer para detalle completo."""
    
    class Meta:
        model = SitioTuristico
        fields = [
            'id', 'nombre', 'descripcion_corta', 'descripcion_completa',
            'imagen_principal', 'imagen_detalle',
            'ubicacion', 'coordenadas_lat', 'coordenadas_lng',
            'actividades', 'tips'
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


class ReservaCalendarioSerializer(serializers.ModelSerializer):
    """Serializer para gestionar reservas desde el calendario admin (App móvil)."""

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
            'cliente_info', 'habitacion_info', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    @extend_schema_field({'type': 'object'})
    def get_cliente_info(self, obj):
        return {
            'id': obj.cliente.id,
            'nombre': obj.cliente.nombre,
            'email': obj.cliente.email,
            'telefono': obj.cliente.telefono
        }
    
    @extend_schema_field({'type': 'object'})
    def get_habitacion_info(self, obj):
        return {
            'id': obj.habitacion.id,
            'nombre': obj.habitacion.nombre,
            'tipo': obj.habitacion.get_tipo_display(),
            'capacidad': obj.habitacion.capacidad
        }
    
    def validate(self, data):
        habitacion = data.get('habitacion', self.instance.habitacion)
        fecha_entrada = data.get('fecha_entrada', self.instance.fecha_entrada)
        fecha_salida = data.get('fecha_salida', self.instance.fecha_salida)
        numero_personas = data.get('numero_personas', self.instance.numero_personas)
        
        try:
            validar_fechas_reserva(fecha_entrada, fecha_salida)
            validar_rango_fechas(fecha_entrada, fecha_salida, dias_minimos=1, dias_maximos=30)
            validar_capacidad_habitacion(habitacion, numero_personas)
            validar_disponibilidad_habitacion(habitacion, fecha_entrada, fecha_salida, reserva_id=self.instance.id if self.instance else None)
        except DjangoValidationError as e:
            raise serializers.ValidationError(str(e))
        
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
            'logo', 'imagen_principal', 'copyright_text'
        ]
    
    def get_espacios_comunes(self, obj):
        espacios = []
        if obj.sala_comun:
            espacios.append({'nombre': 'Sala común', 'descripcion': obj.sala_comun_descripcion})
        if obj.cocina_compartida:
            espacios.append({'nombre': 'Cocina compartida', 'descripcion': obj.cocina_compartida_descripcion})
        if obj.banos_compartidos:
            espacios.append({'nombre': 'Baños compartidos', 'descripcion': obj.banos_compartidos_descripcion})
        return espacios
    
    def get_caracteristicas_destacadas(self, obj):
        caracteristicas = []
        if obj.hogar_familiar:
            caracteristicas.append({'nombre': 'Hogar familiar', 'descripcion': obj.hogar_familiar_descripcion})
        if obj.ambiente_sano:
            caracteristicas.append({'nombre': 'Ambiente sano', 'descripcion': obj.ambiente_sano_descripcion})
        if obj.entorno_ecologico:
            caracteristicas.append({'nombre': 'Entorno ecológico', 'descripcion': obj.entorno_ecologico_descripcion})
        return caracteristicas
    
    def get_ubicacion_completa(self, obj):
        return f"{obj.ciudad}, {obj.departamento}"
