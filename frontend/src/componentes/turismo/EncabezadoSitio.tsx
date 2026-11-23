import type { SitioTuristico } from '../../types';
import './EncabezadoSitio.css';

interface EncabezadoSitioProps {
  encabezado: SitioTuristico['encabezado'];
}

/** Imagen, título y descripción de un sitio turístico. */
function EncabezadoSitio({ encabezado }: EncabezadoSitioProps) {
  const { imagenEscritorio, imagenMovil, alt, titulo, subtitulo, texto } = encabezado;

  return (
    <>
      <div className="Pagina-imagen">
        <img src={imagenEscritorio} className="imagen-escritorio" alt={alt} />
        <img src={imagenMovil} className="imagen-movil" alt={alt} />
      </div>
      <div className="titulo">
        <strong>
          {' '}
          <h1>{titulo}</h1>
          <h2 className="subtitulo">{subtitulo}</h2>
        </strong>
      </div>
      <div className="texto">
        <p>{texto}</p>
      </div>
    </>
  );
}

export default EncabezadoSitio;
