
import React from 'react';
import './FranjaIconos.css';
import { IoAlarmOutline } from "react-icons/io5";
import { PiHandsPrayingLight } from "react-icons/pi";
import { PiChurchLight } from "react-icons/pi";


const FranjaIconos4: React.FC = () => {
  return (
    
    <div className="franja-iconos-container">
      <div className="icono-item">
        <IoAlarmOutline className="icono" />
        <h4>Horario de Misas</h4>
        <p className='i1'>Verifica los horarios si planeas asistir a una ceremonia.</p>
      </div>
      <div className="icono-item">
        <PiHandsPrayingLight className="icono" />
        <h4>Respeto</h4>
        <p className='i1'>Mantén el silencio y la vestimenta adecuada por ser un lugar de culto.</p>
      </div>
      <div className="icono-item">
        <PiChurchLight className="icono" />
        <h4>Detalles</h4>
        <p className='i1'>Fíjate en la arquitectura neogótica y sus vitrales históricos.</p>
      </div>
    </div>
  );
};

export default FranjaIconos4;
