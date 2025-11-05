
#  Documentación API - Hostal Santa Rosa de Cabal

##  Descripción General

API REST para la gestión de reservas, habitaciones y sitios turísticos del Hostal Santa Rosa de Cabal, ubicado en Risaralda, Colombia.

---

## Tecnologías Utilizadas

### Backend
- **Python**: 3.12
- **Django**: 5.2.7
- **Django REST Framework**: 3.16.1
- **Base de Datos**: PostgreSQL 16

### Librerías Principales
- `djangorestframework-simplejwt`: 5.5.1 - Autenticación JWT
- `django-cors-headers`: 4.9.0 - Manejo de CORS
- `django-ratelimit`: 4.1.0 - Rate limiting
- `psycopg2-binary`: 2.9.10 - Conector PostgreSQL
- `Pillow`: 11.3.0 - Procesamiento de imágenes
- `python-decouple`: 3.8 - Variables de entorno
- `drf-spectacular`: 0.28.0 - Documentación Swagger/OpenAPI

---

##  Seguridad y Autenticación

### Autenticación

**Métodos soportados:**
1. **JWT (JSON Web Tokens)** - Para app móvil de administración
2. **Session Authentication** - Para Django Admin y navegador

### Obtener Token JWT
```http
POST /api/token/
Content-Type: application/json

{
  "username": "admin",
  "password": "tu_password"
}
```

**Respuesta:**
```json
{
  "access": "eyJ0eXAiOiJKV1Q...",
  "refresh": "eyJ0eXAiOiJKV1Q..."
}
```

**Usar el token:**
```http
GET /api/calendario/
Authorization: Bearer eyJ0eXAiOiJKV1Q...
```

### Refrescar Token
```http
POST /api/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1Q..."
}
```

---

## Permisos y Control de Acceso

### Endpoints Públicos (sin autenticación)
- `GET /api/habitaciones/` - Lista de habitaciones
- `GET /api/habitaciones/{id}/` - Detalle de habitación
- `GET /api/habitaciones/{id}/disponibilidad/` - Verificar disponibilidad
- `POST /api/reservas/` - Crear reserva (genera URL WhatsApp)
- `GET /api/sitios-turisticos/` - Lista de sitios turísticos
- `GET /api/sitios-turisticos/{id}/` - Detalle de sitio turístico
- `GET /api/informacion-hostal/` - Información del hostal

### Endpoints Privados (solo administradores)
- `GET /api/calendario/` - Calendario mensual completo
- `GET /api/calendario/habitacion/{id}/` - Disponibilidad por habitación
- `GET /api/calendario/reservas/` - Gestión de reservas
- `POST /api/calendario/reservas/` - Crear reserva desde app móvil
- `PATCH /api/calendario/reservas/{id}/` - Actualizar estado de reserva
- `GET /api/clientes/` - Lista de clientes
- `GET /api/reservas/` - Ver todas las reservas

---

## Rate Limiting

### Límites de peticiones:

**Usuarios anónimos:**
- 100 peticiones por hora (general)
- 5 reservas por hora por IP

**Usuarios autenticados:**
- 1000 peticiones por hora (general)
- 20 reservas por hora
- 100 peticiones por minuto al calendario

**Respuesta cuando se excede el límite:**
```json
{
  "detail": "Request was throttled. Expected available in 3599 seconds."
}
```

---

## CORS (Cross-Origin Resource Sharing)

**Orígenes permitidos:**
- `http://localhost:3000` (Create React App)
- `http://localhost:5173` (Vite)

En producción se configurarán los dominios reales.

---

## Endpoints Principales

### Habitaciones

#### Listar habitaciones disponibles
```http
GET /api/habitaciones/
```

**Respuesta:**
```json
{
  "count": 6,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "nombre": "Habitación Doble Turquesa",
      "tipo": "doble",
      "capacidad": 2,
      "precio": "150000.00",
      "descripcion": "Habitación cómoda con vista al jardín",
      "disponible": true,
      "imagen": "/media/habitaciones/doble1.jpg",
      "camas_info": "1 cama doble",
      "wifi": true,
      "tv": true,
      "estacionamiento": true,
      "mascotas": true,
      "closet": true,
      "lavanderia": true,
      "checkin_hora": "15:00:00",
      "checkout_hora": "11:00:00"
    }
  ]
}
```

