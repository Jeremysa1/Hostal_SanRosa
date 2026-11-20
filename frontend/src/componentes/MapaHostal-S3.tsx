import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Importar un icono por defecto para los marcadores (soluciona un problema común de Leaflet)
import L from 'leaflet';

// Importación estática de las imágenes necesarias para el pin de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';


// TUS COORDENADAS CORREGIDAS
const DEFAULT_COORDS: [number, number] = [4.86512, -75.62077];
const DEFAULT_ZOOM: number = 17; // Zoom alto para ver la calle

// Solución para que el ícono de marcador se vea correctamente
delete (L.Icon.Default.prototype as any)._getIconUrl; 

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina as any,
  iconUrl: icon as any,
  shadowUrl: shadow as any,
});


function MapaT3() {
  return (
    <MapContainer 
      center={DEFAULT_COORDS} 
      zoom={DEFAULT_ZOOM} 
      scrollWheelZoom={false}
      className="mapa-leaflet" 
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={DEFAULT_COORDS}>
        <Popup>
          Parque de las Araucarias
        </Popup>
      </Marker>
      
    </MapContainer>
  );
}

export default MapaT3;