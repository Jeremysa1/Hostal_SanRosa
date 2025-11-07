
import React from 'react';
import { LiaToiletSolid } from "react-icons/lia";
import { PiCouch } from "react-icons/pi";
import { TbToolsKitchen2 } from "react-icons/tb";
import './FranjaIconos-Hab.css';
import { FaBed } from 'react-icons/fa';

const FranjaIconosHab: React.FC = () => {
  return (
    <div className="franja-iconos-container-hab">
      <div className='caja-titulo'>
        <div className="carrusel-title-button">
          <FaBed />
          <span>HABITACIONES</span>
        </div>
        <div className="main-title">
          <h2>COMPARTE, DESCANSA Y DISFRUTA</h2>
          <h3>en nuestros espacios comunes</h3>
        </div>
      </div>
      <div className="iconos-todos">
        <div className="icono-item">
          <TbToolsKitchen2 className="icono" />
          <h4>Cocina compartida</h4>
          <p>Equipada para que prepares tus comidas.</p>
        </div>
        <div className="icono-item">
          <PiCouch className="icono" />
          <h4>Sala común</h4>
          <p>Un espacio para descansar y compartir.</p>
        </div>
        <div className="icono-item">
          <LiaToiletSolid className="icono" />
          <h4>Baños compartidos</h4>
          <p>Cómodos y limpios para todos los huéspedes.</p>
        </div>
      </div>
    </div>
  );
};
export default FranjaIconosHab;
