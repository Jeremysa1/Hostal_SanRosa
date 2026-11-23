import { Navigate, Route, Routes } from 'react-router-dom';
import { LayoutPrincipal, LayoutSimple } from './componentes/layout/Layouts';
import Inicio from './pages/Inicio';
import Habitaciones from './pages/Habitaciones';
import Turismo from './pages/Turismo';
import SitioTuristico from './pages/SitioTuristico';
import PreReserva from './pages/PreReserva';
import { RUTAS } from './config';
import { sitiosTuristicos } from './data/sitiosTuristicos';

/**
 * Las páginas de turismo antes vivían en /Sitio-Turismo1 ... /Sitio-Turismo5.
 * Se redirigen a /turismo/:slug para no romper enlaces ya compartidos.
 */
const RUTAS_ANTIGUAS_TURISMO = sitiosTuristicos.map((sitio, indice) => ({
  ruta: `Sitio-Turismo${indice + 1}`,
  destino: RUTAS.sitioTuristico(sitio.slug),
}));

function App() {
  return (
    <Routes>
      <Route path={RUTAS.inicio} element={<LayoutPrincipal />}>
        <Route index element={<Inicio />} />
        <Route path="habitaciones" element={<Habitaciones />} />
        <Route path="turismo" element={<Turismo />} />
        <Route path="turismo/:slug" element={<SitioTuristico />} />
        {RUTAS_ANTIGUAS_TURISMO.map(({ ruta, destino }) => (
          <Route key={ruta} path={ruta} element={<Navigate to={destino} replace />} />
        ))}
      </Route>
      <Route path={RUTAS.preReserva} element={<LayoutSimple />}>
        <Route index element={<PreReserva />} />
      </Route>
    </Routes>
  );
}

export default App;
