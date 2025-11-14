import './pagina.css';

const Pagina2 = () => {
    return (
        <>
            <div className="Pagina-imagen">
                <img src="https://res.cloudinary.com/dfznn7pui/image/upload/v1763076649/san-vicente_ntfc7q.jpg" className='imagen-escritorio' alt="Termales San vicente" />
                <img src="https://res.cloudinary.com/dfznn7pui/image/upload/v1763076649/san-vicente_ntfc7q.jpg"className='imagen-movil' />
            </div>
            <div className="titulo">
                <strong> <h1>TERMALES</h1>
                <h2 className='subtitulo'>San Vicente</h2></strong>
            </div>
            <div className='texto'>
                <p>
                 Ofrecen una experiencia más natural y tranquila, alejados del ruido y rodeados por la densa vegetación del bosque andino. Este lugar es ideal para quienes buscan una conexión más profunda con la naturaleza y el silencio. Sus pozos termales y cascadas cristalinas invitan al descanso y la meditación. También se pueden recorrer senderos ecológicos, observar aves y disfrutar de baños de barro volcánico con propiedades terapéuticas. Es un destino perfecto para el ecoturismo y el bienestar.
                </p>
            </div>


        </>
    );

};

export default Pagina2;
