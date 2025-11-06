
from rest_framework import serializers
from .models import Habitacion, Cliente, Reserva, SitioTuristico, InformacionHostal
from .validators import (
    validar_fechas_reserva,
    validar_capacidad_habitacion,
    validar_disponibilidad_habitacion,
    validar_rango_fechas
)
from django.core.exceptions import ValidationError as DjangoValidationError


class HabitacionSerializer(serializers.ModelSerializer):
    """Serializer para listar habitaciones en la web"""
    
    class Meta:
        model = Habitacion
        fields = [
            'id', 'nombre', 'tipo', 'capacidad', 'precio', 
            'descripcion', 'disponible', 'imagen', 'camas_info',
            'wifi', 'tv', 'estacionamiento', 'mascotas', 'closet', 'lavanderia',
            'checkin_hora', 'checkout_hora'
        ]
        read_only_fields = ['id']


class ClienteSerializer(serializers.ModelSerializer):
    """Serializer para clientes"""
    
    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'email', 'telefono', 'fecha_registro']
        read_only_fields = ['id', 'fecha_registro']


class ReservaCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear reservas desde el formulario web"""
    
    # Campos anidados para recibir info del cliente
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
        """Validación completa de la reserva"""
        habitacion = data.get('habitacion')
        fecha_entrada = data.get('fecha_entrada')
        fecha_salida = data.get('fecha_salida')
        numero_personas = data.get('numero_personas')
        
        try:
            # 1. Validar fechas (entrada < salida y no sean pasadas)
            validar_fechas_reserva(fecha_entrada, fecha_salida)
            
            # 2. Validar rango de fechas (mínimo 1 día, máximo 30 días)
            validar_rango_fechas(fecha_entrada, fecha_salida, dias_minimos=1, dias_maximos=30)
            
            # 3. Validar capacidad de la habitación
            validar_capacidad_habitacion(habitacion, numero_personas)
            
            # 4. Validar disponibilidad de la habitación
            validar_disponibilidad_habitacion(habitacion, fecha_entrada, fecha_salida)
            
        except DjangoValidationError as e:
            raise serializers.ValidationError(str(e))
        
        return data
    
    def create(self, validated_data):
        # Extraer datos del cliente
        cliente_nombre = validated_data.pop('cliente_nombre')
        cliente_email = validated_data.pop('cliente_email')
        cliente_telefono = validated_data.pop('cliente_telefono')
        
        # Buscar o crear cliente
        cliente, created = Cliente.objects.get_or_create(
            email=cliente_email,
            defaults={
                'nombre': cliente_nombre,
                'telefono': cliente_telefono
            }
        )
        
        # Crear reserva
        reserva = Reserva.objects.create(
            cliente=cliente,
            **validated_data
        )
        
        return reserva


class ReservaListSerializer(serializers.ModelSerializer):
    """Serializer para listar reservas (con datos relacionados)"""
    
    cliente = ClienteSerializer(read_only=True)
    habitacion = HabitacionSerializer(read_only=True)
    
    class Meta:
        model = Reserva
        fields = '__all__'


class SitioTuristicoListSerializer(serializers.ModelSerializer):
    """Serializer para lista de sitios (tarjetas)"""
    
    class Meta:
        model = SitioTuristico
        fields = [
            'id', 'nombre', 'descripcion_corta', 
            'imagen_principal', 'ubicacion'
        ]


class SitioTuristicoDetailSerializer(serializers.ModelSerializer):
    """Serializer para detalle completo de un sitio"""
    
    class Meta:
        model = SitioTuristico
        fields = [
            'id', 'nombre', 'descripcion_corta', 'descripcion_completa',
            'imagen_principal', 'imagen_detalle', 
            'ubicacion', 'coordenadas_lat', 'coordenadas_lng',
            'actividades', 'tips'
        ]


class CalendarioSerializer(serializers.Serializer):
    """Serializer para el calendario mensual"""
    mes = serializers.IntegerField()
    anio = serializers.IntegerField()
    nombre_mes = serializers.CharField()
    total_dias = serializers.IntegerField()
    habitaciones = serializers.ListField()
    dias = serializers.ListField()


class ReservaCalendarioSerializer(serializers.ModelSerializer):
    """Serializer para crear/actualizar reservas desde el calendario"""
    cliente_nombre = serializers.CharField(write_only=True, required=False)
    cliente_email = serializers.EmailField(write_only=True, required=False)
    cliente_telefono = serializers.CharField(write_only=True, required=False)
    
    cliente_info = serializers.SerializerMethodField(read_only=True)
    habitacion_info = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Reserva
        fields = [
            'id', 'habitacion', 'fecha_entrada', 'fecha_salida',
            'numero_personas', 'mensaje', 'precio_total', 'estado',
            'cliente_nombre', 'cliente_email', 'cliente_telefono',
            'cliente_info', 'habitacion_info', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_cliente_info(self, obj):
        return {
            'id': obj.cliente.id,
            'nombre': obj.cliente.nombre,
            'email': obj.cliente.email,
            'telefono': obj.cliente.telefono
        }
    
    def get_habitacion_info(self, obj):
        return {
            'id': obj.habitacion.id,
            'nombre': obj.habitacion.nombre,
            'tipo': obj.habitacion.get_tipo_display(),
            'capacidad': obj.habitacion.capacidad
        }
    
    def validate(self, data):
        """Validación completa de la reserva desde calendario"""
        habitacion = data.get('habitacion', None)
        fecha_entrada = data.get('fecha_entrada', None)
        fecha_salida = data.get('fecha_salida', None)
        numero_personas = data.get('numero_personas', None)
        
        # Si es actualización, obtener datos existentes
        if self.instance:
            habitacion = habitacion or self.instance.habitacion
            fecha_entrada = fecha_entrada or self.instance.fecha_entrada
            fecha_salida = fecha_salida or self.instance.fecha_salida
            numero_personas = numero_personas or self.instance.numero_personas
        
        try:
            # Validar fechas
            if fecha_entrada and fecha_salida:
                validar_fechas_reserva(fecha_entrada, fecha_salida)
                validar_rango_fechas(fecha_entrada, fecha_salida, dias_minimos=1, dias_maximos=30)
            
            # Validar capacidad
            if habitacion and numero_personas:
                validar_capacidad_habitacion(habitacion, numero_personas)
            
            # Validar disponibilidad (excluir la reserva actual si es actualización)
            if habitacion and fecha_entrada and fecha_salida:
                reserva_id = self.instance.id if self.instance else None
                validar_disponibilidad_habitacion(habitacion, fecha_entrada, fecha_salida, reserva_id)
            
        except DjangoValidationError as e:
            raise serializers.ValidationError(str(e))
        
        return data
    
    def create(self, validated_data):
        # Extraer datos del cliente si vienen
        cliente_nombre = validated_data.pop('cliente_nombre', None)
        cliente_email = validated_data.pop('cliente_email', None)
        cliente_telefono = validated_data.pop('cliente_telefono', None)
        
        # Si vienen datos de cliente, buscar o crear
        if cliente_email:
            cliente, created = Cliente.objects.get_or_create(
                email=cliente_email,
                defaults={
                    'nombre': cliente_nombre or 'Cliente sin nombre',
                    'telefono': cliente_telefono or 'Sin teléfono'
                }
            )
            validated_data['cliente'] = cliente
        
        # Crear reserva
        reserva = Reserva.objects.create(**validated_data)
        return reserva
    
    def update(self, instance, validated_data):
        # Actualizar solo campos permitidos
        instance.estado = validated_data.get('estado', instance.estado)
        instance.fecha_entrada = validated_data.get('fecha_entrada', instance.fecha_entrada)
        instance.fecha_salida = validated_data.get('fecha_salida', instance.fecha_salida)
        instance.numero_personas = validated_data.get('numero_personas', instance.numero_personas)
        instance.precio_total = validated_data.get('precio_total', instance.precio_total)
        instance.mensaje = validated_data.get('mensaje', instance.mensaje)
        instance.save()
        return instance
    

class InformacionHostalSerializer(serializers.ModelSerializer):
    """Serializer para información del hostal"""
    
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
        """Retorna lista de espacios comunes activos"""
        espacios = []
        if obj.sala_comun:
            espacios.append({
                'nombre': 'Sala común',
                'descripcion': obj.sala_comun_descripcion
            })
        if obj.cocina_compartida:
            espacios.append({
                'nombre': 'Cocina compartida',
                'descripcion': obj.cocina_compartida_descripcion
            })
        if obj.banos_compartidos:
            espacios.append({
                'nombre': 'Baños compartidos',
                'descripcion': obj.banos_compartidos_descripcion
            })
        return espacios
    
    def get_caracteristicas_destacadas(self, obj):
        """Retorna lista de características destacadas activas"""
        caracteristicas = []
        if obj.hogar_familiar:
            caracteristicas.append({
                'nombre': 'Hogar familiar',
                'descripcion': obj.hogar_familiar_descripcion
            })
        if obj.ambiente_sano:
            caracteristicas.append({
                'nombre': 'Ambiente sano',
                'descripcion': obj.ambiente_sano_descripcion
            })
        if obj.entorno_ecologico:
            caracteristicas.append({
                'nombre': 'Entorno ecológico',
                'descripcion': obj.entorno_ecologico_descripcion
            })
        return caracteristicas
    
    def get_ubicacion_completa(self, obj):
        """Retorna ubicación formateada"""
        return f"{obj.ciudad}, {obj.departamento}"