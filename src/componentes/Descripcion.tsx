import './Descripcion.css';

const Descripcion = () => {
  return (
    <div className="descripcion-container">
      <div className="descripcion-imagen">
        <img src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Descripción" />
      </div>
      <div className="descripcion-texto">
        <h2> <strong>Destino familiar</strong> en el eje cafetero</h2>
        <p>
        En <strong>Turquesa Hostal</strong>, creemos que viajar debe sentirse tan reconfortante como volver a casa. Somos un hostal de descanso familiar, sano y sereno, diseñado para que recargues energías <strong>en el corazón del Paisaje Cultural Cafetero</strong>.
        Aquí, la tranquilidad es nuestra promesa. Desconecta del ruido, <strong>conecta con los tuyos</strong> y vive una experiencia de paz total. Reserva tu estadía y descubre tu <strong>"hogar"</strong> en Santa Rosa de Cabal.
        </p>
      </div>
    </div>
  );
};

export default Descripcion;
