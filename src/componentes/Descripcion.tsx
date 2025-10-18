
import React from 'react';
import './Descripcion.css';

const Descripcion = () => {
  return (
    <div className="descripcion-container">
      <div className="descripcion-imagen">
        <img src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Descripción" />
      </div>
      <div className="descripcion-texto">
        <h2>Breve <strong>DESCRIPCIÓN</strong></h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea coent, sunt in
          culpa qui officia deserunt mollit nostrud exercitation ullamco laboris
        </p>
      </div>
    </div>
  );
};

export default Descripcion;
