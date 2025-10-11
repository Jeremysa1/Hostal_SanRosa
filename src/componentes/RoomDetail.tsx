import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import './RoomDetail.css';

interface RoomDetailProps {
    visible: boolean;
    onHide: () => void;
    room: {
        detailImageUrl: string;
        subtitle: string;
    };
}

export const RoomDetail = (props: RoomDetailProps) => {
    if (!props.room) return null;

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
                <Button icon="pi pi-times" className="p-button-rounded close-button" onClick={props.onHide} />

                <div className="room-detail-content grid">
                    {/* ========= PANEL IZQUIERDO ========= */}
                    <div className="col-6">
                        <h1 className="room-detail-title">HABITACIÓN {props.room.subtitle}</h1>
                        <div className="info-item">
                            <i className="pi pi-users icon"></i>
                            <div className="text-content">
                                <p><b>Capacidad:</b> 6 Personas</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <i className="pi pi-inbox icon"></i>
                            <div className="text-content">
                                <p><b>Camas:</b></p>
                                <p className="light-text">2 camas dobles</p>
                                <p className="light-text">2 camas individuales</p>
                            </div>
                        </div>
                    </div>

                    {/* ========= PANEL DERECHO ========= */}
                    <div className="col-6 detail-right-panel">
                        {/* --- Servicios (3 columnas x 2 filas) --- */}
                        <div className="amenities-grid grid">
                            <div className="col-4 amenity-item"><i className="pi pi-wifi"></i>WIFI</div>
                            <div className="col-4 amenity-item"><i className="pi pi-desktop"></i>TV</div>
                            <div className="col-4 amenity-item"><i className="pi pi-key"></i>Closet</div>
                            <div className="col-4 amenity-item"><i className="pi pi-shopping-cart"></i>Servicio de lavandería</div>
                            <div className="col-4 amenity-item"><i className="pi pi-sun"></i>Se permiten mascotas</div>
                            <div className="col-4 amenity-item"><i className="pi pi-car"></i>Estacionamiento gratuito</div>
                        </div>

                        {/* --- Sección inferior combinada --- */}
                        <div className="bottom-section grid">
                            {/* Columna de Check-in/out */}
                            <div className="col-7 check-in-out-section">
                                <div className="check-in-out-item">
                                    <p className="check-in-out-label">Check-in:</p>
                                    <p className="light-text">A partir de las 3:00 pm</p>
                                </div>
                                <div className="check-in-out-item">
                                    <p className="check-in-out-label">Check-out:</p>
                                    <p className="light-text">Antes de las 11:00 am</p>
                                </div>
                            </div>

                            {/* Columna de Precio/Reserva */}
                            <div className="col-5 price-reserve-section">
                                <div className="price-section">
                                    <p className="price-label">Precio:</p>
                                    <p className="room-detail-price">$500.000</p>
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
