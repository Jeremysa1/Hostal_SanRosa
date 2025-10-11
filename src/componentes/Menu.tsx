import React from 'react';
import './Menu.css';
import logo from '../assets/logo.svg';

const Menu: React.FC = () => {
  const menuStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0',
    width: '100%',
    backgroundColor: '#f8f8f8',
  };

  const logoContainerStyle: React.CSSProperties = {
    marginRight: '1cm',
  };

  const menuRightStyle: React.CSSProperties = {
    marginRight: '1cm',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <nav style={menuStyle}>
      <div style={logoContainerStyle}>
        <img src={logo} alt="logo" className="logo" />
      </div>
      <div style={menuRightStyle}>
        <ul className="menu-list">
          <li className="menu-item"><a href="/habitaciones">Habitaciones</a></li>
          <li className="menu-item"><a href="/turismo">Turismo</a></li>
        </ul>
        <button className="reservar-btn">Reservar Ya</button>
      </div>
    </nav>
  );
}

export default Menu;