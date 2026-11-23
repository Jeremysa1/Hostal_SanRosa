import { FaBed } from 'react-icons/fa';
import { espaciosComunes } from '../../data/hostal';
import { IconoItem } from '../comunes/FranjaIconos';
import './EspaciosComunes.css';

/** Encabezado de /habitaciones con los espacios comunes del hostal. */
function EspaciosComunes() {
  return (
    <div className="franja-iconos-container-hab">
      <div className="caja-titulo">
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
        {espaciosComunes.map((item) => (
          <IconoItem key={item.titulo} {...item} />
        ))}
      </div>
    </div>
  );
}

export default EspaciosComunes;
