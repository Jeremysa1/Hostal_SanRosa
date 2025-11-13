import './pagina.css';

const Pagina5 = () => {
    return (
        <>
            <div className="Pagina-imagen">
                <img src="https://res.cloudinary.com/dfznn7pui/image/upload/v1761353648/Termales_Santa_Rosa_de_Cabal_e3qiaf_viqdrk.jpg"className='imagen-escritorio' alt="Termales Santa Rosa" />
                <img src="https://res.cloudinary.com/dfznn7pui/image/upload/v1761268360/Termales_Santa_Rosa_de_Cabal_e3qiaf.jpg"className='imagen-movil' />
            </div>
            <div className="titulo">
                <strong> <h1>PARQUE</h1>
                <h2 className='subtitulo'>del Machete</h2></strong>
            </div>
            <div className='texto'>
                <p>
                Es un homenaje al espíritu trabajador de los santarrosanos y a la cultura cafetera que caracteriza la región. Su nombre hace referencia a una de las herramientas más emblemáticas del campo colombiano. Este lugar combina arte, tradición y orgullo local, con esculturas y murales que representan la vida rural. Además, es un punto ideal para disfrutar de la gastronomía típica y conocer más sobre la historia del municipio. Un espacio lleno de identidad y cultura popular.
                </p>
            </div>


        </>
    );

};

export default Pagina5;
