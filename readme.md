# 🏨 API - Hostal Santa Rosa de Cabal

## 📖 Descripción General

API REST para la gestión de **reservas, habitaciones, clientes y sitios turísticos** del Hostal Santa Rosa de Cabal (Risaralda, Colombia).  
Diseñada para integrarse con aplicaciones móviles y frontends en React o Flutter.

---

## 🗂️ Estructura del Repositorio

```
Hostal_SanRosa/
├── backend/              # Proyecto Django (settings, urls, wsgi)
├── reservas/             # App principal
│   ├── models.py         # Modelos + ReservaQuerySet (activas / solapadas / ocupando)
│   ├── services.py       # Lógica de negocio: crear reservas, disponibilidad, URL de WhatsApp
│   ├── validators.py     # Reglas de validación de reservas
│   ├── calendario.py     # Calendario de ocupación (consultas constantes)
│   ├── signals.py        # Limpieza de imágenes en Cloudinary
│   ├── serializers.py · views.py · urls.py · permissions.py · throttling.py · admin.py
│   └── tests/            # Tests de dominio y de API
├── frontend/             # Web pública (React + TypeScript + Vite)
│   └── src/
│       ├── componentes/  # layout/, comunes/, inicio/, habitaciones/, turismo/, reservas/
│       ├── data/         # Contenido: habitaciones, sitios turísticos, datos del hostal
│       ├── pages/        # Una página por ruta
│       ├── services/     # Llamadas a la API
│       ├── config.ts     # URL de la API (VITE_API_URL) y rutas
│       └── types.ts
├── requirements.txt
└── .env.example
```

---

## 🚀 Puesta en Marcha

### Backend
```bash
python -m venv .venv
.venv\Scripts\activate          # Windows  (Linux/macOS: source .venv/bin/activate)
pip install -r requirements.txt
copy .env.example .env          # y completa los valores
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Tests del backend
```bash
python manage.py test reservas
```
Para ejecutarlos sin PostgreSQL basta con `DATABASE_URL=sqlite:///test.sqlite3`.

### Frontend
```bash
cd frontend
npm install
copy .env.example .env.local    # VITE_API_URL=http://localhost:8000/api
npm run dev                     # también: npm run build · npm run lint · npm run typecheck
```

---

## ⚙️ Tecnologías Utilizadas

### Backend
- **Python**: 3.12  
- **Django**: 5.2.8  
- **Django REST Framework (DRF)**: 3.16.1  
- **Base de datos**: PostgreSQL 16  

### Librerías Principales
- `djangorestframework-simplejwt` → Autenticación JWT  
- `django-cors-headers` → Manejo de CORS  
- `psycopg2-binary` / `dj-database-url` → Conexión a PostgreSQL  
- `cloudinary` / `django-cloudinary-storage` → Imágenes  
- `whitenoise` → Archivos estáticos  
- `python-decouple` → Variables de entorno  
- `drf-spectacular` → Documentación Swagger / ReDoc  

### Frontend
- **React** 19 · **TypeScript** · **Vite** 6  
- `react-router-dom`, `primereact`, `react-leaflet`, `react-slick`, `react-icons`  

---

## 🔐 Seguridad y Autenticación

### Métodos soportados
1. **JWT (JSON Web Tokens)** → para autenticación de la app móvil o Flutter  
2. **Session Authentication** → para Django Admin  

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

## 🧾 Permisos y Control de Acceso

### Endpoints Públicos
- `GET /api/habitaciones/` → Lista de habitaciones  
- `GET /api/habitaciones/{id}/` → Detalle de habitación  
- `GET /api/habitaciones/{id}/disponibilidad/` → Verificar disponibilidad  
- `GET /api/habitaciones/todas/` → Lista completa de habitaciones (sin paginar)  
- `POST /api/reservas/` → Crear reserva  
- `POST /api/pre-reserva/` → Genera el enlace de WhatsApp (no guarda nada)  
- `GET /api/sitios-turisticos/` → Lista de sitios turísticos  
- `GET /api/sitios-turisticos/{id}/` → Detalle de sitio turístico  
- `GET /api/informacion-hostal/` → Información general del hostal  

