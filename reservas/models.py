from django.core.validators import MinValueValidator
from django.db import models
from cloudinary.models import CloudinaryField


# =========================================================
# HABITACIÓN
# =========================================================
class Habitacion(models.Model):
    class Tipo(models.TextChoices):
        DOBLE = 'doble', 'Habitación Doble (2 personas)'
        DOBLE_SENCILLA = 'doble_sencilla', 'Habitación Doble Sencilla (2 personas)'
        TRIPLE = 'triple', 'Habitación Triple (3 personas)'
        FAMILIAR = 'familiar', 'Habitación Familiar (5 personas)'
        FAMILIAR_GRANDE = 'familiar_grande', 'Habitación Familiar Grande (5 personas)'
        SUITE = 'suite', 'Habitación Suite (5 personas)'

    # Alias por compatibilidad con código que use la constante antigua.
    TIPO_CHOICES = Tipo.choices

    nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=20, choices=Tipo.choices)
    capacidad = models.IntegerField(validators=[MinValueValidator(1)])
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField()
    disponible = models.BooleanField(default=True)
    imagen = CloudinaryField('imagen', folder='habitaciones/', null=True, blank=True)

    # Servicios
    wifi = models.BooleanField(default=True)
    tv = models.BooleanField(default=True)
    estacionamiento = models.BooleanField(default=True)
    mascotas = models.BooleanField(default=True)
    closet = models.BooleanField(default=True)
    lavanderia = models.BooleanField(default=True)

    camas_info = models.TextField(help_text="Ej: 2 camas dobles, 2 individuales")

    checkin_hora = models.TimeField(default='15:00')
    checkout_hora = models.TimeField(default='11:00')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Campos de imagen que se sincronizan con Cloudinary (ver signals.py).
    CAMPOS_IMAGEN = ('imagen',)

    class Meta:
        verbose_name = 'Habitación'
        verbose_name_plural = 'Habitaciones'
        ordering = ['capacidad', 'precio']

    def __str__(self):
        return f"{self.nombre} - {self.get_tipo_display()}"


# =========================================================
# CLIENTE
# =========================================================
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


# =========================================================
# RESERVA
# =========================================================
class ReservaQuerySet(models.QuerySet):
    """Consultas reutilizables sobre reservas (evita repetir filtros)."""

    def activas(self):
        """Reservas que ocupan la habitación (pendientes o confirmadas)."""
        return self.filter(estado__in=Reserva.ESTADOS_ACTIVOS)

    def solapadas(self, fecha_entrada, fecha_salida):
        """Reservas activas que se cruzan con el rango [entrada, salida)."""
        return self.activas().filter(
            fecha_entrada__lt=fecha_salida,
            fecha_salida__gt=fecha_entrada,
        )

    def ocupando(self, fecha):
        """Reservas activas que ocupan la noche de `fecha`."""
        return self.activas().filter(fecha_entrada__lte=fecha, fecha_salida__gt=fecha)


class Reserva(models.Model):
    class Estado(models.TextChoices):
        PENDIENTE = 'pendiente', 'Pendiente'
        CONFIRMADA = 'confirmada', 'Confirmada'
        CANCELADA = 'cancelada', 'Cancelada'
        COMPLETADA = 'completada', 'Completada'

    ESTADO_CHOICES = Estado.choices
    ESTADOS_ACTIVOS = (Estado.PENDIENTE, Estado.CONFIRMADA)

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='reservas')
    habitacion = models.ForeignKey(Habitacion, on_delete=models.CASCADE, related_name='reservas')

    fecha_entrada = models.DateField()
    fecha_salida = models.DateField()
    numero_personas = models.IntegerField(validators=[MinValueValidator(1)])

    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.PENDIENTE)
    mensaje = models.TextField(blank=True, null=True, help_text="Mensaje adicional del cliente")

    precio_total = models.DecimalField(max_digits=10, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ReservaQuerySet.as_manager()

    class Meta:
        verbose_name = 'Reserva'
        verbose_name_plural = 'Reservas'
        ordering = ['-created_at']

    def __str__(self):
        return f"Reserva #{self.id} - {self.cliente.nombre} - {self.habitacion.nombre}"


# =========================================================
# SITIO TURÍSTICO
# =========================================================
class SitioTuristico(models.Model):
    nombre = models.CharField(max_length=200, help_text="Ej: Termales Santa Rosa de Cabal")
    descripcion_corta = models.TextField(max_length=300, help_text="Descripción breve para tarjeta")
    descripcion_completa = models.TextField(help_text="Descripción detallada")

    imagen_principal = CloudinaryField('imagen_principal', folder='sitios_turisticos/')
    imagen_detalle = CloudinaryField(
        'imagen_detalle', folder='sitios_turisticos/detalle/', null=True, blank=True
    )

    ubicacion = models.CharField(
        max_length=300, help_text="Ej: A 15 minutos en carro desde Turquesa Hostel"
    )
    coordenadas_lat = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True, help_text="Latitud para Google Maps"
    )
    coordenadas_lng = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True, help_text="Longitud para Google Maps"
    )

    actividades = models.TextField(help_text="Ej: Baños termales, caminatas cortas, fotografía")
    tips = models.TextField(help_text="Ej: Lleva traje de baño, sandalias y una muda extra de ropa")

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


