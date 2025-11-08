import React, { useState } from 'react';
import './CarruselInicio.css';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';

const slides = [
  {
    image: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762430748/corredor_ycog6j.jpg',
    title: 'TURQUESA HOSTAL',
    subtitle: 'UN ESPACIO ECOLÓGICO Y FAMILIAR, ideal para quienes buscan comodidad y descanso en Santa Rosa de Cabal',
  },
  {
    image: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1762430763/habitacion_2_m1j14z.jpg',
    title: 'DISFRUTA EN FAMILIA',
    subtitle: 'Disfruta de la naturaleza y la tranquilidad a orillas del río. Un lugar para desconectar y recargar energías.',
  },
];

const CarruselInicio: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === slides.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="carrusel-container">
      <div className="carrusel-slide" style={{ backgroundImage: `url(${slides[currentIndex].image})` }}>
        <div className="overlay"></div>
        <div className="slide-content">
          <h1 className="slide-title">{slides[currentIndex].title}</h1>
          <p className="slide-subtitle">{slides[currentIndex].subtitle}</p>
          <Link to="/pagformulario">
            <button className="reserva-button">Reserva ya</button>
          </Link>
        </div>
      </div>
      <button onClick={goToPrevious} className="carrusel-button prev-button">
        <IoIosArrowBack />
      </button>
      <button onClick={goToNext} className="carrusel-button next-button">
        <IoIosArrowForward />
      </button>
      <div className='dots-container'>
        {slides.map((_, slideIndex) => (
          <div key={slideIndex} className={`dot ${slideIndex === currentIndex ? 'active' : ''}`} onClick={() => goToSlide(slideIndex)}></div>
        ))}
      </div>
    </div>
  );
};

export default CarruselInicio;
