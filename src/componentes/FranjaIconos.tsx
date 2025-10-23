
import React from 'react';
import { FaBed, FaUtensils, FaCouch, FaRestroom } from 'react-icons/fa';
import './FranjaIconos.css';

const FranjaIconos: React.FC = () => {
  return (
    <div className="franja-iconos-container">
      <div className="habitaciones-button">
        <FaBed className="habitaciones-icon" />
        <span>HABITACIONES</span>
      </div>
      <h2 className="titulo-principal">COMPARTE, DESCANSA Y DISFRUTA</h2>
      <h3 className="subtitulo">en nuestros espacios comunes</h3>
      <div className="iconos-wrapper">
        <div className="icono-item">
          <FaUtensils className="icono" />
          <h4>Cocina compartida</h4>
          <p>Equipada para que prepares tus comidas.</p>
        </div>
        <div className="icono-item">
          <FaCouch className="icono" />
          <h4>Sala común</h4>
          <p>Un espacio para descansar y compartir.</p>
        </div>
        <div className="icono-item">
          <FaRestroom className="icono" />
          <h4>Baños compartidos</h4>
          <p>Cómodos y limpios para todos los huéspedes.</p>
        </div>
      </div>
    </div>
  );
};

export default FranjaIconos;
