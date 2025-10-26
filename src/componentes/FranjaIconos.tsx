
import React from 'react';
import { LiaToiletSolid } from "react-icons/lia";
import { PiCouch } from "react-icons/pi";
import { FaBed } from 'react-icons/fa';
import { TbToolsKitchen2 } from "react-icons/tb";
import './FranjaIconos.css';

const FranjaIconos: React.FC = () => {
  return (
    <div className="franja-iconos-container">
      <div className="carrusel-header">
            <div className="carrusel-title-button">
              <FaBed />
              <span>HABITACIONES</span>
            </div>
          </div>
      <div className="main-title">
        <h2>COMPARTE, DESCANSA Y DISFRUTA</h2>
        <h3>en nuestros espacios comunes</h3>
      </div>
      <div className="iconos-wrapper">
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

export default FranjaIconos;
