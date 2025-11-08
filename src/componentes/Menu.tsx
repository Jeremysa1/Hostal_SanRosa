import React, { useState } from 'react';
import './Menu.css';
import logo from '../assets/LOGO-HOSTAL.svg';
import { FaBed, FaMapMarkedAlt, FaBars, FaTimes, FaHome } from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';

const Menu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Mapeo simple de ruta -> color. Ajusta los colores según prefieras.
  const getBgColor = (path: string) => {
    if (path.startsWith('/habitaciones')) return '#fff'; // color para habitaciones
    if (path.startsWith('/turismo')) return '#fff'; // color para turismo
    if (path.startsWith('/pagformulario')) return '#fff'; // color para formulario
    // por defecto (inicio u otras páginas)
    return '#ffffff';
  };

  const navStyle = { backgroundColor: getBgColor(location.pathname) };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="menu" style={navStyle}>
      <div className="logo-container">
        <img src={logo} alt="logo" className="logo" />
      </div>
      <button className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
      </button>
      <div className={`menu-right ${isMenuOpen ? 'active' : ''}`}>
        <ul className="menu-list">
          <li className="menu-item">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              <FaHome size={30} />Inicio
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/habitaciones" className={({ isActive }) => (isActive ? 'active' : '')}>
              <FaBed size={30} />Habitaciones
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/turismo" className={({ isActive }) => (isActive ? 'active' : '')}>
              <FaMapMarkedAlt size={30} />Turismo
            </NavLink>
          </li>
        </ul>
        <NavLink to="/pagformulario">
          <button className="reservar-btn">Reservar Ya</button>
        </NavLink>
      </div>
    </nav>
  );
}

export default Menu;
