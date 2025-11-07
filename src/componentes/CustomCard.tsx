import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Rating } from 'primereact/rating';
import './CustomCard.css';

// Interfaz de propiedades para el componente CustomCard.
interface CustomCardProps {
    imageUrl: string; // URL de la imagen para la tarjeta.
    detailImageUrl: string; // URL de la imagen para la ventana emergente.
    title: string; // Título principal.
    subtitle: string; // Subtítulo (tipo de habitación).
    description: string; // Descripción corta.
    rating: number; // Calificación (de 1 a 5).
    onCardClick: () => void;
}

// Componente funcional que renderiza una tarjeta de habitación.
export const CustomCard = (props: CustomCardProps) => {

    // -- ENCABEZADO DE LA TARJETA --
    const header = (
        <img alt="Card" src={props.imageUrl} />
    );
    
    // -- PIE DE LA TARJETA CON BOTONES --
    const footer = (
        <div className="flex flex-wrap justify-content-center gap-2">
            <Button label="Reservar" />
            {/* Al hacer clic en "Ver más", se muestra la ventana emergente. */}
            <Button label="Ver más" className="p-button-outlined p-button-secondary" onClick={() => props.onCardClick()} />
        </div>
    );

    // -- TÍTULO PERSONALIZADO CON CALIFICACIÓN --
    const customTitle = (
        <>
            <div className='rating-container flex align-items-center mb-2 gap-2'>
                <Rating value={props.rating} readOnly cancel={false} />
                <span className='rating-number'>{props.rating.toFixed(1)}</span>
            </div>
            <div className='p-card-title'>{props.title}</div>
            <div className='p-card-subtitle'>{props.subtitle}</div>
        </>
    );

    return (
        <>
            <div className="card-container p-2">
                <Card title={customTitle} footer={footer} header={header}>
                    <p className="m-0">
                        {props.description}
                    </p>
                </Card>
            </div>
        </>
    )
}
