import './App.css';
import Menu from './componentes/Menu';
import Footer from './componentes/Footer';
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Habitaciones from './pages/Habitaciones';
import Contacto from './pages/Contacto';

const Layout = () => (
  <div className="App">
    <Menu />
    <Outlet />
    <Footer />
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="habitaciones" element={<Habitaciones />} />
        <Route path="contacto" element={<Contacto />} />
      </Route>
    </Routes>
  );
}

export default App;
