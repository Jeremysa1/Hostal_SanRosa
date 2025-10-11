import React from 'react';
import Tarjetas from './componentes/Tarjetas';
import Menu from './componentes/Menu';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <Menu />
      <Tarjetas />
    </div>
  );
};

export default App;
