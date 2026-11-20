import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'leaflet/dist/leaflet.css'; // Importa los estilos de Leaflet
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import ScrollToTop from './ScrollToTop';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </StrictMode>,
);