#### Detalle de habitación
```http
GET /api/habitaciones/{id}/
```

#### Verificar disponibilidad
```http
GET /api/habitaciones/{id}/disponibilidad/?fecha_entrada=2025-11-15&fecha_salida=2025-11-17
```

**Respuesta:**
```json
{
  "disponible": true,
  "habitacion": "Habitación Doble Turquesa",
  "fecha_entrada": "2025-11-15",
  "fecha_salida": "2025-11-17",
  "reservas_conflicto": 0
}
```

---

###  Reservas

#### Crear reserva (público)
```http
POST /api/reservas/
Content-Type: application/json

{
  "habitacion": 1,
  "fecha_entrada": "2025-11-15",
  "fecha_salida": "2025-11-17",
  "numero_personas": 2,
  "precio_total": 300000,
  "mensaje": "Preferimos habitación tranquila",
  "cliente_nombre": "Juan Pérez",
  "cliente_email": "juan@email.com",
  "cliente_telefono": "3001234567"
}
```

**Respuesta:**
```json
{
  "reserva": {
    "id": 1,
    "habitacion": {...},
    "fecha_entrada": "2025-11-15",
    "fecha_salida": "2025-11-17",
    "numero_personas": 2,
    "estado": "pendiente",
    "precio_total": "300000.00"
  },
  "whatsapp_url": "https://wa.me/573001234567?text=...",
  "mensaje": "Reserva creada exitosamente"
}
```

**Validaciones automáticas:**
-  fecha_entrada < fecha_salida
-  Fechas no sean pasadas
-  numero_personas no exceda capacidad de habitación
-  Habitación esté disponible en esas fechas
-  Reserva entre 1 y 30 días

---

###  Sitios Turísticos

#### Listar sitios turísticos
```http
GET /api/sitios-turisticos/
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "Termales Santa Rosa de Cabal",
    "descripcion_corta": "Disfruta de aguas termales naturales...",
    "imagen_principal": "/media/sitios_turisticos/termales.jpg",
    "ubicacion": "A 15 minutos en carro desde Turquesa Hostel"
  }
]
```

#### Detalle de sitio turístico
```http
GET /api/sitios-turisticos/{id}/
```

**Respuesta:**
```json
{
  "id": 1,
  "nombre": "Termales Santa Rosa de Cabal",
  "descripcion_corta": "...",
  "descripcion_completa": "...",
  "imagen_principal": "/media/sitios_turisticos/termales.jpg",
  "imagen_detalle": "/media/sitios_turisticos/termales_detalle.jpg",
  "ubicacion": "A 15 minutos en carro...",
  "coordenadas_lat": "4.8667",
  "coordenadas_lng": "-75.6167",
  "actividades": "Baños termales, caminatas cortas, fotografía",
  "tips": "Lleva traje de baño, sandalias..."
}
```

---

###  Información del Hostal

#### Obtener información general
```http
GET /api/informacion-hostal/
```

**Respuesta:**
```json
{
  "id": 1,
  "nombre": "Turquesa Hostal",
  "eslogan": "UN ESPACIO ECOLÓGICO Y FAMILIAR",
  "descripcion_corta": "Ideal para quienes buscan comodidad...",
  "descripcion_completa": "...",
  "direccion": "Calle Principal #123",
  "ciudad": "Santa Rosa de Cabal",
  "departamento": "Risaralda",
  "pais": "Colombia",
  "ubicacion_completa": "Santa Rosa de Cabal, Risaralda",
  "coordenadas_lat": "4.8667",
  "coordenadas_lng": "-75.6167",
  "telefono": "3001234567",
  "email": "info@turquesahostal.com",
  "whatsapp": "573001234567",
  "instagram": "https://instagram.com/turquesahostal",
  "facebook": null,
  "checkin_desde": "15:00:00",
  "checkout_hasta": "11:00:00",
  "espacios_comunes": [
    {
      "nombre": "Sala común",
      "descripcion": "Un espacio para descansar y compartir"
    },
    {
      "nombre": "Cocina compartida",
      "descripcion": "Equipada para que prepares tus comidas"
    },
    {
      "nombre": "Baños compartidos",
      "descripcion": "Cómodos y limpios para todos los huéspedes"
    }
  ],
  "caracteristicas_destacadas": [
    {
      "nombre": "Hogar familiar",
      "descripcion": "La calidez de sentirse como en casa..."
    },
    {
      "nombre": "Ambiente sano",
      "descripcion": "Un espacio libre de humo..."
    },
    {
      "nombre": "Entorno ecológico",
      "descripcion": "Un lugar limpio y consciente..."
    }
  ],
  "logo": "/media/hostal/logo.png",
  "imagen_principal": "/media/hostal/principal.jpg",
  "copyright_text": "© 2025 Turquesa hostal"
}
```

