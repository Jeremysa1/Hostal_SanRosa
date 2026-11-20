from django.contrib import admin
from django.shortcuts import redirect
from django.urls import reverse
from django.utils.html import format_html

from .models import Cliente, Habitacion, InformacionHostal, Reserva, SitioTuristico

ESTILO_MINIATURA = 'object-fit: cover; border-radius: 5px;'


def miniatura(imagen, ancho, alto):
    """HTML de vista previa para un CloudinaryField (o texto si no hay imagen)."""
    if not imagen:
        return "Sin imagen"
    return format_html(
        '<img src="{}" width="{}" height="{}" style="{}" />',
        imagen.url, ancho, alto, ESTILO_MINIATURA,
    )


@admin.register(Habitacion)
class HabitacionAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'tipo', 'capacidad', 'precio', 'disponible', 'ver_imagen']
    list_editable = ['precio', 'disponible']
    list_filter = ['tipo', 'disponible', 'capacidad']
    search_fields = ['nombre', 'descripcion']
    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'tipo', 'capacidad', 'precio', 'disponible'),
        }),
        ('Descripción', {
            'fields': ('descripcion', 'camas_info'),
        }),
        ('Imagen', {
            'fields': ('imagen',),
            'description': 'Sube una imagen de la habitación (se mostrará en la web)',
        }),
        ('Servicios Incluidos', {
            'fields': ('wifi', 'tv', 'estacionamiento', 'mascotas', 'closet', 'lavanderia'),
            'classes': ('collapse',),
        }),
        ('Horarios Check-in/out', {
            'fields': ('checkin_hora', 'checkout_hora'),
            'classes': ('collapse',),
        }),
    )

    @admin.display(description='Vista Previa')
    def ver_imagen(self, obj):
        return miniatura(obj.imagen, 50, 50)


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'email', 'telefono', 'fecha_registro']
    search_fields = ['nombre', 'email', 'telefono']
    list_filter = ['fecha_registro']
    readonly_fields = ['fecha_registro']


@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'cliente', 'habitacion', 'fecha_entrada', 'fecha_salida',
        'estado', 'precio_total', 'numero_personas',
    ]
    list_filter = ['estado', 'fecha_entrada', 'habitacion']
    list_select_related = ['cliente', 'habitacion']
    search_fields = ['cliente__nombre', 'habitacion__nombre']
    list_editable = ['estado']
    date_hierarchy = 'fecha_entrada'
    autocomplete_fields = ['cliente']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Cliente y Habitación', {
            'fields': ('cliente', 'habitacion'),
        }),
        ('Fechas y Personas', {
            'fields': ('fecha_entrada', 'fecha_salida', 'numero_personas'),
        }),
        ('Estado y Precio', {
            'fields': ('estado', 'precio_total'),
        }),
        ('Información Adicional', {
            'fields': ('mensaje',),
            'classes': ('collapse',),
        }),
        ('Registro', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )


@admin.register(SitioTuristico)
class SitioTuristicoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'ubicacion', 'orden', 'activo', 'ver_imagen']
    list_editable = ['orden', 'activo']
    list_filter = ['activo']
    search_fields = ['nombre', 'descripcion_corta']
    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'descripcion_corta', 'descripcion_completa'),
        }),
        ('Imágenes', {
            'fields': ('imagen_principal', 'imagen_detalle'),
            'description': 'Imagen principal para lista, imagen detalle para página individual',
        }),
        ('Ubicación', {
            'fields': ('ubicacion', 'coordenadas_lat', 'coordenadas_lng'),
            'description': 'Coordenadas opcionales para Google Maps',
        }),
        ('Detalles', {
            'fields': ('actividades', 'tips'),
        }),
        ('Configuración', {
            'fields': ('orden', 'activo'),
            'classes': ('collapse',),
        }),
    )

    @admin.display(description='Vista Previa')
    def ver_imagen(self, obj):
        return miniatura(obj.imagen_principal, 80, 60)


@admin.register(InformacionHostal)
class InformacionHostalAdmin(admin.ModelAdmin):
    """Registro único: la lista redirige directamente al formulario de edición."""

    list_display = ['nombre', 'ciudad', 'telefono', 'email', 'updated_at']
    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'eslogan', 'descripcion_corta', 'descripcion_completa'),
        }),
        ('Ubicación', {
            'fields': ('direccion', 'ciudad', 'departamento', 'pais', 'coordenadas_lat', 'coordenadas_lng'),
        }),
        ('Contacto', {
            'fields': ('telefono', 'email', 'whatsapp', 'instagram', 'facebook'),
        }),
        ('Horarios', {
            'fields': ('checkin_desde', 'checkout_hasta'),
        }),
        ('Espacios Comunes', {
            'fields': (
                'sala_comun', 'sala_comun_descripcion',
                'cocina_compartida', 'cocina_compartida_descripcion',
                'banos_compartidos', 'banos_compartidos_descripcion',
            ),
            'classes': ('collapse',),
        }),
        ('Características Destacadas', {
            'fields': (
                'hogar_familiar', 'hogar_familiar_descripcion',
                'ambiente_sano', 'ambiente_sano_descripcion',
                'entorno_ecologico', 'entorno_ecologico_descripcion',
            ),
            'classes': ('collapse',),
        }),
        ('Políticas', {
            'fields': ('politicas_cancelacion', 'politicas_mascotas', 'politicas_fumar'),
            'classes': ('collapse',),
        }),
        ('Imágenes', {
            'fields': ('logo', 'imagen_principal'),
        }),
        ('Copyright', {
            'fields': ('copyright_text',),
        }),
    )

    def has_add_permission(self, request):
        return not InformacionHostal.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        info = InformacionHostal.objects.order_by('pk').first()
        if info is not None:
            return redirect(reverse('admin:reservas_informacionhostal_change', args=[info.pk]))
        return super().changelist_view(request, extra_context)
