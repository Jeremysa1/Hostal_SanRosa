
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



class SitioTuristico(models.Model):
    nombre = models.CharField(max_length=200, help_text="Ej: Termales Santa Rosa de Cabal")
    descripcion_corta = models.TextField(max_length=300, help_text="Descripción breve para tarjeta")
    descripcion_completa = models.TextField(help_text="Descripción detallada")
    
    # Imágenes
    imagen_principal = models.ImageField(upload_to='sitios_turisticos/', help_text="Imagen para lista")
    imagen_detalle = models.ImageField(upload_to='sitios_turisticos/', null=True, blank=True, help_text="Imagen grande para página de detalle")
    
    # Ubicación
    ubicacion = models.CharField(max_length=300, help_text="Ej: A 15 minutos en carro desde Turquesa Hostel")
    coordenadas_lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, help_text="Latitud para Google Maps")
    coordenadas_lng = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, help_text="Longitud para Google Maps")
    
    # Información adicional
    actividades = models.TextField(help_text="Ej: Baños termales, caminatas cortas, fotografía")
    tips = models.TextField(help_text="Ej: Lleva traje de baño, sandalias y una muda extra de ropa")
    
    # Orden y estado
    orden = models.IntegerField(default=0, help_text="Orden de aparición (menor número = primero)")
    activo = models.BooleanField(default=True, help_text="Mostrar en la web")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Sitio Turístico'
        verbose_name_plural = 'Sitios Turísticos'
        ordering = ['orden', 'nombre']
    
    def __str__(self):
        return self.nombre
    

class InformacionHostal(models.Model):
    """
    Información general del hostal (solo debe existir UN registro)
    Diana puede editar desde el admin
    """
    # Información básica
    nombre = models.CharField(max_length=200, default="Turquesa Hostal")
    eslogan = models.CharField(max_length=300, help_text=" UN ESPACIO ECOLÓGICO Y FAMILIAR")
    descripcion_corta = models.TextField(help_text="Descripción breve para la home")
    descripcion_completa = models.TextField(help_text="Descripción detallada")
    
    # Ubicación
    direccion = models.CharField(max_length=300)
    ciudad = models.CharField(max_length=100, default="Santa Rosa de Cabal")
    departamento = models.CharField(max_length=100, default="Risaralda")
    pais = models.CharField(max_length=100, default="Colombia")
    coordenadas_lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    coordenadas_lng = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Contacto
    telefono = models.CharField(max_length=20)
    email = models.EmailField()
    whatsapp = models.CharField(max_length=20, help_text="Número de WhatsApp Business")
    
    # Redes sociales
    instagram = models.URLField(blank=True, null=True)
    facebook = models.URLField(blank=True, null=True)
    
    # Horarios
    checkin_desde = models.TimeField(default='15:00', help_text="Check-in desde las")
    checkout_hasta = models.TimeField(default='11:00', help_text="Check-out hasta las")
    
    # Espacios comunes
    sala_comun = models.BooleanField(default=True)
    sala_comun_descripcion = models.CharField(max_length=200, default="Un espacio para descansar y compartir")
    
    cocina_compartida = models.BooleanField(default=True)
    cocina_compartida_descripcion = models.CharField(max_length=200, default="Equipada para que prepares tus comidas")
    
    banos_compartidos = models.BooleanField(default=True)
    banos_compartidos_descripcion = models.CharField(max_length=200, default="Cómodos y limpios para todos los huéspedes")
    
    # Características destacadas
    hogar_familiar = models.BooleanField(default=True)
    hogar_familiar_descripcion = models.CharField(max_length=200, default="La calidez de sentirse como en casa, en un entorno acogedor")
    
    ambiente_sano = models.BooleanField(default=True)
    ambiente_sano_descripcion = models.CharField(max_length=200, default="Un espacio libre de humo y excesos, ideal para descansar")
    
    entorno_ecologico = models.BooleanField(default=True)
    entorno_ecologico_descripcion = models.CharField(max_length=200, default="Un lugar limpio y consciente para disfrutar con tranquilidad")
    
    # Políticas
    politicas_cancelacion = models.TextField(blank=True, help_text="Políticas de cancelación")
    politicas_mascotas = models.TextField(blank=True, help_text="Políticas sobre mascotas")
    politicas_fumar = models.TextField(blank=True, help_text="Políticas sobre fumar")
    
    # Imágenes
    logo = models.ImageField(upload_to='hostal/', null=True, blank=True)
    imagen_principal = models.ImageField(upload_to='hostal/', null=True, blank=True, help_text="Imagen para la home")
    
    # Copyright
    copyright_text = models.CharField(max_length=100, default="© 2025 Turquesa hostal")
    
    # Metadata
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Información del Hostal'
        verbose_name_plural = 'Información del Hostal'
    
    def __str__(self):
        return self.nombre
    
    def save(self, *args, **kwargs):
        """Asegurar que solo exista un registro"""
        if not self.pk and InformacionHostal.objects.exists():
            # Si ya existe un registro y estamos creando uno nuevo, actualizamos el existente
            existing = InformacionHostal.objects.first()
            self.pk = existing.pk
        super().save(*args, **kwargs)
    
    @classmethod
    def get_info(cls):
        """Método para obtener la información del hostal (crea una por defecto si no existe)"""
        info, created = cls.objects.get_or_create(
            pk=1,
            defaults={
                'nombre': 'Turquesa Hostal',
                'eslogan': 'UN ESPACIO ECOLÓGICO Y FAMILIAR',
                'descripcion_corta': 'Ideal para quienes buscan comodidad y descanso en Santa Rosa de Cabal',
                'descripcion_completa': 'Turquesa Hostal es un espacio acogedor...',
                'direccion': 'Santa Rosa de Cabal, Risaralda',
                'ciudad': 'Santa Rosa de Cabal',
                'telefono': '3001234567',
                'email': 'info@turquesahostal.com',
                'whatsapp': '573001234567'
            }
        )
        return info