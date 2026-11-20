
import './App.css';
import Menu from './componentes/Menu';
import Footer from './componentes/Footer';
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Habitaciones from './pages/Habitaciones';
import Turismo from './pages/Turismo';
import SitioTurismo1 from './pages/Sitio-Turismo1';
import SitioTurismo2 from './pages/Sitio-Turismo2';
import SitioTurismo3 from './pages/Sitio-Turismo3';
import SitioTurismo4 from './pages/Sitio-Turismo4';
import SitioTurismo5 from './pages/Sitio-Turismo5';
import PagFormulario from './pages/PagFormulario';
// Home-specific components were moved into the Home page so they don't render on every route


const Layout = () => (
  <div className="App">
    <Menu />
    <Outlet />
    <Footer />
  </div>
);

// Layout sin menú ni footer para el formulario
const LayoutNoMenuFooter = () => (
  <div className="App">
    <Outlet />
  </div>
);


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="habitaciones" element={<Habitaciones />} />
        <Route path="turismo" element={<Turismo />} />
        <Route path="Sitio-Turismo1" element={<SitioTurismo1 />} />
        <Route path="Sitio-Turismo2" element={<SitioTurismo2 />} />
        <Route path="Sitio-Turismo3" element={<SitioTurismo3 />} />
        <Route path="Sitio-Turismo4" element={<SitioTurismo4 />} />
        <Route path="Sitio-Turismo5" element={<SitioTurismo5 />} />
      </Route>
      <Route path="pagformulario" element={<LayoutNoMenuFooter />}>
        <Route index element={<PagFormulario />} />
      </Route>
    </Routes>
  );
}

export default App;
