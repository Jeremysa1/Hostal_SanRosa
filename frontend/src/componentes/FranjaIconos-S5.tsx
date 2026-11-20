
import React from 'react';
import { IoLocationOutline,} from 'react-icons/io5';
import './FranjaIconos.css';
import { PiCoffeeLight } from "react-icons/pi";
import { PiBookOpenLight } from "react-icons/pi";


const FranjaIconos5: React.FC = () => {
  return (
    
    <div className="franja-iconos-container">
      <div className="icono-item">
        <IoLocationOutline className="icono" />
        <h4>Punto de encuentro</h4>
        <p className='i1'>Es un lugar ideal para reunirse antes de explorar el resto del pueblo.</p>
      </div>
      <div className="icono-item">
        <PiBookOpenLight className="icono" />
        <h4>Aprende su historia</h4>
        <p className='i1'>Investiga el significado del machete en la cultura cafetera y su monumento.</p>
      </div>
      <div className="icono-item">
        <PiCoffeeLight className="icono" />
        <h4>Cafecito</h4>
        <p className='i1'>Aprovecha la cercanía a cafeterías tradicionales para probar el café de la zona.</p>
      </div>
    </div>
  );
};

export default FranjaIconos5;
