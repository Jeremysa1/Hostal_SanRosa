
import React from 'react';
import './FranjaIconos.css';
import { IoAlarmOutline } from "react-icons/io5";
import { PiDressLight } from "react-icons/pi";
import { PiBeerBottleLight } from "react-icons/pi";


const FranjaIconos2: React.FC = () => {
  return (
    
    <div className="franja-iconos-container">
      <div className="icono-item">
        <IoAlarmOutline className="icono" />
        <h4>Reserva previa</h4>
        <p className='i1'>Confirma cupo y transporte antes de ir, especialmente en temporada alta.</p>
      </div>
      <div className="icono-item">
        <PiDressLight  className="icono" />
        <h4>Ropa cómoda</h4>
        <p className='i1'>Lleva traje de baño, toalla, y calzado de fácil secado.</p>
      </div>
      <div className="icono-item">
        <PiBeerBottleLight  className="icono" />
        <h4>Hidratación</h4>
        <p className='i1'>Bebe agua con frecuencia por el calor y los efectos de las aguas termales.</p>
      </div>
    </div>
  );
};

export default FranjaIconos2;
