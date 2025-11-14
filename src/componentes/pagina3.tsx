import './pagina.css';

const Pagina3 = () => {
    return (
        <>
            <div className="Pagina-imagen">
                <img src="https://res.cloudinary.com/dfznn7pui/image/upload/v1763079953/santa-rosa-de-cabal-araucarias_1_krnsfh.png"className='imagen-escritorio' alt="Termales Santa Rosa" />
                <img src="https://res.cloudinary.com/dfznn7pui/image/upload/v1763079953/santa-rosa-de-cabal-araucarias_1_krnsfh.png"className='imagen-movil' />
            </div>
            <div className="titulo">
                <strong> <h1>PARQUE</h1>
                <h2 className='subtitulo'>de las Araucarias</h2></strong>
            </div>
            <div className='texto'>
                <p>
                El Parque de las Araucarias es el corazón de Santa Rosa de Cabal y punto de encuentro de locales y visitantes. Rodeado de majestuosos árboles de araucaria, ofrece un espacio ideal para descansar, compartir y admirar la arquitectura que lo rodea. En sus alrededores se encuentran cafeterías, tiendas artesanales y la Basílica Menor de Nuestra Señora de las Victorias. Es un lugar que refleja la calidez de su gente y el encanto tradicional del pueblo. Un sitio imprescindible para disfrutar el ambiente santarrosano.
                </p>
            </div>

        </>
    );

};

export default Pagina3;
