import { Navigate, useParams } from 'react-router-dom';
import FranjaIconos from '../componentes/comunes/FranjaIconos';
import MapaSitio from '../componentes/turismo/MapaSitio';
import EncabezadoSitio from '../componentes/turismo/EncabezadoSitio';
import { RUTAS } from '../config';
import { buscarSitioTuristico } from '../data/sitiosTuristicos';

/** Página de detalle de un sitio turístico: /turismo/:slug */
function SitioTuristico() {
  const { slug } = useParams();
  const sitio = buscarSitioTuristico(slug);

  if (!sitio) return <Navigate to={RUTAS.turismo} replace />;

  return (
    <>
      <EncabezadoSitio encabezado={sitio.encabezado} />
      <FranjaIconos items={sitio.recomendaciones} claseTexto="i1" />
      <MapaSitio mapa={sitio.mapa} />
    </>
  );
}

export default SitioTuristico;
