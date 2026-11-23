import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';
import type { Coordenadas } from '../../types';

// Con bundlers como Vite, Leaflet no encuentra las imágenes del marcador por
// defecto; se configuran una sola vez aquí (antes se repetía en 6 archivos).
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: shadow,
});

const ZOOM_POR_DEFECTO = 17; // Zoom alto para ver la calle

interface MapaLeafletProps {
  coordenadas: Coordenadas;
  etiqueta: string;
  zoom?: number;
}

function MapaLeaflet({ coordenadas, etiqueta, zoom = ZOOM_POR_DEFECTO }: MapaLeafletProps) {
  return (
    <MapContainer center={coordenadas} zoom={zoom} scrollWheelZoom={false} className="mapa-leaflet">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coordenadas}>
        <Popup>{etiqueta}</Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapaLeaflet;