# =========================================================
# INFORMACIÓN DEL HOSTAL (registro único)
# =========================================================
class InformacionHostal(models.Model):
    """Información general del hostal. Solo debe existir UN registro."""

    # Información básica
    nombre = models.CharField(max_length=200, default="Turquesa Hostal")
    eslogan = models.CharField(max_length=300, help_text="UN ESPACIO ECOLÓGICO Y FAMILIAR")
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
    sala_comun_descripcion = models.CharField(
        max_length=200, default="Un espacio para descansar y compartir"
    )
    cocina_compartida = models.BooleanField(default=True)
    cocina_compartida_descripcion = models.CharField(
        max_length=200, default="Equipada para que prepares tus comidas"
    )
    banos_compartidos = models.BooleanField(default=True)
    banos_compartidos_descripcion = models.CharField(
        max_length=200, default="Cómodos y limpios para todos los huéspedes"
    )

    # Características destacadas
    hogar_familiar = models.BooleanField(default=True)
    hogar_familiar_descripcion = models.CharField(
        max_length=200, default="La calidez de sentirse como en casa, en un entorno acogedor"
    )
    ambiente_sano = models.BooleanField(default=True)
    ambiente_sano_descripcion = models.CharField(
        max_length=200, default="Un espacio libre de humo y excesos, ideal para descansar"
    )
    entorno_ecologico = models.BooleanField(default=True)
    entorno_ecologico_descripcion = models.CharField(
        max_length=200, default="Un lugar limpio y consciente para disfrutar con tranquilidad"
    )

    # Políticas
    politicas_cancelacion = models.TextField(blank=True, help_text="Políticas de cancelación")
    politicas_mascotas = models.TextField(blank=True, help_text="Políticas sobre mascotas")
    politicas_fumar = models.TextField(blank=True, help_text="Políticas sobre fumar")

    # Imágenes
    logo = CloudinaryField('logo', folder='hostal/', null=True, blank=True)
    imagen_principal = CloudinaryField('imagen_principal', folder='hostal/', null=True, blank=True)

    copyright_text = models.CharField(max_length=100, default="© 2025 Turquesa hostal")

    updated_at = models.DateTimeField(auto_now=True)

    CAMPOS_IMAGEN = ('logo', 'imagen_principal')

    # (campo booleano, campo descripción, nombre visible) — usados por el serializer.
    ESPACIOS_COMUNES = (
        ('sala_comun', 'sala_comun_descripcion', 'Sala común'),
        ('cocina_compartida', 'cocina_compartida_descripcion', 'Cocina compartida'),
        ('banos_compartidos', 'banos_compartidos_descripcion', 'Baños compartidos'),
    )
    CARACTERISTICAS_DESTACADAS = (
        ('hogar_familiar', 'hogar_familiar_descripcion', 'Hogar familiar'),
        ('ambiente_sano', 'ambiente_sano_descripcion', 'Ambiente sano'),
        ('entorno_ecologico', 'entorno_ecologico_descripcion', 'Entorno ecológico'),
    )

    VALORES_POR_DEFECTO = {
        'nombre': 'Turquesa Hostal',
        'eslogan': 'UN ESPACIO ECOLÓGICO Y FAMILIAR',
        'descripcion_corta': 'Ideal para quienes buscan comodidad y descanso en Santa Rosa de Cabal',
        'descripcion_completa': 'Turquesa Hostal es un espacio acogedor...',
        'direccion': 'Santa Rosa de Cabal, Risaralda',
        'ciudad': 'Santa Rosa de Cabal',
        'telefono': '3001234567',
        'email': 'info@turquesahostal.com',
        'whatsapp': '573001234567',
    }

    class Meta:
        verbose_name = 'Información del Hostal'
        verbose_name_plural = 'Información del Hostal'

    def __str__(self):
        return self.nombre

    def save(self, *args, **kwargs):
        """Garantiza un único registro: un alta nueva sobrescribe el existente."""
        if not self.pk:
            existente_pk = InformacionHostal.objects.order_by('pk').values_list('pk', flat=True).first()
            if existente_pk is not None:
                self.pk = existente_pk
        super().save(*args, **kwargs)

    def items_activos(self, definicion):
        """Convierte una definición (ESPACIOS_COMUNES, ...) en la lista para la API."""
        return [
            {'nombre': nombre, 'descripcion': getattr(self, campo_descripcion)}
            for campo_activo, campo_descripcion, nombre in definicion
            if getattr(self, campo_activo)
        ]

    @classmethod
    def get_info(cls):
        """Devuelve el registro único, creándolo con valores por defecto si no existe."""
        info = cls.objects.order_by('pk').first()
        if info is None:
            info = cls.objects.create(**cls.VALORES_POR_DEFECTO)
        return info
