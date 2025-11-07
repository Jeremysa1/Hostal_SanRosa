import React, { useState } from 'react';
import './Menu.css';
import logo from '../assets/LOGO-HOSTAL.svg';
import { FaBed, FaMapMarkedAlt, FaBars, FaTimes, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Menu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="menu">
      <div className="logo-container">
        <img src={logo} alt="logo" className="logo" />
      </div>
      <button className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
      </button>
      <div className={`menu-right ${isMenuOpen ? 'active' : ''}`}>
        <ul className="menu-list">
          <li className="menu-item">
            <Link to="/home"><FaHome size={30} />Inicio</Link>
          </li>
          <li className="menu-item">
            <Link to="/habitaciones"><FaBed size={30} />Habitaciones</Link>
          </li>
          <li className="menu-item">
            <Link to="/turismo"><FaMapMarkedAlt size={30} />Turismo</Link>
          </li>
        </ul>
        <button className="reservar-btn">Reservar Ya</button>
      </div>
    </nav>
  );
}

export default Menu;
