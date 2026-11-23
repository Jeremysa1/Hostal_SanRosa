import { GrLocation } from 'react-icons/gr';
import './MapaInicio.css';
import { UBICACION_HOSTAL } from '../../data/hostal';
import MapaLeaflet from '../comunes/MapaLeaflet';

function MapaInicio() {
  return (
    <div className="mapa-fondo-inicio">
      <div className="mapa-info-inicio">
        <div className="mapa-inicio">
          <MapaLeaflet coordenadas={UBICACION_HOSTAL.coordenadas} etiqueta={UBICACION_HOSTAL.etiqueta} />
        </div>
        <div className="info">
          <div className="ubi">
            <GrLocation className="icono-ubi" />
            <h2 className="btnubi">UBICACIÓN</h2>
          </div>

          <h2 className="municipio">Santa Rosa de Cabal</h2>
          <h2 className="departamento">RISARALDA</h2>
          <p>
            Nuestro hostal está ubicado estratégicamente en{' '}
            <strong>Santa Rosa de Cabal, la 'Ciudad de las Araucarias'</strong>, un destino que combina la magia del
            Paisaje Cultural Cafetero con una inigualable oferta de bienestar natural.
            <br />
            <br />
            <strong>Ven y disfruta de la generosidad de esta tierra,</strong> sabiendo que al final del día te espera
            la calidez y el sosiego de tu hostal familiar lleno de paz.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MapaInicio;
