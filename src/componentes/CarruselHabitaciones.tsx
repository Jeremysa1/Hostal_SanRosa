
// Importaciones necesarias de React y otras bibliotecas
import React from 'react';
import Slider from 'react-slick'; // Componente principal para el carrusel
import { FaChevronLeft, FaChevronRight, FaStar, FaBed } from 'react-icons/fa'; // Iconos para la interfaz
import './CarruselHabitaciones.css'; // Estilos específicos para este componente

// Importación de los estilos base para react-slick, necesarios para que el carrusel funcione correctamente
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Definición de la interfaz para las props de las flechas personalizadas
interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

// Array de objetos que contiene la información de cada habitación.
const habitaciones = [
  {
    imagen: 'https://image-tc.galaxy.tf/wijpeg-5srw8mjtza6abfwrpha1r5lmg/habitacion-special-double_standard.jpg?crop=107%2C0%2C1707%2C1280',
    titulo: 'Habitación DOBLE',
    rating: 4.0,
  },
  {
    imagen: 'https://image-tc.galaxy.tf/wijpeg-5srw8mjtza6abfwrpha1r5lmg/habitacion-special-double_standard.jpg?crop=107%2C0%2C1707%2C1280',
    titulo: 'Habitación TRIPLE',
    rating: 4.5,
  },
  {
    imagen: 'https://image-tc.galaxy.tf/wijpeg-5srw8mjtza6abfwrpha1r5lmg/habitacion-special-double_standard.jpg?crop=107%2C0%2C1707%2C1280',
    titulo: 'Habitación PARA 5',
    rating: 5.0,
  },
  {
    imagen: 'https://image-tc.galaxy.tf/wijpeg-5srw8mjtza6abfwrpha1r5lmg/habitacion-special-double_standard.jpg?crop=107%2C0%2C1707%2C1280',
    titulo: 'Habitación FAMILIAR',
    rating: 4.8,
  },
  {
    imagen: 'https://image-tc.galaxy.tf/wijpeg-5srw8mjtza6abfwrpha1r5lmg/habitacion-special-double_standard.jpg?crop=107%2C0%2C1707%2C1280',
    titulo: 'SUITE DE LUJO',
    rating: 5.0,
  },
  {
    imagen: 'https://image-tc.galaxy.tf/wijpeg-5srw8mjtza6abfwrpha1r5lmg/habitacion-special-double_standard.jpg?crop=107%2C0%2C1707%2C1280',
    titulo: 'Habitación INDIVIDUAL',
    rating: 4.2,
  },
];

// Componente personalizado para la flecha de navegación "Anterior" del carrusel.
const PrevArrow = (props: ArrowProps) => {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style }} onClick={onClick}>
      <FaChevronLeft />
    </div>
  );
};

// Componente personalizado para la flecha de navegación "Siguiente" del carrusel.
const NextArrow = (props: ArrowProps) => {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style }} onClick={onClick}>
      <FaChevronRight />
    </div>
  );
};

// Componente principal del carrusel de habitaciones.
const CarruselHabitaciones: React.FC = () => {
  // Configuración del carrusel (react-slick).
  const settings = {
    dots: false, // No mostrar los puntos de navegación.
    infinite: true, // Hacer el carrusel infinito.
    speed: 500, // Velocidad de la transición en milisegundos.
    slidesToShow: 3, // Número de tarjetas a mostrar a la vez en escritorio.
    slidesToScroll: 1, // Número de tarjetas a desplazar al hacer clic en las flechas.
    prevArrow: <PrevArrow />, // Usar el componente personalizado para la flecha anterior.
    nextArrow: <NextArrow />, // Usar el componente personalizado para la flecha siguiente.
    responsive: [ // **ESTA ES LA PARTE QUE FALTABA**
      {
        breakpoint: 1024, // Para pantallas de 1024px o menos...
        settings: {
          slidesToShow: 2, // ...mostrar 2 tarjetas.
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768, // Para pantallas de 768px o menos...
        settings: {
          slidesToShow: 1, // ...mostrar 1 sola tarjeta.
          slidesToScroll: 1,
        }
      }
    ]
  };

  // Renderizado del componente.
  return (
    <div className="carrusel-habitaciones-container">
      {/* Encabezado del carrusel */}
      <div className="carrusel-header">
        <div className="carrusel-title-button">
          <FaBed />
          <span>HABITACIONES</span>
        </div>
      </div>

      {/* Componente Slider de react-slick con la configuración definida */}
      <Slider {...settings}>
        {/* Mapeo del array de habitaciones para renderizar cada tarjeta */}
        {habitaciones.map((habitacion, index) => (
          <div key={index} className="habitacion-card">
            <img src={habitacion.imagen} alt={habitacion.titulo} />
            <div className="habitacion-info">
              {/* Sección para mostrar la calificación con estrellas */}
              <div className="habitacion-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color={i < Math.floor(habitacion.rating) ? '#ffc107' : '#e4e5e9'} />
                ))}
                <span>{habitacion.rating.toFixed(1)}</span>
              </div>
              <h3>{habitacion.titulo}</h3>
              <button className="reservar-button">Reservar</button>
            </div>
          </div>
        ))}
      </Slider>
      
      {/* Contenedor para el botón "Ver más habitaciones" */}
      <div className="ver-mas-container">
        <button className="ver-mas-button">Ver más habitaciones</button>
      </div>
    </div>
  );
};

// Exportar el componente para que pueda ser utilizado en otras partes de la aplicación.
export default CarruselHabitaciones;
