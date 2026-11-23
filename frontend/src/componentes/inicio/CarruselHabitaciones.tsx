import { useState, type CSSProperties, type MouseEventHandler } from 'react';
import { FaBed, FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Slider, { type Settings } from 'react-slick';
import './CarruselHabitaciones.css';
import { RUTAS } from '../../config';
import { buscarHabitacion, carruselHabitaciones } from '../../data/habitaciones';
import type { Habitacion } from '../../types';
import { DetalleHabitacion } from '../habitaciones/DetalleHabitacion';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface FlechaProps {
  className?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
  direccion: 'anterior' | 'siguiente';
}

/** Flecha personalizada; react-slick inyecta className, style y onClick. */
function Flecha({ className, style, onClick, direccion }: FlechaProps) {
  return (
    <div className={className} style={style} onClick={onClick}>
      {direccion === 'anterior' ? <FaChevronLeft /> : <FaChevronRight />}
    </div>
  );
}

const CONFIG_SLIDER: Settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  prevArrow: <Flecha direccion="anterior" />,
  nextArrow: <Flecha direccion="siguiente" />,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

const COLOR_ESTRELLA_LLENA = '#ffc107';
const COLOR_ESTRELLA_VACIA = '#e4e5e9';

function Estrellas({ rating }: { rating: number }) {
  return (
    <div className="habitacion-rating">
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar key={i} color={i < Math.floor(rating) ? COLOR_ESTRELLA_LLENA : COLOR_ESTRELLA_VACIA} />
      ))}
      <span>{rating.toFixed(1)}</span>
    </div>
  );
}

function CarruselHabitaciones() {
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<Habitacion | null>(null);

  return (
    <div className="carrusel-habitaciones-container">
      <div className="carrusel-header">
        <div className="carrusel-title-button">
          <FaBed />
          <span>HABITACIONES</span>
        </div>
      </div>

      <Slider {...CONFIG_SLIDER}>
        {carruselHabitaciones.map((item, indice) => (
          <div key={indice} className="habitacion-card">
            <img src={item.imagen} alt={item.titulo} />
            <div className="habitacion-info">
              <Estrellas rating={item.rating} />
              <h3>{item.titulo}</h3>
              <button
                className="reservar-button"
                onClick={() => setHabitacionSeleccionada(buscarHabitacion(item.habitacionId) ?? null)}
              >
                Reservar
              </button>
            </div>
          </div>
        ))}
      </Slider>

      {habitacionSeleccionada && (
        <DetalleHabitacion
          habitacion={habitacionSeleccionada}
          visible
          onHide={() => setHabitacionSeleccionada(null)}
        />
      )}

      <div className="ver-mas-container">
        <Link to={RUTAS.habitaciones}>
          <button className="ver-mas-button">Ver más habitaciones</button>
        </Link>
      </div>
    </div>
  );
}

export default CarruselHabitaciones;
