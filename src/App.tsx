import React from 'react';
import Tarjetas from './componentes/Tarjetas';
import Menu from './componentes/Menu';
import Footer from './componentes/Footer';
import './App.css';

const App: React.FC = () => {
  return (
    <>
      <Menu />
      <Tarjetas />
      <Footer />
    </>
  );
};

export default App;
