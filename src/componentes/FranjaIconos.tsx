
import React from 'react';
import { PiPlantLight } from "react-icons/pi";
import { GoSmiley } from "react-icons/go";
import { BsHouseHeart } from "react-icons/bs";
import './FranjaIconos.css';

const FranjaIconos: React.FC = () => {
  return (
    <div className="franja-iconos-container">
      <div className="icono-item">
        <GoSmiley className="icono" />
        <h4>Ambiente sano</h4>
        <p>Un espacio libre de humo y excesos, ideal para descansar.</p>
      </div>
      <div className="icono-item">
        <BsHouseHeart className="icono" />
        <h4>Hogar familiar</h4>
        <p>La calidez de sentirse como en casa, en un entorno acogedor.</p>
      </div>
      <div className="icono-item">
        <PiPlantLight className="icono" />
        <h4>Entorno ecológico</h4>
        <p>Un lugar limpio y consciente para disfrutar con tranquilidad.</p>
      </div>
    </div>
  );
};

export default FranjaIconos;
