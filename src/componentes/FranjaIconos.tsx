
import React from 'react';
import { FaLeaf, FaUsers, FaSmileBeam } from 'react-icons/fa';
import './FranjaIconos.css';

const FranjaIconos: React.FC = () => {
  return (
    <div className="franja-iconos-container">
      <div className="icono-item">
        <FaSmileBeam className="icono" />
        <h4>Ambiente sano</h4>
        <p>Un espacio libre de humo y excesos, ideal para descansar.</p>
      </div>
      <div className="icono-item">
        <FaUsers className="icono" />
        <h4>Hogar familiar</h4>
        <p>La calidez de sentirse como en casa, en un entorno acogedor.</p>
      </div>
      <div className="icono-item">
        <FaLeaf className="icono" />
        <h4>Entorno ecológico</h4>
        <p>Un lugar limpio y consciente para disfrutar con tranquilidad.</p>
      </div>
    </div>
  );
};

export default FranjaIconos;
