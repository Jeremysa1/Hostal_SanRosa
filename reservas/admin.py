
from django.contrib import admin
from django.utils.html import format_html
from .models import Habitacion, Cliente, Reserva

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