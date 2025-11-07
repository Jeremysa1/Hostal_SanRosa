import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { LuShowerHead } from "react-icons/lu";
import { BsDashLg } from "react-icons/bs";
import { BiCloset } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { LiaCouchSolid } from "react-icons/lia";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { FaWifi, FaTv, FaCheck, FaUserFriends, FaBed } from 'react-icons/fa';
import './RoomDetail.css';

interface RoomDetailProps {
    visible: boolean;
    onHide: () => void;
    room: {
        detailImageUrl: string;
        subtitle: string;
        services: string[];
        price: number;
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
                    {/* ========= PANEL IZQUIERDO ========= */}
                    <div className="col-12 md:col-6">
                        <h1 className="room-detail-title">HABITACIÓN {props.room.subtitle}</h1>
                        <div className="info-item">
                            <FaUserFriends className="icon" />
                            <div className="text-content">
                                <p><b>Capacidad:</b> 5 personas</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <FaBed className="icon" />
                            <div className="text-content">
                                <p><b>Camas:</b></p>
                                <p className="light-text">1 camas dobles</p>
                                <p className="light-text">3 camas individuales</p>
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
                                <Button label="RESERVA" className="reserve-button" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
