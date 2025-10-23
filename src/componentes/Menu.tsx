import React, { useState } from 'react';
import './Menu.css';
import logo from '../assets/LOGO-HOSTAL.svg';
import { FaBed, FaMapMarkedAlt, FaBars, FaTimes } from 'react-icons/fa';

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
            <a href="/habitaciones">
              <FaBed size={30} />
              <span>Habitaciones</span>
            </a>
          </li>
          <li className="menu-item">
            <a href="/turismo">
              <FaMapMarkedAlt size={30} />
              <span>Turismo</span>
            </a>
          </li>
        </ul>
        <button className="reservar-btn">Reservar Ya</button>
      </div>
    </nav>
  );
}

export default Menu;
