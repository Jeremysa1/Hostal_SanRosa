import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Formulario.css';
import logo from '../assets/LOGO-HOSTAL.svg';
import { enviarPreReserva } from "../services/reservas";


interface Errors {
  guestName?: boolean;
  numberOfPeople?: boolean;
  checkInDate?: boolean;
  checkOutDate?: boolean;
  phoneNumber?: boolean;
  roomType?: boolean;
}


function Formulario() {
  const [guestName, setGuestName] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [roomType, setRoomType] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();


  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setNumberOfPeople(value);
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhoneNumber(value);
  };

  const handleCloseSuccess = () => {
    setIsClosing(true);
    const ANIM_MS = 260; // debe coincidir con CSS transition-duration
    setTimeout(() => {
      setShowSuccess(false);
      setIsClosing(false);
      // Reset form
      setGuestName('');
      setNumberOfPeople('');
      setCheckInDate('');
      setCheckOutDate('');
      setPhoneNumber('');
      setRoomType('');
      setErrors({});
      navigate('/');
    }, ANIM_MS);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Errors = {};

    if (!guestName.trim()) newErrors.guestName = true;
    if (!numberOfPeople || isNaN(Number(numberOfPeople))) newErrors.numberOfPeople = true;
    if (!checkInDate) newErrors.checkInDate = true;
    if (!checkOutDate) newErrors.checkOutDate = true;
    if (!phoneNumber.trim() || !/^[0-9]+$/.test(phoneNumber)) newErrors.phoneNumber = true;
    if (!roomType) newErrors.roomType = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const data = {
      guestName,
      phoneNumber,
      checkInDate,
      checkOutDate,
      numberOfPeople: Number(numberOfPeople),
      roomType,
    };

    try {
      const whatsapp_url = await enviarPreReserva(data);
      window.open(whatsapp_url, "_blank");
    } catch (error) {
      console.error(error);
      alert("Hubo un problema enviando la pre-reserva. Inténtalo nuevamente.");
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
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className={errors.guestName ? 'error' : ''}
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
            value={numberOfPeople}
            onChange={handleNumberInput}
            className={errors.numberOfPeople ? 'error' : ''}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="checkInDate">Llegada:</label>
          <input
            type="date"
            id="checkInDate"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className={errors.checkInDate ? 'error' : ''}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="checkOutDate">Salida:</label>
          <input
            type="date"
            id="checkOutDate"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className={errors.checkOutDate ? 'error' : ''}
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
            value={phoneNumber}
            onChange={handlePhoneInput}
            className={errors.phoneNumber ? 'error' : ''}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="roomType">Habitación:</label>
          <select
            id="roomType"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className={errors.roomType ? 'error' : ''}
            required
          >
            <option value="" disabled>Seleccione una habitación</option>
            <option value="doble">Doble</option>
            <option value="doble-p">Doble P</option>
            <option value="familiar">Familiar</option>
            <option value="familiar-plus">Familiar Plus</option>
            <option value="suite">Suite</option>
            <option value="triple">Triple</option>
          </select>
        </div>
        <button type="submit">Reservar</button>
      </form>
      {showSuccess && (
        <div className={`modal-overlay ${isClosing ? 'closing' : 'show'}`} role="dialog" aria-modal="true">
          <div className={`modal-box ${isClosing ? 'closing' : 'show'}`}>
            <button className="modal-close" onClick={handleCloseSuccess} aria-label="Cerrar modal">×</button>
            <div className="modal-body">
              <h2>Formulario enviado</h2>
              <p>Gracias, tu pre-reserva fue enviada correctamente.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

  export default Formulario;
