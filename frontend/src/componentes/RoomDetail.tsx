import { Dialog } from 'primereact/dialog';
import { LuShowerHead } from "react-icons/lu";
import { BsDashLg } from "react-icons/bs";
import { PiToiletBold } from "react-icons/pi";
import { BiCloset } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { LiaCouchSolid } from "react-icons/lia";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { FaWifi, FaTv, FaCheck, FaUserFriends, FaBed } from 'react-icons/fa';
import './RoomDetail.css';
import { Link } from 'react-router-dom';

interface RoomDetailProps {
    visible: boolean;
    onHide: () => void;
    room: {
        detailImageUrl: string;
        subtitle: string;
        services: string[];
        price: number;
        capacity: number;
        bedDetails: Array<{ type: string; count: number }>;
    };
}

export const RoomDetail = (props: RoomDetailProps) => {
    if (!props.room) return null;

    const getServiceIcon = (service: string) => {
        switch (service) {
            case "Wi-Fi":
                return <FaWifi />;
            case "Televisión":
                return <FaTv />;
            case "Repisa":
                return <BsDashLg />;
            case "Closet":
                return <BiCloset />;
            case "Sofá cama":
                return <LiaCouchSolid />;
            case "Agua caliente":
                return <LuShowerHead />;
                case "Baño privado":
                return <PiToiletBold />;
                case "mesita de noche":
                return <MdOutlineTableRestaurant  />;
            case "Mesa de trabajo":
                return <MdOutlineTableRestaurant />;
            default:
                return <FaCheck />;
        }
    };

    return (
        <Dialog
            visible={props.visible}
            onHide={props.onHide}
            showHeader={false}
            modal
            className="room-detail-dialog"
        >
            <div className="room-detail-container">
                <img src={props.room.detailImageUrl} alt={`Habitación ${props.room.subtitle}`} className="room-detail-image" />
                <button onClick={props.onHide} className="close-button">
                    <IoClose />
                </button>

                <div className="room-detail-content grid">
                    {/* ========= PANEL IZQUIERDO: AHORA DINÁMICO ========= */}
                    <div className="col-12 md:col-6">
                        <h1 className="room-detail-title">HABITACIÓN {props.room.subtitle}</h1>
                        <div className="info-item">
                            <FaUserFriends className="icon" />
                            <div className="text-content">
                                {/* Usamos props.room.capacity, y pluralizamos "persona" */}
                                <p>
                                    <b>Capacidad:</b> {props.room.capacity}{' '}
                                    {props.room.capacity === 1 ? 'persona' : 'personas'}
                                </p>
                            </div>
                        </div>
                        <div className="info-item">
                            <FaBed className="icon" />
                            <div className="text-content">
                                <p><b>Camas:</b></p>
                                {/* Mapea los detalles de las camas (bedDetails) */}
                                {props.room.bedDetails.map((bed, index) => {

                                    let displayText = "";

                                    if (bed.count === 1) {
                                        // Caso singular: si es 1, usamos el tipo de cama exacto (que debe ser singular: "cama doble")
                                        displayText = `1 ${bed.type}`;
                                    } else {
                                        // Caso plural: si es más de 1, necesitamos pluralizar
                                        let pluralizedType = bed.type;

                                        // 1. Pluralizar CAMA INDIVIDUAL/DOBLE
                                        if (bed.type.includes('cama individual')) {
                                            pluralizedType = bed.type.replace('cama individual', 'camas individuales');
                                        } else if (bed.type.includes('cama doble')) {
                                            pluralizedType = bed.type.replace('cama doble', 'camas dobles');
                                        }
                                        // 2. Pluralizar SOFÁ CAMA
                                        else if (bed.type.includes('sofá cama')) {
                                            // Reemplaza "sofá cama" por "sofás cama"
                                            pluralizedType = bed.type.replace('sofá cama', 'sofás cama');
                                        }
                                        // Si tienes otros tipos, puedes agregar una regla aquí o usar un plural genérico
                                        else {
                                            pluralizedType = bed.type + 's';
                                        }

                                        displayText = `${bed.count} ${pluralizedType}`;
                                    }

                                    return (
                                        <p key={index} className="light-text">
                                            {displayText}
                                        </p>
                                    );

                                })}
                            </div>
                        </div>
                    </div>

                    {/* ========= PANEL DERECHO ========= */}
                    <div className="col-12 md:col-6 detail-right-panel">
                        {/* --- Servicios --- */}
                        <div className="amenities-grid grid">
                            {props.room.services && props.room.services.map((service, index) => (
                                <div key={index} className="col-12 md:col-6 amenity-item">
                                    {getServiceIcon(service)}
                                    <span>{service}</span>
                                </div>
                            ))}
                        </div>

                        {/* --- Sección inferior combinada --- */}
                        <div className="bottom-section grid">
                            {/* Columna de Check-in/out */}
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

                            {/* Columna de Precio/Reserva */}
                            <div className="col-12 lg:col-5 price-reserve-section">
                                <div className="price-section">
                                    <p className="price-label">Precio por persona:</p>
                                    <p className="room-detail-price">${props.room.price.toLocaleString('es-CO')}</p>
                                </div>
                                <Link to="/pagformulario">
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
