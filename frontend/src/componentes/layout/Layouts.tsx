import { Outlet } from 'react-router-dom';
import Menu from './Menu';
import Footer from './Footer';

/** Estructura general: menú + contenido de la ruta + pie de página. */
export function LayoutPrincipal() {
  return (
    <div className="App">
      <Menu />
      <Outlet />
      <Footer />
    </div>
  );
}

/** Sin menú ni pie de página (formulario de pre-reserva). */
export function LayoutSimple() {
  return (
    <div className="App">
      <Outlet />
    </div>
  );
}
