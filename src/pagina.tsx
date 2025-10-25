import './pagina.css';

const Pagina = () => {
    return (
        <>
            <div className="Pagina-imagen">
                <img src="https://res.cloudinary.com/dfznn7pui/image/upload/v1761353648/Termales_Santa_Rosa_de_Cabal_e3qiaf_viqdrk.jpg"className='imagen-escritorio' alt="Termales Santa Rosa" />
                <img src="https://res.cloudinary.com/dfznn7pui/image/upload/v1761268360/Termales_Santa_Rosa_de_Cabal_e3qiaf.jpg"className='imagen-movil' />
            </div>
            <div className="titulo">
                <strong> <h1>TERMALES</h1>
                <h2 className='subtitulo'>Santa Rosa de Cabal</h2></strong>
            </div>
            <div className='texto'>
                <p>
                Son uno de los lugares más reconocidos del Eje Cafetero, ideales para disfrutar de un descanso total en medio de la naturaleza. Sus aguas termales brotan de la montaña y forman cascadas que crean un paisaje único y relajante. El sonido del agua y el aire fresco de las montañas hacen de este sitio un refugio perfecto para desconectarse del ritmo diario. Además, cuenta con zonas de spa, hotel y senderos ecológicos que completan una experiencia inolvidable.
                </p>
                <button className="boton">RESERVA</button>
            </div>


        </>
    );

};

export default Pagina;
