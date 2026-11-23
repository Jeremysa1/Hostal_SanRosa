import type { IconType } from 'react-icons';

/** Coordenadas [latitud, longitud] para Leaflet. */
export type Coordenadas = [number, number];

/** Elemento de una franja de iconos (icono + título + texto). */
export interface ItemIcono {
  icono: IconType;
  titulo: string;
  texto: string;
}

/** Claves de tipo de habitación (coinciden con `Habitacion.Tipo` del backend). */
export type TipoHabitacion =
  | 'doble'
  | 'doble_sencilla'
  | 'triple'
  | 'familiar'
  | 'familiar_grande'
  | 'suite';

export interface Cama {
  type: string;
  count: number;
}

export interface Habitacion {
  id: TipoHabitacion;
  imageUrl: string;
  detailImageUrl: string;
  title: string;
  subtitle: string;
  description: string;
  rating: number;
  services: string[];
  price: number;
  capacity: number;
  bedDetails: Cama[];
}

export interface SitioTuristico {
  slug: string;
  /** Datos de la tarjeta en /turismo */
  tarjeta: {
    imagen: string;
    titulo: string;
    descripcion: string;
  };
  /** Encabezado de la página de detalle */
  encabezado: {
    imagenEscritorio: string;
    imagenMovil: string;
    alt: string;
    titulo: string;
    subtitulo: string;
    texto: string;
  };
  recomendaciones: ItemIcono[];
  mapa: {
    coordenadas: Coordenadas;
    etiqueta: string;
  };
}
