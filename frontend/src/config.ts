/**
 * Configuración leída de variables de entorno de Vite (ver .env.example).
 * Las variables deben empezar por VITE_ para estar disponibles en el navegador.
 */
const API_URL_POR_DEFECTO = 'https://hostalsanrosa-production.up.railway.app/api';

export const API_BASE_URL: string = (import.meta.env.VITE_API_URL || API_URL_POR_DEFECTO).replace(/\/+$/, '');

/** Rutas de la aplicación, para no repetir strings en los componentes. */
export const RUTAS = {
  inicio: '/',
  habitaciones: '/habitaciones',
  turismo: '/turismo',
  sitioTuristico: (slug: string) => `/turismo/${slug}`,
  preReserva: '/pagformulario',
} as const;
