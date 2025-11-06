
from django.contrib import admin
from django.utils.html import format_html
from .models import Habitacion, Cliente, Reserva, SitioTuristico, InformacionHostal

@admin.register(Habitacion)
class HabitacionAdmin(admin.ModelAdmin):
    # Campos que se muestran en la lista
    list_display = ['nombre', 'tipo', 'capacidad', 'precio', 'disponible', 'ver_imagen']
    
    # Campos editables directamente desde la lista (Diana puede editar precio aquí)
    list_editable = ['precio', 'disponible']
    
    # Filtros laterales
    list_filter = ['tipo', 'disponible', 'capacidad']
    
    # Buscador
    search_fields = ['nombre', 'descripcion']
    
    # Organización del formulario de edición
    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'tipo', 'capacidad', 'precio', 'disponible')
        }),
        ('Descripción', {
            'fields': ('descripcion', 'camas_info')
        }),
        ('Imagen', {
            'fields': ('imagen',),
            'description': 'Sube una imagen de la habitación (se mostrará en la web)'
        }),
        ('Servicios Incluidos', {
            'fields': ('wifi', 'tv', 'estacionamiento', 'mascotas', 'closet', 'lavanderia'),
            'classes': ('collapse',)  # Sección colapsable
        }),
        ('Horarios Check-in/out', {
            'fields': ('checkin_hora', 'checkout_hora'),
            'classes': ('collapse',)
        }),
    )
    
    # Mostrar vista previa de la imagen en la lista
    def ver_imagen(self, obj):
        if obj.imagen:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 5px;" />', obj.imagen.url)
        return "Sin imagen"
    ver_imagen.short_description = 'Vista Previa'
    
    # Valores por defecto al crear nueva habitación
    def get_changeform_initial_data(self, request):
        return {
            'wifi': True,
            'tv': True,
            'estacionamiento': True,
            'mascotas': True,
            'closet': True,
            'lavanderia': True,
        }

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'email', 'telefono', 'fecha_registro']
    search_fields = ['nombre', 'email', 'telefono']
    list_filter = ['fecha_registro']
    readonly_fields = ['fecha_registro']  # Diana no puede cambiar la fecha de registro

@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = ['id', 'cliente', 'habitacion', 'fecha_entrada', 'fecha_salida', 'estado', 'precio_total', 'numero_personas']
    list_filter = ['estado', 'fecha_entrada', 'habitacion']
    search_fields = ['cliente__nombre', 'habitacion__nombre']
    list_editable = ['estado']  # Diana puede cambiar el estado desde la lista
    date_hierarchy = 'fecha_entrada'
    
    # Organización del formulario
    fieldsets = (
        ('Cliente y Habitación', {
            'fields': ('cliente', 'habitacion')
        }),
        ('Fechas y Personas', {
            'fields': ('fecha_entrada', 'fecha_salida', 'numero_personas')
        }),
        ('Estado y Precio', {
            'fields': ('estado', 'precio_total')
        }),
        ('Información Adicional', {
            'fields': ('mensaje',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']

@admin.register(SitioTuristico)
class SitioTuristicoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'ubicacion', 'orden', 'activo', 'ver_imagen']
    list_editable = ['orden', 'activo']
    list_filter = ['activo']
    search_fields = ['nombre', 'descripcion_corta']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'descripcion_corta', 'descripcion_completa')
        }),
        ('Imágenes', {
            'fields': ('imagen_principal', 'imagen_detalle'),
            'description': 'Imagen principal para lista, imagen detalle para página individual'
        }),
        ('Ubicación', {
            'fields': ('ubicacion', 'coordenadas_lat', 'coordenadas_lng'),
            'description': 'Coordenadas opcionales para Google Maps'
        }),
        ('Detalles', {
            'fields': ('actividades', 'tips')
        }),
        ('Configuración', {
            'fields': ('orden', 'activo'),
            'classes': ('collapse',)
        }),
    )
    
    def ver_imagen(self, obj):
        if obj.imagen_principal:
            return format_html(
                '<img src="{}" width="80" height="60" style="object-fit: cover; border-radius: 5px;" />', 
                obj.imagen_principal.url
            )
        return "Sin imagen"
    ver_imagen.short_description = 'Vista Previa'


@admin.register(InformacionHostal)
class InformacionHostalAdmin(admin.ModelAdmin):
    """
    Admin para información del hostal
    Solo debe haber UN registro
    """
    
    def has_add_permission(self, request):
        # Solo permitir agregar si no existe ningún registro
        return not InformacionHostal.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # No permitir eliminar
        return False
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'eslogan', 'descripcion_corta', 'descripcion_completa')
        }),
        ('Ubicación', {
            'fields': ('direccion', 'ciudad', 'departamento', 'pais', 'coordenadas_lat', 'coordenadas_lng'),
        }),
        ('Contacto', {
            'fields': ('telefono', 'email', 'whatsapp', 'instagram', 'facebook')
        }),
        ('Horarios', {
            'fields': ('checkin_desde', 'checkout_hasta')
        }),
        ('Espacios Comunes', {
            'fields': (
                'sala_comun', 'sala_comun_descripcion',
                'cocina_compartida', 'cocina_compartida_descripcion',
                'banos_compartidos', 'banos_compartidos_descripcion'
            ),
            'classes': ('collapse',)
        }),
        ('Características Destacadas', {
            'fields': (
                'hogar_familiar', 'hogar_familiar_descripcion',
                'ambiente_sano', 'ambiente_sano_descripcion',
                'entorno_ecologico', 'entorno_ecologico_descripcion'
            ),
            'classes': ('collapse',)
        }),
        ('Políticas', {
            'fields': ('politicas_cancelacion', 'politicas_mascotas', 'politicas_fumar'),
            'classes': ('collapse',)
        }),
        ('Imágenes', {
            'fields': ('logo', 'imagen_principal')
        }),
        ('Copyright', {
            'fields': ('copyright_text',)
        }),
    )
    
    list_display = ['nombre', 'ciudad', 'telefono', 'email', 'updated_at']
    
    def changelist_view(self, request, extra_context=None):
        """Redirigir directamente al formulario de edición si existe un registro"""
        if InformacionHostal.objects.exists():
            obj = InformacionHostal.objects.first()
            from django.shortcuts import redirect
            from django.urls import reverse
            return redirect(reverse('admin:reservas_informacionhostal_change', args=[obj.pk]))
        return super().changelist_view(request, extra_context)