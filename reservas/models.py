
from django.db import models
from django.core.validators import MinValueValidator

class Habitacion(models.Model):
    TIPO_CHOICES = [
        ('doble', 'Doble'),
        ('triple', 'Triple'),
        ('para_5', 'Para 5 Personas'),
        ('para_6', 'Para 6 Personas'),
    ]
    
    nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    capacidad = models.IntegerField(validators=[MinValueValidator(1)])
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField()
    disponible = models.BooleanField(default=True)
    imagen = models.ImageField(upload_to='habitaciones/', null=True, blank=True)
    
    # Servicios
    wifi = models.BooleanField(default=True)
    tv = models.BooleanField(default=True)
    estacionamiento = models.BooleanField(default=True)
    mascotas = models.BooleanField(default=True)
    closet = models.BooleanField(default=True)
    lavanderia = models.BooleanField(default=True)
    
    # Detalles de camas
    camas_info = models.TextField(help_text="Ej: 2 camas dobles, 2 individuales")
    
    # Horarios
    checkin_hora = models.TimeField(default='15:00')
    checkout_hora = models.TimeField(default='11:00')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Habitación'
        verbose_name_plural = 'Habitaciones'
        ordering = ['capacidad', 'precio']
    
    def __str__(self):
        return f"{self.nombre} - {self.get_tipo_display()}"


class Cliente(models.Model):
    nombre = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'
        ordering = ['-fecha_registro']
    
    def __str__(self):
        return f"{self.nombre} - {self.telefono}"


class Reserva(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('cancelada', 'Cancelada'),
        ('completada', 'Completada'),
    ]
    
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='reservas')
    habitacion = models.ForeignKey(Habitacion, on_delete=models.CASCADE, related_name='reservas')
    
    fecha_entrada = models.DateField()
    fecha_salida = models.DateField()
    numero_personas = models.IntegerField(validators=[MinValueValidator(1)])
    
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    mensaje = models.TextField(blank=True, null=True, help_text="Mensaje adicional del cliente")
    
    precio_total = models.DecimalField(max_digits=10, decimal_places=2)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Reserva'
        verbose_name_plural = 'Reservas'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Reserva #{self.id} - {self.cliente.nombre} - {self.habitacion.nombre}"
