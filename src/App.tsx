import React from 'react';
import Tarjetas from './componentes/Tarjetas';
import Menu from './componentes/Menu';
import './App.css';

const App: React.FC = () => {
  return (
    <>
      <Menu />
      <Tarjetas />
    </>
  );
};

export default App;
