import './Mapa.css';
import MapaHostal from './MapaHostal'; // Importamos el componente del mapa

function HostelDescription() {
  return (
    <>
    
    <div className="hostel-description-container">
      <div className="hostel-image">
        <img src="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Hostel room" />
      </div>
      <div className="hostel-text">
        <h2>Destino familiar en el eje cafetero</h2>
        <p>
        En <strong>Turquesa Hostal</strong>, creemos que viajar debe sentirse tan reconfortante como volver a casa. Somos un hostal de descanso familiar, sano y sereno, diseñado para que recargues energías <strong>en el corazón del Paisaje Cultural Cafetero</strong>.
        Aquí, la tranquilidad es nuestra promesa. Desconecta del ruido, <strong>conecta con los tuyos</strong> y vive una experiencia de paz total. Reserva tu estadía y descubre tu <strong>"hogar"</strong> en Santa Rosa de Cabal.        </p>
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
            <p>Nuestro hostal está ubicado estratégicamente en <strong>Santa Rosa de Cabal, la 'Ciudad de las Araucarias'</strong>, un destino que combina la magia del Paisaje Cultural Cafetero con una inigualable oferta de bienestar natural.

Ven y disfruta de la generosidad de esta tierra, sabiendo que al final del día te espera la calidez y el sosiego de tu hostal familiar lleno de paz.</p>
          </div>
        </div>
      </div>
      </div>
      
     </>
  );
}

export default HostelDescription;