### Endpoints Privados (solo administradores)
- `GET /api/calendario/` → Calendario mensual  
- `GET /api/calendario/habitacion/{id}/` → Disponibilidad por habitación  
- `GET /api/calendario/reservas/` → Ver reservas existentes  
- `POST /api/calendario/reservas/` → Crear reserva manual  
- `PATCH /api/calendario/reservas/{id}/` → Actualizar estado de reserva  
- `GET /api/clientes/` → Lista de clientes  

---

## ⏱️ Rate Limiting

**Usuarios anónimos**
- 5000 peticiones/hora (general)
- 5 reservas creadas/hora por IP (`POST /api/reservas/`)  

**Usuarios autenticados**
- 10000 peticiones/hora (general)  
- 20 reservas creadas/hora  
- 100 peticiones/minuto al calendario y al listado de reservas  

**Ejemplo de respuesta al exceder el límite:**
```json
{
  "detail": "Request was throttled. Expected available in 3599 seconds."
}
```

---

## 🌍 CORS

**Orígenes permitidos:** variable `CORS_ALLOWED_ORIGINS` (por defecto `http://localhost:5173`).

---

##  Endpoints Principales

### 🛏️ Habitaciones

#### Listar habitaciones
```http
GET /api/habitaciones/
```

#### Detalle de habitación
```http
GET /api/habitaciones/{id}/
```

#### Verificar disponibilidad
```http
GET /api/habitaciones/{id}/disponibilidad/?fecha_entrada=2025-11-15&fecha_salida=2025-11-17
```

#### Listar todas las habitaciones (sin paginación)
```http
GET /api/habitaciones/todas/
```

---

### 📅 Reservas

#### Crear reserva pública
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
  "mensaje": "Reserva registrada exitosamente"
}
```

#### Pre-reserva por WhatsApp (no guarda nada)
```http
POST /api/pre-reserva/
Content-Type: application/json

{
  "guestName": "Juan Pérez",
  "phoneNumber": "3001234567",
  "numberOfPeople": 2,
  "roomType": "Doble",
  "checkInDate": "2025-11-15",
  "checkOutDate": "2025-11-17"
}
```

**Respuesta:**
```json
{
  "whatsapp_url": "https://wa.me/573242989045?text=Hola%2C%20deseo%20solicitar..."
}
```

---

### 🏞️ Sitios Turísticos

#### Listar sitios turísticos
```http
GET /api/sitios-turisticos/
```

#### Detalle de sitio turístico
```http
GET /api/sitios-turisticos/{id}/
```

---

### 🏠 Información del Hostal

#### Obtener información general
```http
GET /api/informacion-hostal/
```

---

### 📆 Calendario (Solo administradores)
```http
GET /api/calendario/?mes=11&anio=2025
Authorization: Bearer {token}
```

**Respuesta (ejemplo resumido):**
```json
{
  "mes": 11,
  "anio": 2025,
  "habitaciones": [...],
  "dias": [...]
}
```

---

##  Documentación Interactiva

**Swagger UI:** http://127.0.0.1:8000/api/docs/  
**ReDoc:** http://127.0.0.1:8000/api/redoc/  
**Django Admin:** http://127.0.0.1:8000/admin/

---

## ⚠️ Manejo de Errores

| Código | Significado |
|--------|--------------|
| `200` | Petición exitosa |
| `201` | Recurso creado exitosamente |
| `400` | Error de validación (formato DRF: `{"campo": ["mensaje"]}` o `{"non_field_errors": ["mensaje"]}`) |
| `401` | No autenticado |
| `403` | Sin permisos |
| `404` | Recurso no encontrado |
| `429` | Límite de peticiones excedido |
| `500` | Error interno del servidor |

---

## 🔗 URLs Importantes

- **Base URL Backend:** `http://127.0.0.1:8000`  
- **Base URL API:** `http://127.0.0.1:8000/api`  
- **Base URL APP:** `https://hostalsanrosa-production.up.railway.app/`  

---

## 📩 Soporte

**Equipo de desarrollo:**  
📧 yeremisanchezarias@gmail.com  
🔗 [Repositorio GitHub](https://github.com/Jeremysa1/Hostal_SanRosa)

---

**Última actualización:** Noviembre 2025  
**Versión:** 2.0.1  
**Autor:** Jeremy Steven Sánchez Arias
