import { BsHouseHeart } from 'react-icons/bs';
import { GoSmiley } from 'react-icons/go';
import { LiaToiletSolid } from 'react-icons/lia';
import { PiCouch, PiPlantLight } from 'react-icons/pi';
import { TbToolsKitchen2 } from 'react-icons/tb';
import type { Coordenadas, ItemIcono } from '../types';

export const NOMBRE_HOSTAL = 'Turquesa Hostal';

export const UBICACION_HOSTAL: { coordenadas: Coordenadas; etiqueta: string } = {
  coordenadas: [4.86652, -75.62385],
  etiqueta: 'Ubicación de tu Hostal.',
};

export const REDES_SOCIALES = {
  instagram: 'https://www.instagram.com',
  whatsapp: 'https://www.whatsapp.com',
  facebook: 'https://www.facebook.com',
};

export const COPYRIGHT = '© 2025 Turquesa hostal';

/** Características destacadas (página de inicio). */
export const caracteristicasDestacadas: ItemIcono[] = [
  { icono: GoSmiley, titulo: 'Ambiente sano', texto: 'Un espacio libre de humo y excesos, ideal para descansar.' },
  { icono: BsHouseHeart, titulo: 'Hogar familiar', texto: 'La calidez de sentirse como en casa, en un entorno acogedor.' },
  { icono: PiPlantLight, titulo: 'Entorno ecológico', texto: 'Un lugar limpio y consciente para disfrutar con tranquilidad.' },
];

/** Espacios comunes (página de habitaciones). */
export const espaciosComunes: ItemIcono[] = [
  { icono: TbToolsKitchen2, titulo: 'Cocina compartida', texto: 'Equipada para que prepares tus comidas.' },
  { icono: PiCouch, titulo: 'Sala común', texto: 'Un espacio para descansar y compartir.' },
  { icono: LiaToiletSolid, titulo: 'Baños compartidos', texto: 'Cómodos y limpios para todos los huéspedes.' },
];

/** Diapositivas del carrusel principal. */
export const diapositivasInicio = [
  {
    image: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762430748/corredor_ycog6j.jpg',
    title: 'TURQUESA HOSTAL',
    subtitle: 'UN ESPACIO FAMILIAR, ideal para quienes buscan comodidad y descanso en Santa Rosa de Cabal.',
  },
  {
    image: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762430763/habitacion_2_m1j14z.jpg',
    title: 'DISFRUTA EN FAMILIA',
    subtitle: 'Tranquilidad y comodidad para todos, el lugar perfecto para crear recuerdos juntos.',
  },
];
