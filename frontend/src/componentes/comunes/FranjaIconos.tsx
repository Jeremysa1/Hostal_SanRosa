import type { ItemIcono } from '../../types';
import './FranjaIconos.css';

interface IconoItemProps extends ItemIcono {
  claseTexto?: string;
}

/** Icono + título + texto. Reutilizado por todas las franjas de iconos. */
export function IconoItem({ icono: Icono, titulo, texto, claseTexto }: IconoItemProps) {
  return (
    <div className="icono-item">
      <Icono className="icono" />
      <h4>{titulo}</h4>
      <p className={claseTexto}>{texto}</p>
    </div>
  );
}

interface FranjaIconosProps {
  items: ItemIcono[];
  /** Clase opcional para el párrafo de cada item (los sitios turísticos usan "i1"). */
  claseTexto?: string;
}

/** Franja horizontal de iconos (inicio y sitios turísticos). */
function FranjaIconos({ items, claseTexto }: FranjaIconosProps) {
  return (
    <div className="franja-iconos-container">
      {items.map((item) => (
        <IconoItem key={item.titulo} {...item} claseTexto={claseTexto} />
      ))}
    </div>
  );
}

export default FranjaIconos;
