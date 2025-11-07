import React from 'react';
import './Tarjeta.css';

const lugaresTuristicos = [
  {
    imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1760480433/Sin_t%C3%ADtulo-1_rbtyg7.jpg',
    titulo: 'Termales Santa Rosa de Cabal',
    descripcion: 'Los Termales de Santa Rosa de Cabal son el lugar perfecto para relajarse y disfrutar de la naturaleza, con aguas calientes rodeadas de montañas y cascadas en pleno corazón del Eje Cafetero.',
  },
  {
    imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1760907449/san-vicente_wlgeqh.jpg',
    titulo: 'Termales de San Vicente',
    descripcion: 'Los Termales de San Vicente son un refugio natural en medio del bosque andino, donde las aguas termales y cascadas crean un ambiente ideal para desconectarse y renovar energía.',
  },
  {
    imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1760907729/parque-de-las-araucarias_dh6jhj.jpg',
    titulo: 'Parque de las Araucarias',
    descripcion: 'El Parque de las Araucarias es el punto de encuentro más emblemático de Santa Rosa, rodeado de árboles imponentes y arquitectura colonial que reflejan la esencia tradicional del pueblo.',
  },
  {
    imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1760908104/iglesia-milagrosa_umrlse.jpg',
    titulo: 'Iglesia de la Milagrosa',
    descripcion: 'La Iglesia de la Milagrosa es un símbolo de fe y devoción para los habitantes de Santa Rosa. Con su diseño sencillo y acogedor, invita a la reflexión y a conocer más sobre la historia religiosa del municipio.',
  },
  {
    imagen: 'https://res.cloudinary.com/dfznn7pui/image/upload/v1760908339/parque-machete_los6gd.jpg',
    titulo: 'Parque del Machete',
    descripcion: 'El Parque del Machete rinde homenaje al trabajador santarrosano y su espíritu cafetero. Es un espacio lleno de vida y tradición, perfecto para conocer la cultura local y disfrutar de la gastronomía típica de la región.',
  },
];

const Tarjetas: React.FC = () => {
  return (
    <div className="tarjetas-container">
      <div className="header">
        <p className="subtitle">SITIOS TURISTICOS</p>
        <h1 className="title">EXPLORA LOS PAISAJES Y LOS ENCANTOS</h1>
        <h2 className="title2">de Santa Rosa de Cabal</h2>
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
