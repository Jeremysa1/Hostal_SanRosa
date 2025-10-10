
from rest_framework import serializers
from .models import Habitacion, Cliente, Reserva

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