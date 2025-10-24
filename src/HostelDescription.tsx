import './HostelDescription.css';
import MapaHostal from './MapaHostal'; // Importamos el componente del mapa

function HostelDescription() {
  return (
    <>
   
      <div className='mapa-fondo'>
      {/* SECCIÓN DEL MAPA Y LA INFORMACIÓN */}
      
        {/* Usamos 'cuadro' como un contenedor adicional, si lo deseas */}
        
          <div className='mapa'>
            <MapaHostal /> 
          </div>
          
        
      
      </div>
      
     </>
  );
}

export default HostelDescription;
