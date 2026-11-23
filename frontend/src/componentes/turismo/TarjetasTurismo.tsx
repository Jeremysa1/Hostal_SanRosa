import { FaLocationDot } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { RUTAS } from '../../config';
import { sitiosTuristicos } from '../../data/sitiosTuristicos';
import './TarjetasTurismo.css';

/** Listado de sitios turísticos en /turismo. */
function TarjetasTurismo() {
  const navigate = useNavigate();

  return (
    <div className="tarjetas-container">
      <div className="header">
        <div className="carrusel-title-button">
          <FaLocationDot className="icono-pin" />
          <span className="turismo">TURISMO</span>
        </div>
        <h1 className="title">EXPLORA LOS PAISAJES Y LOS ENCANTOS</h1>
        <h2 className="title2">de Santa Rosa de Cabal</h2>
      </div>
      <div className="tarjetas-list">
        {sitiosTuristicos.map(({ slug, tarjeta }) => (
          <div className="tarjeta" key={slug}>
            <img src={tarjeta.imagen} alt={tarjeta.titulo} className="tarjeta-imagen" />
            <div className="tarjeta-contenido">
              <div>
                <h2 className="tarjeta-titulo">{tarjeta.titulo}</h2>
                <p className="tarjeta-descripcion">{tarjeta.descripcion}</p>
              </div>
              <button className="tarjeta-boton" onClick={() => navigate(RUTAS.sitioTuristico(slug))}>
                Ver más
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TarjetasTurismo;
