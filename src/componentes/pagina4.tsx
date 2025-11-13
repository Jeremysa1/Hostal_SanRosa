import './pagina.css';

const Pagina4 = () => {
    return (
        <>
            <div className="Pagina-imagen">
                <img src="https://res.cloudinary.com/dfznn7pui/image/upload/v1761353648/Termales_Santa_Rosa_de_Cabal_e3qiaf_viqdrk.jpg"className='imagen-escritorio' alt="Termales Santa Rosa" />
                <img src="https://res.cloudinary.com/dfznn7pui/image/upload/v1761268360/Termales_Santa_Rosa_de_Cabal_e3qiaf.jpg"className='imagen-movil' />
            </div>
            <div className="titulo">
                <strong> <h1>IGLESIA</h1>
                <h2 className='subtitulo'>de la Milagrosa</h2></strong>
            </div>
            <div className='texto'>
                <p>
                Es un espacio lleno de fe, historia y serenidad. Su diseño sencillo, pero simbólico, la convierte en un sitio especial para la reflexión y la oración. Ubicada en un sector tranquilo del municipio, es visitada tanto por habitantes locales como por turistas que buscan conocer más sobre la espiritualidad del pueblo. Su interior conserva un ambiente acogedor que invita a la paz y al recogimiento. Representa una parte importante del patrimonio religioso de Santa Rosa de Cabal.
                </p>
            </div>


        </>
    );

};

export default Pagina4;
