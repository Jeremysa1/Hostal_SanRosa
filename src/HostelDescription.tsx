import './HostelDescription.css';
import MapaHostal from './MapaHostal'; // Importamos el componente del mapa
import React from 'react'; // Si estás usando .tsx/jsx, esto es necesario

function HostelDescription() {
  return (
    <>
   
      <div className='mapa-fondo'>
      {/* SECCIÓN DEL MAPA Y LA INFORMACIÓN */}
      <div className='mapa-info'>
        {/* Usamos 'cuadro' como un contenedor adicional, si lo deseas */}
        <div className='cuadro'> 
          <div className='mapa'>
            <MapaHostal /> 
          </div>
          
        </div>
      </div>
      </div>
      
     </>
  );
}

export default HostelDescription;
