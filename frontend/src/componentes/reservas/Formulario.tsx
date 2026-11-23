import { useState, type ChangeEvent, type FormEvent } from 'react';
import logo from '../../assets/LOGO-HOSTAL.svg';
import { opcionesHabitacion } from '../../data/habitaciones';
import { ApiError } from '../../services/api';
import { enviarPreReserva } from '../../services/reservas';
import './Formulario.css';

interface DatosFormulario {
  guestName: string;
  numberOfPeople: string;
  checkInDate: string;
  checkOutDate: string;
  phoneNumber: string;
  roomType: string;
}

type Errores = Partial<Record<keyof DatosFormulario, boolean>>;

const FORMULARIO_VACIO: DatosFormulario = {
  guestName: '',
  numberOfPeople: '',
  checkInDate: '',
  checkOutDate: '',
  phoneNumber: '',
  roomType: '',
};

const CAMPOS_NUMERICOS: (keyof DatosFormulario)[] = ['numberOfPeople', 'phoneNumber'];
const SOLO_DIGITOS = /^[0-9]+$/;
const MENSAJE_ERROR = 'Hubo un problema enviando la pre-reserva. Inténtalo nuevamente.';

function validar(datos: DatosFormulario): Errores {
  const errores: Errores = {};
  if (!datos.guestName.trim()) errores.guestName = true;
  if (!SOLO_DIGITOS.test(datos.numberOfPeople)) errores.numberOfPeople = true;
  if (!datos.checkInDate) errores.checkInDate = true;
  if (!datos.checkOutDate) errores.checkOutDate = true;
  if (!SOLO_DIGITOS.test(datos.phoneNumber)) errores.phoneNumber = true;
  if (!datos.roomType) errores.roomType = true;
  return errores;
}

/** Nombre legible de la habitación para el mensaje de WhatsApp (p. ej. "Doble Sencilla"). */
const etiquetaHabitacion = (id: string) => opcionesHabitacion.find((o) => o.id === id)?.etiqueta ?? id;

function Formulario() {
  const [datos, setDatos] = useState<DatosFormulario>(FORMULARIO_VACIO);
  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const campo = e.target.id as keyof DatosFormulario;
    const valor = CAMPOS_NUMERICOS.includes(campo) ? e.target.value.replace(/[^0-9]/g, '') : e.target.value;
    setDatos((previos) => ({ ...previos, [campo]: valor }));
  };

  const claseCampo = (campo: keyof DatosFormulario) => (errores[campo] ? 'error' : '');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    // Se abre la pestaña antes del `await`: si se abre después, los navegadores
    // (sobre todo en móvil) la bloquean como ventana emergente.
    const pestana = window.open('', '_blank');
    if (pestana) pestana.opener = null; // la página externa no puede controlar esta pestaña
    setEnviando(true);
    try {
      const whatsappUrl = await enviarPreReserva({
        ...datos,
        numberOfPeople: Number(datos.numberOfPeople),
        roomType: etiquetaHabitacion(datos.roomType),
      });
      if (pestana) {
        pestana.location.href = whatsappUrl;
      } else {
        window.location.href = whatsappUrl;
      }
    } catch (error) {
      pestana?.close();
      console.error(error);
      alert(error instanceof ApiError ? `${MENSAJE_ERROR}\n\n${error.message}` : MENSAJE_ERROR);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="formulario-container">
      <form className="booking-form" onSubmit={handleSubmit} noValidate autoComplete="off">
        <div className="title-container">
          <img src={logo} alt="Turquesa Hostal Logo" className="logo-formulario" />
          <h1>Pre - reserva</h1>
        </div>
        <div className="form-group">
          <label htmlFor="guestName">Nombre y apellido:</label>
          <input
            type="text"
            id="guestName"
            value={datos.guestName}
            onChange={handleChange}
            className={claseCampo('guestName')}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="numberOfPeople">Número de personas:</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id="numberOfPeople"
            value={datos.numberOfPeople}
            onChange={handleChange}
            className={claseCampo('numberOfPeople')}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="checkInDate">Llegada:</label>
          <input
            type="date"
            id="checkInDate"
            value={datos.checkInDate}
            onChange={handleChange}
            className={claseCampo('checkInDate')}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="checkOutDate">Salida:</label>
          <input
            type="date"
            id="checkOutDate"
            value={datos.checkOutDate}
            onChange={handleChange}
            className={claseCampo('checkOutDate')}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Celular:</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id="phoneNumber"
            value={datos.phoneNumber}
            onChange={handleChange}
            className={claseCampo('phoneNumber')}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="roomType">Habitación:</label>
          <select
            id="roomType"
            value={datos.roomType}
            onChange={handleChange}
            className={claseCampo('roomType')}
            required
          >
            <option value="" disabled>
              Seleccione una habitación
            </option>
            {opcionesHabitacion.map(({ id, etiqueta }) => (
              <option key={id} value={id}>
                {etiqueta}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={enviando}>
          Reservar
        </button>
      </form>
    </div>
  );
}

export default Formulario;
