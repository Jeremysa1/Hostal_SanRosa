import './Mapa.css';
import MapaHostal from './MapaHostal'; // Importamos el componente del mapa
import { GrLocation } from "react-icons/gr";

function HostelDescription() {
  return (
    <>
      <div className='mapa-fondo'>
        {/* SECCIÓN DEL MAPA Y LA INFORMACIÓN */}
        <div className='mapa-info'>
          <div className='mapa'>
            <MapaHostal />
          </div>
          <div className='info'>
            {/* INSERCIÓN DEL ÍCONO DE UBICACIÓN (Font Awesome) */}
            <div className='ubi'>
              <GrLocation className='icono-ubi' />
              <h2 className='btnubi'>UBICACIÓN</h2>
            </div>
            
            <h2 className='municipio'>Santa Rosa de Cabal</h2>
            <h2 className='departamento'>RISARALDA</h2>
            <p>Nuestro hostal está ubicado estratégicamente en <strong>Santa Rosa de Cabal, la 'Ciudad de las Araucarias'</strong>, un destino que combina la magia del Paisaje Cultural Cafetero con una inigualable oferta de bienestar natural.
            <br/><br/>
            <strong>Ven y disfruta de la generosidad de esta tierra,</strong> sabiendo que al final del día te espera la calidez y el sosiego de tu hostal familiar lleno de paz.</p>
          </div>
        </div>
      </div>
     </>
  );
}

export default HostelDescription;
