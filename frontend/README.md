# Frontend · Turquesa Hostal

Web pública del hostal hecha con React 19, TypeScript y Vite.

## Comandos

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # typecheck + build de producción en dist/
npm run lint       # ESLint
npm run typecheck  # solo TypeScript
```

## Configuración

Copia `.env.example` como `.env.local`:

| Variable       | Descripción                                    | Por defecto                     |
| -------------- | ---------------------------------------------- | ------------------------------- |
| `VITE_API_URL` | URL base de la API del backend (sin `/` final) | La API de producción en Railway |

## Organización

```
src/
├── componentes/
│   ├── layout/        Menú, pie de página, layouts y ScrollToTop
│   ├── comunes/       Piezas reutilizables: MapaLeaflet, FranjaIconos / IconoItem
│   ├── inicio/        Secciones de la página de inicio
│   ├── habitaciones/  Tarjeta, detalle (modal) y espacios comunes
│   ├── turismo/       Tarjetas, encabezado y mapa de cada sitio
│   └── reservas/      Formulario de pre-reserva
├── data/              Contenido de la web (habitaciones, sitios turísticos, hostal)
├── pages/             Una página por ruta
├── services/          Llamadas a la API (api.ts maneja errores de DRF)
├── utils/             Funciones puras (pluralización de camas)
├── config.ts          URL de la API y rutas de la app
└── types.ts           Tipos compartidos
```

### Rutas

| Ruta              | Página                                                  |
| ----------------- | ------------------------------------------------------- |
| `/`               | Inicio                                                  |
| `/habitaciones`   | Listado de habitaciones                                 |
| `/turismo`        | Sitios turísticos                                       |
| `/turismo/:slug`  | Detalle de un sitio (`/Sitio-Turismo1..5` redirige aquí) |
| `/pagformulario`  | Formulario de pre-reserva (sin menú ni pie)             |

### Añadir contenido

- **Un sitio turístico nuevo:** agrega una entrada en `src/data/sitiosTuristicos.ts`. La tarjeta, la página y el mapa se generan solos.
- **Una habitación:** agrégala en `src/data/habitaciones.ts`. Su `id` coincide con los tipos del backend (`doble`, `doble_sencilla`, ...).

### Nota sobre estilos

Todo el CSS es global y Vite lo une en el orden en que se importan los módulos. Si mueves imports de CSS o de componentes, revisa que la cascada no cambie. Por ejemplo, el tema de PrimeReact se importa en `pages/Habitaciones.tsx` después de los estilos propios.
