
import React from 'react';
import { HiOutlineLightBulb } from 'react-icons/hi2';
import { IoLocationOutline, IoCameraOutline, } from 'react-icons/io5';
import './FranjaIconos.css';


const FranjaIconos: React.FC = () => {
  return (
    
    <div className="franja-iconos-container">
      <div className="icono-item">
        <IoLocationOutline className="icono" />
        <h4>Ubicación</h4>
        <p className='i1'>A 15 minutos en carro desde
        Turquesa Hostel.</p>
      </div>
      <div className="icono-item">
        <IoCameraOutline className="icono" />
        <h4>Actividades</h4>
        <p className='i1'>Baños termales, caminatas
        cortas, fotografía.</p>
      </div>
      <div className="icono-item">
        <HiOutlineLightBulb className="icono" />
        <h4>Tips</h4>
        <p className='i1'>Lleva traje de baño, sandalias
        y una muda extra de ropa.</p>
      </div>
    </div>
  );
};

export default FranjaIconos;
