import type { Habitacion, TipoHabitacion } from '../types';

/** Catálogo de habitaciones que se muestra en /habitaciones y en el detalle. */
export const habitaciones: Habitacion[] = [
  {
    id: 'familiar_grande',
    imageUrl: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762631165/Habitacion-9-personas_zyeepv.png',
    detailImageUrl: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762963798/Horizontal-3_htiwjj.jpg',
    title: 'Habitación',
    subtitle: 'FAMILIAR GRANDE',
    description: 'Perfecta para familias o grupos pequeños.',
    rating: 3,
    services: ['Wi-Fi', 'Agua caliente', 'Sofá cama', 'Closet'],
    price: 40000,
    capacity: 9,
    bedDetails: [
      { type: 'cama doble', count: 3 },
      { type: 'cama individual', count: 2 },
      { type: 'sofá cama', count: 1 },
    ],
  },
  {
    id: 'doble',
    imageUrl: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762635431/habitacion_naranja_ome2oc.png',
    detailImageUrl: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762963799/Horizontal-1_gsyjws.jpg',
    title: 'Habitación',
    subtitle: 'DOBLE',
    description: 'Diseñada para parejas o viajeros que buscan comodidad.',
    rating: 4,
    services: ['Wi-Fi', 'Agua caliente', 'Televisión', 'Mesa de trabajo'],
    price: 45000,
    capacity: 2,
    bedDetails: [{ type: 'cama doble', count: 1 }],
  },
  {
    id: 'familiar',
    imageUrl: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762629773/Habitacion-1_ibttii.png',
    detailImageUrl: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762963807/Horizontal-5_ijhe3g.jpg',
    title: 'Habitación',
    subtitle: 'FAMILIAR',
    description: 'Amplia y cómoda, ideal para grupos grandes.',
    rating: 4,
    services: ['Wi-Fi', 'Agua caliente'],
    price: 35000,
    capacity: 5,
    bedDetails: [
      { type: 'cama doble', count: 1 },
      { type: 'cama individual', count: 3 },
    ],
  },
  {
    id: 'triple',
    imageUrl: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762629773/Habitacion-4_afjrlh.png',
    detailImageUrl: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762963799/Horizontal-4_nviwtz.jpg',
    title: 'Habitación',
    subtitle: 'TRIPLE',
    description: 'Espacio funcional y tranquilo, ideal para amigos o familias pequeñas.',
    rating: 3,
    services: ['Wi-Fi', 'Agua caliente', 'Repisa', 'espejo'],
    price: 40000,
    capacity: 3,
    bedDetails: [
      { type: 'cama doble', count: 1 },
      { type: 'cama individual', count: 1 },
    ],
  },
  {
    id: 'doble_sencilla',
    imageUrl: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762629773/Habitacion-5_ibm1pp.png',
    detailImageUrl: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762963799/Horizontal-2_u5j15p.jpg',
    title: 'Habitación',
    subtitle: 'DOBLE SENCILLA',
    description: 'Acogedora y práctica, perfecta para descansar después de un día de viaje.',
    rating: 4,
    services: ['Wi-Fi', 'Agua caliente', 'Repisa'],
    price: 45000,
    capacity: 2,
    bedDetails: [{ type: 'cama doble', count: 1 }],
  },
  {
    id: 'suite',
    imageUrl: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762629775/Habitacion-6_ommdkh.png',
    detailImageUrl: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762963807/Horizontal-6_hwhhn8.jpg',
    title: 'Habitación',
    subtitle: 'SUITE',
    description: 'Nuestra habitación más completa, ideal para quienes buscan mayor confort.',
    rating: 5,
    services: ['Wi-Fi', 'Sofá cama', 'Baño privado', 'Televisión'],
    price: 65000,
    capacity: 3,
    bedDetails: [
      { type: 'cama doble', count: 1 },
      { type: 'sofá cama', count: 1 },
    ],
  },
];

export function buscarHabitacion(id: TipoHabitacion): Habitacion | undefined {
  return habitaciones.find((habitacion) => habitacion.id === id);
}

/** Opciones del selector del formulario de pre-reserva (en el orden original). */
export const opcionesHabitacion: { id: TipoHabitacion; etiqueta: string }[] = [
  { id: 'doble', etiqueta: 'Doble' },
  { id: 'doble_sencilla', etiqueta: 'Doble Sencilla' },
  { id: 'familiar', etiqueta: 'Familiar' },
  { id: 'familiar_grande', etiqueta: 'Familiar Grande' },
  { id: 'suite', etiqueta: 'Suite' },
  { id: 'triple', etiqueta: 'Triple' },
];

/** Tarjetas del carrusel de la página de inicio; cada una abre el detalle de `habitacionId`. */
export const carruselHabitaciones: {
  imagen: string;
  titulo: string;
  rating: number;
  habitacionId: TipoHabitacion;
}[] = [
  {
    imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762430763/habitacion_2_m1j14z.jpg',
    titulo: 'Habitación DOBLE',
    rating: 4.0,
    habitacionId: 'doble',
  },
  {
    imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762430778/habitacion_6_kdylco.jpg',
    titulo: 'Habitación TRIPLE',
    rating: 4.5,
    habitacionId: 'triple',
  },
  {
    imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762430793/habitacion_1_rbtxef.jpg',
    titulo: 'Habitación FAMILIAR',
    rating: 5.0,
    habitacionId: 'familiar',
  },
  {
    imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762430797/habitacion_4_yciotd.jpg',
    titulo: 'Habitación FAMILIAR',
    rating: 4.8,
    habitacionId: 'familiar',
  },
  {
    imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762431492/habitacion_3_o5c5on.jpg',
    titulo: 'Habitación SUITE',
    rating: 5.0,
    habitacionId: 'suite',
  },
  {
    imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762430787/habitacion_5_njubuv.jpg',
    titulo: 'Habitación DOBLE',
    rating: 4.2,
    habitacionId: 'doble',
  },
];
