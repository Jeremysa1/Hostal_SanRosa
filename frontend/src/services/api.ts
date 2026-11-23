import { API_BASE_URL } from '../config';

/** Error de la API con el mensaje más útil que devolvió el backend. */
export class ApiError extends Error {
  readonly status: number;
  readonly detalle: unknown;

  constructor(mensaje: string, status: number, detalle: unknown) {
    super(mensaje);
    this.name = 'ApiError';
    this.status = status;
    this.detalle = detalle;
  }
}

/**
 * Extrae el primer mensaje legible de una respuesta de error de DRF:
 * `{"detail": "..."}`, `{"non_field_errors": ["..."]}` o `{"campo": ["..."]}`.
 */
function primerMensaje(detalle: unknown): string | null {
  if (typeof detalle === 'string') return detalle;
  if (Array.isArray(detalle)) return detalle.length ? primerMensaje(detalle[0]) : null;
  if (detalle && typeof detalle === 'object') {
    for (const valor of Object.values(detalle)) {
      const mensaje = primerMensaje(valor);
      if (mensaje) return mensaje;
    }
  }
  return null;
}

export async function postJson<T>(ruta: string, cuerpo: unknown, mensajePorDefecto: string): Promise<T> {
  const respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  });

  const datos: unknown = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    throw new ApiError(primerMensaje(datos) ?? mensajePorDefecto, respuesta.status, datos);
  }
  return datos as T;
}
