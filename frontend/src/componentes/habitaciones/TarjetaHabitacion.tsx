import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Rating } from 'primereact/rating';
import { Link } from 'react-router-dom';
import { RUTAS } from '../../config';
import type { Habitacion } from '../../types';
import './TarjetaHabitacion.css';

interface TarjetaHabitacionProps {
  habitacion: Habitacion;
  onVerMas: () => void;
}

/** Tarjeta de una habitación en el listado de /habitaciones. */
export function TarjetaHabitacion({ habitacion, onVerMas }: TarjetaHabitacionProps) {
  const { imageUrl, title, subtitle, description, rating } = habitacion;

  const header = <img alt={`${title} ${subtitle}`} src={imageUrl} />;

  const footer = (
    <div className="flex flex-wrap justify-content-center gap-2">
      <Link to={RUTAS.preReserva}>
        <button className="reserve-button">RESERVAR</button>
      </Link>
      <Button label="Ver más" className="p-button-outlined p-button-secondary" onClick={onVerMas} />
    </div>
  );

  const titulo = (
    <>
      <div className="rating-container flex align-items-center mb-2 gap-2">
        <Rating value={rating} readOnly cancel={false} />
        <span className="rating-number">{rating.toFixed(1)}</span>
      </div>
      <div className="p-card-title">{title}</div>
      <div className="p-card-subtitle">{subtitle}</div>
    </>
  );

  return (
    <div className="card-container p-2">
      <Card title={titulo} footer={footer} header={header}>
        <p className="m-0">{description}</p>
      </Card>
    </div>
  );
}
