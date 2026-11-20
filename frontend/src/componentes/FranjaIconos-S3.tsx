
import React from 'react';
import { IoCameraOutline, } from 'react-icons/io5';
import './FranjaIconos.css';
import { IoAlarmOutline } from "react-icons/io5";
import { MdOutlineAttachMoney } from "react-icons/md";


const FranjaIconos3: React.FC = () => {
  return (
    
    <div className="franja-iconos-container">
      <div className="icono-item">
        <IoAlarmOutline className="icono" />
        <h4>Recorrido</h4>
        <p className='i1'>Dedica al menos una hora para caminar tranquilo y disfrutar del ambiente.</p>
      </div>
      <div className="icono-item">
        <IoCameraOutline className="icono" />
        <h4>Fotografía</h4>
        <p className='i1'>Aprovecha la majestuosidad de las araucarias para fotos únicas.</p>
      </div>
      <div className="icono-item">
        <MdOutlineAttachMoney className="icono" />
        <h4>Artesanías</h4>
        <p className='i1'>Revisa los puestos cercanos para encontrar productos locales y suvenires.</p>
      </div>
    </div>
  );
};

export default FranjaIconos3;
