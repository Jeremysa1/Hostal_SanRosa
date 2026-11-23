import { useState } from 'react';
import { FaBars, FaBed, FaHome, FaMapMarkedAlt, FaTimes } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/LOGO-HOSTAL.svg';
import { RUTAS } from '../../config';
import './Menu.css';

const ENLACES = [
  { ruta: RUTAS.inicio, texto: 'Inicio', Icono: FaHome, exacta: true },
  { ruta: RUTAS.habitaciones, texto: 'Habitaciones', Icono: FaBed, exacta: false },
  { ruta: RUTAS.turismo, texto: 'Turismo', Icono: FaMapMarkedAlt, exacta: false },
];

const claseActiva = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '');

function Menu() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <nav className="menu">
      <div className="logo-container">
        <img src={logo} alt="logo" className="logo" />
      </div>
      <button
        className="menu-toggle"
        onClick={() => setMenuAbierto((abierto) => !abierto)}
        aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={menuAbierto}
      >
        {menuAbierto ? <FaTimes size={30} /> : <FaBars size={30} />}
      </button>
      <div className={`menu-right ${menuAbierto ? 'active' : ''}`}>
        <ul className="menu-list">
          {ENLACES.map(({ ruta, texto, Icono, exacta }) => (
            <li className="menu-item" key={ruta}>
              <NavLink to={ruta} end={exacta} className={claseActiva} onClick={cerrarMenu}>
                <Icono size={30} />
                {texto}
              </NavLink>
            </li>
          ))}
        </ul>
        <NavLink to={RUTAS.preReserva} onClick={cerrarMenu}>
          <button className="reservar-btn">Reservar Ya</button>
        </NavLink>
      </div>
    </nav>
  );
}

export default Menu;
