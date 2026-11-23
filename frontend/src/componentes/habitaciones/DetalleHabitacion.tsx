import type { ReactElement } from 'react';
import { Dialog } from 'primereact/dialog';
import { BiCloset } from 'react-icons/bi';
import { BsDashLg } from 'react-icons/bs';
import { FaBed, FaCheck, FaTv, FaUserFriends, FaWifi } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { LiaCouchSolid } from 'react-icons/lia';
import { LuShowerHead } from 'react-icons/lu';
import { MdOutlineTableRestaurant } from 'react-icons/md';
import { PiToiletBold } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { RUTAS } from '../../config';
import type { Habitacion } from '../../types';
import { describirCama, pluralizar } from '../../utils/camas';
import './DetalleHabitacion.css';

/** Icono por servicio; los que no aparecen usan un check genérico. */
const ICONOS_SERVICIO: Record<string, ReactElement> = {
  'Wi-Fi': <FaWifi />,
  Televisión: <FaTv />,
  Repisa: <BsDashLg />,
  Closet: <BiCloset />,
  'Sofá cama': <LiaCouchSolid />,
  'Agua caliente': <LuShowerHead />,
  'Baño privado': <PiToiletBold />,
  'mesita de noche': <MdOutlineTableRestaurant />,
  'Mesa de trabajo': <MdOutlineTableRestaurant />,
};

const iconoServicio = (servicio: string) => ICONOS_SERVICIO[servicio] ?? <FaCheck />;

const formatoPesos = (valor: number) => `$${valor.toLocaleString('es-CO')}`;

interface DetalleHabitacionProps {
  habitacion: Habitacion;
  visible: boolean;
  onHide: () => void;
}

export function DetalleHabitacion({ habitacion, visible, onHide }: DetalleHabitacionProps) {
  const { detailImageUrl, subtitle, capacity, bedDetails, services, price } = habitacion;

  return (
    <Dialog visible={visible} onHide={onHide} showHeader={false} modal className="room-detail-dialog">
      <div className="room-detail-container">
        <img src={detailImageUrl} alt={`Habitación ${subtitle}`} className="room-detail-image" />
        <button onClick={onHide} className="close-button" aria-label="Cerrar">
          <IoClose />
        </button>

        <div className="room-detail-content grid">
          {/* Panel izquierdo: capacidad y camas */}
          <div className="col-12 md:col-6">
            <h1 className="room-detail-title">HABITACIÓN {subtitle}</h1>
            <div className="info-item">
              <FaUserFriends className="icon" />
              <div className="text-content">
                <p>
                  <b>Capacidad:</b> {capacity} {pluralizar(capacity, 'persona', 'personas')}
                </p>
              </div>
            </div>
            <div className="info-item">
              <FaBed className="icon" />
              <div className="text-content">
                <p>
                  <b>Camas:</b>
                </p>
                {bedDetails.map((cama) => (
                  <p key={cama.type} className="light-text">
                    {describirCama(cama)}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Panel derecho: servicios, horarios y precio */}
          <div className="col-12 md:col-6 detail-right-panel">
            <div className="amenities-grid grid">
              {services.map((servicio) => (
                <div key={servicio} className="col-12 md:col-6 amenity-item">
                  {iconoServicio(servicio)}
                  <span>{servicio}</span>
                </div>
              ))}
            </div>

            <div className="bottom-section grid">
              <div className="col-12 lg:col-7 check-in-out-section">
                <div className="check-in-out-item">
                  <p className="check-in-out-label">Check-in:</p>
                  <p className="light-text">A partir de las 3:00 pm</p>
                </div>
                <div className="check-in-out-item">
                  <p className="check-in-out-label">Check-out:</p>
                  <p className="light-text">Antes de las 12:00 am</p>
                </div>
              </div>

              <div className="col-12 lg:col-5 price-reserve-section">
                <div className="price-section">
                  <p className="price-label">Precio por persona:</p>
                  <p className="room-detail-price">{formatoPesos(price)}</p>
                </div>
                <Link to={RUTAS.preReserva}>
                  <button className="reserve-button">RESERVA</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
