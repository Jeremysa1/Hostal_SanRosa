import { HiOutlineLightBulb } from 'react-icons/hi2';
import { IoAlarmOutline, IoCameraOutline, IoLocationOutline } from 'react-icons/io5';
import { MdOutlineAttachMoney } from 'react-icons/md';
import {
  PiBeerBottleLight,
  PiBookOpenLight,
  PiChurchLight,
  PiCoffeeLight,
  PiDressLight,
  PiHandsPrayingLight,
} from 'react-icons/pi';
import type { SitioTuristico } from '../types';

/**
 * Sitios turísticos. Antes cada sitio tenía 4 archivos casi idénticos
 * (página, encabezado, franja de iconos y mapa); ahora basta con añadir
 * una entrada aquí para crear un sitio nuevo.
 */
export const sitiosTuristicos: SitioTuristico[] = [
  {
    slug: 'termales-santa-rosa',
    tarjeta: {
      imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1760480433/Sin_t%C3%ADtulo-1_rbtyg7.jpg',
      titulo: 'Termales Santa Rosa de Cabal',
      descripcion:
        'Los Termales de Santa Rosa de Cabal son el lugar perfecto para relajarse y disfrutar de la naturaleza, con aguas calientes rodeadas de montañas y cascadas en pleno corazón del Eje Cafetero.',
    },
    encabezado: {
      imagenEscritorio:
        'https://res.cloudinary.com/dfznn7pui/image/upload/v1761353648/Termales_Santa_Rosa_de_Cabal_e3qiaf_viqdrk.jpg',
      imagenMovil: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1761268360/Termales_Santa_Rosa_de_Cabal_e3qiaf.jpg',
      alt: 'Termales Santa Rosa',
      titulo: 'TERMALES',
      subtitulo: 'Santa Rosa de Cabal',
      texto:
        'Uno de los lugares más reconocidos del Eje Cafetero, ideales para disfrutar de un descanso total en medio de la naturaleza. Sus aguas termales brotan de la montaña y forman cascadas que crean un paisaje único y relajante. El sonido del agua y el aire fresco de las montañas hacen de este sitio un refugio perfecto para desconectarse del ritmo diario. Además, cuenta con zonas de spa, hotel y senderos ecológicos que completan una experiencia inolvidable.',
    },
    recomendaciones: [
      { icono: IoLocationOutline, titulo: 'Ubicación', texto: 'A 15 minutos en carro desde Turquesa Hostel.' },
      { icono: IoCameraOutline, titulo: 'Actividades', texto: 'Baños termales, caminatas cortas, fotografía.' },
      { icono: HiOutlineLightBulb, titulo: 'Tips', texto: 'Lleva traje de baño, sandalias y una muda extra de ropa.' },
    ],
    mapa: { coordenadas: [4.83925, -75.54924], etiqueta: 'Termales Santa Rosa de Cabal' },
  },
  {
    slug: 'termales-san-vicente',
    tarjeta: {
      imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1760907449/san-vicente_wlgeqh.jpg',
      titulo: 'Termales de San Vicente',
      descripcion:
        'Los Termales de San Vicente son un refugio natural en medio del bosque andino, donde las aguas termales y cascadas crean un ambiente ideal para desconectarse y renovar energía.',
    },
    encabezado: {
      imagenEscritorio: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1763076649/san-vicente_ntfc7q.jpg',
      imagenMovil: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1763076649/san-vicente_ntfc7q.jpg',
      alt: 'Termales San Vicente',
      titulo: 'TERMALES',
      subtitulo: 'San Vicente',
      texto:
        'Ofrecen una experiencia más natural y tranquila, alejados del ruido y rodeados por la densa vegetación del bosque andino. Este lugar es ideal para quienes buscan una conexión más profunda con la naturaleza y el silencio. Sus pozos termales y cascadas cristalinas invitan al descanso y la meditación. También se pueden recorrer senderos ecológicos, observar aves y disfrutar de baños de barro volcánico con propiedades terapéuticas. Es un destino perfecto para el ecoturismo y el bienestar.',
    },
    recomendaciones: [
      {
        icono: IoAlarmOutline,
        titulo: 'Reserva previa',
        texto: 'Confirma cupo y transporte antes de ir, especialmente en temporada alta.',
      },
      { icono: PiDressLight, titulo: 'Ropa cómoda', texto: 'Lleva traje de baño, toalla, y calzado de fácil secado.' },
      {
        icono: PiBeerBottleLight,
        titulo: 'Hidratación',
        texto: 'Bebe agua con frecuencia por el calor y los efectos de las aguas termales.',
      },
    ],
    mapa: { coordenadas: [4.84932, -75.53313], etiqueta: 'Termales San Vicente' },
  },
  {
    slug: 'parque-araucarias',
    tarjeta: {
      imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1760907729/parque-de-las-araucarias_dh6jhj.jpg',
      titulo: 'Parque de las Araucarias',
      descripcion:
        'El Parque de las Araucarias es el punto de encuentro más emblemático de Santa Rosa, rodeado de árboles imponentes y arquitectura colonial que reflejan la esencia tradicional del pueblo.',
    },
    encabezado: {
      imagenEscritorio:
        'https://res.cloudinary.com/dfznn7pui/image/upload/v1763079953/santa-rosa-de-cabal-araucarias_1_krnsfh.png',
      imagenMovil:
        'https://res.cloudinary.com/dfznn7pui/image/upload/v1763079953/santa-rosa-de-cabal-araucarias_1_krnsfh.png',
      alt: 'Parque de las Araucarias',
      titulo: 'PARQUE',
      subtitulo: 'de las Araucarias',
      texto:
        'El Parque de las Araucarias es el corazón de Santa Rosa de Cabal y punto de encuentro de locales y visitantes. Rodeado de majestuosos árboles de araucaria, ofrece un espacio ideal para descansar, compartir y admirar la arquitectura que lo rodea. En sus alrededores se encuentran cafeterías, tiendas artesanales y la Basílica Menor de Nuestra Señora de las Victorias. Es un lugar que refleja la calidez de su gente y el encanto tradicional del pueblo. Un sitio imprescindible para disfrutar el ambiente santarrosano.',
    },
    recomendaciones: [
      {
        icono: IoAlarmOutline,
        titulo: 'Recorrido',
        texto: 'Dedica al menos una hora para caminar tranquilo y disfrutar del ambiente.',
      },
      { icono: IoCameraOutline, titulo: 'Fotografía', texto: 'Aprovecha la majestuosidad de las araucarias para fotos únicas.' },
      {
        icono: MdOutlineAttachMoney,
        titulo: 'Artesanías',
        texto: 'Revisa los puestos cercanos para encontrar productos locales y suvenires.',
      },
    ],
    mapa: { coordenadas: [4.86512, -75.62077], etiqueta: 'Parque de las Araucarias' },
  },
  {
    slug: 'iglesia-milagrosa',
    tarjeta: {
      imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1760908104/iglesia-milagrosa_umrlse.jpg',
      titulo: 'Iglesia de la Milagrosa',
      descripcion:
        'La Iglesia de la Milagrosa es un símbolo de fe y devoción para los habitantes de Santa Rosa. Con su diseño sencillo y acogedor, invita a la reflexión y a conocer más sobre la historia religiosa del municipio.',
    },
    encabezado: {
      imagenEscritorio: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1763080060/iglesia_milagrosa_jgtoxi.png',
      imagenMovil: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1763080060/iglesia_milagrosa_jgtoxi.png',
      alt: 'Iglesia de la Milagrosa',
      titulo: 'IGLESIA',
      subtitulo: 'de la Milagrosa',
      texto:
        'Es un espacio lleno de fe, historia y serenidad. Su diseño sencillo, pero simbólico, la convierte en un sitio especial para la reflexión y la oración. Ubicada en un sector tranquilo del municipio, es visitada tanto por habitantes locales como por turistas que buscan conocer más sobre la espiritualidad del pueblo. Su interior conserva un ambiente acogedor que invita a la paz y al recogimiento. Representa una parte importante del patrimonio religioso de Santa Rosa de Cabal.',
    },
    recomendaciones: [
      {
        icono: IoAlarmOutline,
        titulo: 'Horario de Misas',
        texto: 'Verifica los horarios si planeas asistir a una ceremonia.',
      },
      {
        icono: PiHandsPrayingLight,
        titulo: 'Respeto',
        texto: 'Mantén el silencio y la vestimenta adecuada por ser un lugar de culto.',
      },
      { icono: PiChurchLight, titulo: 'Detalles', texto: 'Fíjate en la arquitectura neogótica y sus vitrales históricos.' },
    ],
    // Antes la etiqueta del mapa decía por error "Termales Santa Rosa de Cabal".
    mapa: { coordenadas: [4.86061, -75.61934], etiqueta: 'Iglesia de la Milagrosa' },
  },
  {
    slug: 'parque-machete',
    tarjeta: {
      imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1760908339/parque-machete_los6gd.jpg',
      titulo: 'Parque del Machete',
      descripcion:
        'El Parque del Machete rinde homenaje al trabajador santarrosano y su espíritu cafetero. Es un espacio lleno de vida y tradición, perfecto para conocer la cultura local y disfrutar de la gastronomía típica de la región.',
    },
    encabezado: {
      imagenEscritorio: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1763076989/machete_2_w5qonz.webp',
      imagenMovil: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1763076989/machete_2_w5qonz.webp',
      alt: 'Parque del Machete',
      titulo: 'PARQUE',
      subtitulo: 'del Machete',
      texto:
        'Es un homenaje al espíritu trabajador de los santarrosanos y a la cultura cafetera que caracteriza la región. Su nombre hace referencia a una de las herramientas más emblemáticas del campo colombiano. Este lugar combina arte, tradición y orgullo local, con esculturas y murales que representan la vida rural. Además, es un punto ideal para disfrutar de la gastronomía típica y conocer más sobre la historia del municipio. Un espacio lleno de identidad y cultura popular.',
    },
    recomendaciones: [
      {
        icono: IoLocationOutline,
        titulo: 'Punto de encuentro',
        texto: 'Es un lugar ideal para reunirse antes de explorar el resto del pueblo.',
      },
      {
        icono: PiBookOpenLight,
        titulo: 'Aprende su historia',
        texto: 'Investiga el significado del machete en la cultura cafetera y su monumento.',
      },
      {
        icono: PiCoffeeLight,
        titulo: 'Cafecito',
        texto: 'Aprovecha la cercanía a cafeterías tradicionales para probar el café de la zona.',
      },
    ],
    // Antes la etiqueta del mapa decía por error "Termales Santa Rosa de Cabal".
    mapa: { coordenadas: [4.86508, -75.62264], etiqueta: 'Parque del Machete' },
  },
];

export function buscarSitioTuristico(slug: string | undefined): SitioTuristico | undefined {
  return sitiosTuristicos.find((sitio) => sitio.slug === slug);
}
