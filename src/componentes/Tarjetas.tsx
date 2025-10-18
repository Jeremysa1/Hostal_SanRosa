import React from 'react';
import './Tarjeta.css';
import './Tarjetas.css';

const lugaresTuristicos = [
  {
    imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1760480433/Sin_t%C3%ADtulo-1_rbtyg7.jpg',
    titulo: 'Termales Santa Rosa de Cabal',
    descripcion: 'Los Termales de Santa Rosa de Cabal son el lugar perfecto para relajarse y disfrutar de la naturaleza. Rodeados de montañas y cascadas, ofrecen aguas calientes naturales ideales para descansar y vivir una experiencia única en el corazón del Eje Cafetero.',
  },
  {
    imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1760481215/paramill_kwk0gh.jpg',
    titulo: 'Termales de San Vicente',
    descripcion: 'El Paramillo de Santa Rosa es un volcán extinto que forma parte del Parque Nacional Natural Los Nevados. Con sus imponentes paisajes de alta montaña, frailejones y aire puro, es un lugar ideal para el senderismo y la contemplación de la naturaleza en su estado más auténtico.',
  },
  {
    imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1760481562/basilica_amjnoh.jpg',
    titulo: 'Basílica Menor de Nuestra Señora de las Victoria',
    descripcion: 'La Basílica Menor de Nuestra Señora de las Victorias es el templo más representativo de Santa Rosa de Cabal. Ubicada frente al Parque de Las Araucarias, destaca por su arquitectura imponente de estilo neogótico y por ser un lugar de gran valor religioso y cultural.',
  },
  {
    imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1760482423/cocora_uqxhye.jpg',
    titulo: 'Valle de Cocora',
    descripcion: 'El Valle de Cocora es el destino perfecto para maravillarse con las imponentes palmas de cera, símbolo nacional de Colombia. Rodeado de montañas verdes y neblina, es ideal para hacer senderismo y disfrutar de paisajes únicos en el mundo.',
  },
  {
    imagen: 'https://images.pexels.com/photos/1319829/pexels-photo-1319829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    titulo: 'Filandia',
    descripcion: 'Filandia es un encantador pueblo cafetero que combina calles coloridas, arquitectura tradicional y un ambiente tranquilo. Su mirador ofrece una de las vistas más espectaculares del Eje Cafetero, acompañado de artesanías y gastronomía típica.',
  },
  {
    imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1760486192/parque_xxg22v.jpg',
    titulo: 'Parque del Café',
    descripcion: 'El Parque del Café es el lugar ideal para vivir diversión y cultura en un solo espacio. Con montañas rusas, espectáculos y experiencias que giran en torno al café, es un plan imperdible para toda la familia.',
  },
];

const Tarjetas: React.FC = () => {
  return (
    <div className="tarjetas-container">
      <div className="header">
        <p className="subtitle">SITIOS TURISTICOS</p>
        <h1 className="title">EXPLORA LOS PAISAJES Y LOS ENCANTOS</h1>
      </div>
      <div className="tarjetas-list">
        {lugaresTuristicos.map((lugar, index) => (
          <div className="tarjeta" key={index}>
            <img src={lugar.imagen} alt={lugar.titulo} className="tarjeta-imagen" />
            <div className="tarjeta-contenido">
              <div>
                <h2 className="tarjeta-titulo">{lugar.titulo}</h2>
                <p className="tarjeta-descripcion">{lugar.descripcion}</p>
              </div>
              <button className="tarjeta-boton">Ver más</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tarjetas;