---

###  Calendario (Solo Administradores)

#### Obtener calendario mensual
```http
GET /api/calendario/?mes=11&anio=2025
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "mes": 11,
  "anio": 2025,
  "nombre_mes": "Noviembre",
  "total_dias": 30,
  "habitaciones": [
    {
      "id": 1,
      "nombre": "Habitación Doble",
      "tipo": "Doble",
      "capacidad": 2
    }
  ],
  "dias": [
    {
      "fecha": "2025-11-01",
      "dia": 1,
      "dia_semana": "Sábado",
      "habitaciones_estado": [
        {
          "habitacion_id": 1,
          "disponible": false,
          "color": "rojo",
          "reserva": {
            "id": 1,
            "cliente": "Juan Pérez",
            "telefono": "3001234567",
            "email": "juan@email.com",
            "fecha_entrada": "2025-11-01",
            "fecha_salida": "2025-11-03",
            "numero_personas": 2,
            "precio_total": "300000.00",
            "estado": "Confirmada",
            "mensaje": "..."
          }
        }
      ]
    }
  ]
}
```

---

##  Manejo de Archivos Media

**URL base de archivos:** `http://127.0.0.1:8000/media/`

**Estructura:**
```
media/
├── habitaciones/       # Imágenes de habitaciones
├── sitios_turisticos/  # Imágenes de sitios turísticos
└── hostal/            # Logo e imágenes del hostal
```

**Ejemplo de URL completa:**
```
http://127.0.0.1:8000/media/habitaciones/doble1.jpg
```

---

##  Instalación y Configuración

### Requisitos
- Python 3.12+
- PostgreSQL 16+
- pip

### Instalación
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/hostal-sanrosa.git
cd hostal_sanrosa

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno (.env)
SECRET_KEY=tu-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=hostal_sanrosa_db
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
WHATSAPP_NUMBER=573001234567
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Crear base de datos PostgreSQL
createdb hostal_sanrosa_db

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Correr servidor
python manage.py runserver
```

---

## Documentación Interactiva

**Swagger UI:** http://127.0.0.1:8000/api/docs/  
**ReDoc:** http://127.0.0.1:8000/api/redoc/  
**Django Admin:** http://127.0.0.1:8000/admin/

---

##  Manejo de Errores

### Códigos de estado HTTP

- `200 OK` - Petición exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Error de validación
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - Sin permisos
- `404 Not Found` - Recurso no encontrado
- `429 Too Many Requests` - Rate limit excedido
- `500 Internal Server Error` - Error del servidor

### Formato de errores
```json
{
  "detail": "Mensaje de error descriptivo"
}
```

**Errores de validación:**
```json
{
  "non_field_errors": [
    "La fecha de entrada debe ser anterior a la fecha de salida"
  ]
}
```

---

##  Soporte

**Equipo de desarrollo:**  
Email: yeremisanchezarias@gmail.com
Repositorio: https://github.com/Jeremysa1/Hostal_SanRosa

---

## Notas para el Equipo Frontend

### URLs importantes
- **Base URL Backend:** `http://127.0.0.1:8000`
- **Base URL API:** `http://127.0.0.1:8000/api`
- **Archivos media:** `http://127.0.0.1:8000/media`

### Consideraciones
1. Todas las imágenes vienen con rutas relativas, agregar base URL
2. El botón "Reservar" debe redirigir a `whatsapp_url` del response
3. Los endpoints públicos NO requieren autenticación
4. Usar paginación en listas grandes
5. Manejar estados de carga y errores en UI

---

**Última actualización:** Octubre 2025  
**Versión:** 2.0.0