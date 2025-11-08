import './App.css';
import Menu from './componentes/Menu';
import Footer from './componentes/Footer';
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Habitaciones from './pages/Habitaciones';
import Turismo from './pages/Turismo';
import SitioTurismo1 from './pages/Sitio-Turismo1';
// Home-specific components were moved into the Home page so they don't render on every route

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
        <Route path="home" element={<Home />} />
        <Route path="habitaciones" element={<Habitaciones />} />
        <Route path="turismo" element={<Turismo />} />
        <Route path="Sitio-Turismo1" element={<SitioTurismo1 />} />
      </Route>
    </Routes>
  );
}

export default App;
