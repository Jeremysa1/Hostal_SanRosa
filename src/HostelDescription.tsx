import './HostelDescription.css';
import MapaHostal from './MapaHostal'; // Importamos el componente del mapa
import React from 'react'; // Si estás usando .tsx/jsx, esto es necesario

function HostelDescription() {
  return (
    <>
    
    <div className="hostel-description-container">
      <div className="hostel-image">
        <img src="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Hostel room" />
      </div>
      <div className="hostel-text">
        <h2>Breve <strong>DESCRIPCIÓN</strong></h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea coent, sunt in culpa qui officia deserunt mollit nostrud exercitation ullamco laboris
        </p>
      </div>
    </div>
   
      <div className='mapa-fondo'>
      {/* SECCIÓN DEL MAPA Y LA INFORMACIÓN */}
      <div className='mapa-info'>
        {/* Usamos 'cuadro' como un contenedor adicional, si lo deseas */}
        <div className='cuadro'> 
          <div className='mapa'>
            <MapaHostal /> 
          </div>
          <div className='info'>
            
            {/* INSERCIÓN DEL ÍCONO DE UBICACIÓN (Font Awesome) */}
            <div className='ubi'>
              {/* Esta es la clase de Font Awesome */}
              <i className="fa-solid fa-location-dot"></i>
              <h2 className='btnubi'>UBICACIÓN</h2>
            </div>
            
            <h2 className='municipio'>Santa Rosa de Cabal</h2>
            <h2 className='departamento'>RISARALDA</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea coent, sunt in culpa qui officia deserunt mollit nostrud exercitation ullamco laboris</p>
          </div>
        </div>
      </div>
      </div>
      
     </>
  );
}

export default HostelDescription;
