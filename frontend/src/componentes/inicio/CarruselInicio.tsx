import { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { RUTAS } from '../../config';
import { diapositivasInicio as slides } from '../../data/hostal';
import './CarruselInicio.css';

function CarruselInicio() {
  const [indiceActual, setIndiceActual] = useState(0);
  const slide = slides[indiceActual];

  const irA = (indice: number) => setIndiceActual((indice + slides.length) % slides.length);

  return (
    <div className="carrusel-container">
      <div className="carrusel-slide" style={{ backgroundImage: `url(${slide.image})` }}>
        <div className="overlay"></div>
        <div className="slide-content">
          <h1 className="slide-title">{slide.title}</h1>
          <p className="slide-subtitle">{slide.subtitle}</p>
          <Link to={RUTAS.preReserva}>
            <button className="reserva-button">Reserva ya</button>
          </Link>
        </div>
      </div>
      <button onClick={() => irA(indiceActual - 1)} className="carrusel-button prev-button" aria-label="Anterior">
        <IoIosArrowBack />
      </button>
      <button onClick={() => irA(indiceActual + 1)} className="carrusel-button next-button" aria-label="Siguiente">
        <IoIosArrowForward />
      </button>
      <div className="dots-container">
        {slides.map((_, indice) => (
          <div
            key={indice}
            className={`dot ${indice === indiceActual ? 'active' : ''}`}
            onClick={() => irA(indice)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default CarruselInicio;
