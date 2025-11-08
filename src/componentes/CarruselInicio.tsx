import React, { useState } from 'react';
import './CarruselInicio.css';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'TURQUESA HOSTAL',
    subtitle: 'UN ESPACIO ECOLÓGICO Y FAMILIAR, ideal para quienes buscan comodidad y descanso en Santa Rosa de Cabal',
  },
  {
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'HOSTAL DEL RÍO',
    subtitle: 'Disfruta de la naturaleza y la tranquilidad a orillas del río. Un lugar para desconectar y recargar energías.',
  },
  {
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'CASA DE CAMPO',
    subtitle: 'Vive una experiencia auténtica en un entorno rural. Comodidad y tradición en un solo lugar.',
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
