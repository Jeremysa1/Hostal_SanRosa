import './MapaSitio.css';
import type { SitioTuristico } from '../../types';
import MapaLeaflet from '../comunes/MapaLeaflet';

interface MapaSitioProps {
  mapa: SitioTuristico['mapa'];
}

/** Mapa a ancho completo al final de la página de un sitio turístico. */
function MapaSitio({ mapa }: MapaSitioProps) {
  return (
    <div className="mapa-fondo">
      <div className="mapa">
        <MapaLeaflet coordenadas={mapa.coordenadas} etiqueta={mapa.etiqueta} />
      </div>
    </div>
  );
}

export default MapaSitio;
