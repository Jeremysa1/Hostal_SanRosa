import './Descripcion.css';

const Descripcion = () => {
  return (
    <div className="descripcion-container">
      <div className="descripcion-imagen">
        <img src="https://res.cloudinary.com/dfznn7pui/image/upload/v1762430793/habitacion_1_rbtxef.jpg" />
      </div>
      <div className="descripcion-texto">
        <h2> <strong>DESTINO FAMILIAR</strong> en el eje cafetero</h2>
        <p>
        En <strong>Turquesa Hostal</strong>, creemos que viajar debe sentirse tan reconfortante como volver a casa. Somos un hostal de descanso familiar, sano y sereno, diseñado para que recargues energías <strong>en el corazón del Paisaje Cultural Cafetero</strong>.
        Aquí, la tranquilidad es nuestra promesa. Desconecta del ruido, <strong>conecta con los tuyos</strong> y vive una experiencia de paz total. Reserva tu estadía y descubre tu <strong>"hogar"</strong> en Santa Rosa de Cabal.
        </p>
      </div>
    </div>
  );
};

export default Descripcion;
