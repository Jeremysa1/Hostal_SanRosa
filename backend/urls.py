


from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


# Personalizar títulos del admin
admin.site.site_header = "Hostal Santa Rosa de Cabal - Administración"
admin.site.site_title = "Hostal Santa Rosa"
admin.site.index_title = "Panel de Administración"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('reservas.urls')),  # ← NUEVO: URLs de la API
]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


#QUEDE EN EL PASO 14, AUN NO SE HACE, LUEGO SE HACE JUNTO A LOS PASOS SIGUIENTES