import { useState, type FormEvent } from 'react';
import './App.css';

interface Errors {
  guestName?: boolean;
  numberOfPeople?: boolean;
  checkInDate?: boolean;
  checkOutDate?: boolean;
  phoneNumber?: boolean;
  roomType?: boolean;
}

function App() {
  const [guestName, setGuestName] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [roomType, setRoomType] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Errors = {};

    if (!guestName.trim()) newErrors.guestName = true;
    if (!numberOfPeople) newErrors.numberOfPeople = true;
    if (!checkInDate) newErrors.checkInDate = true;
    if (!checkOutDate) newErrors.checkOutDate = true;
    if (!phoneNumber.trim()) newErrors.phoneNumber = true;
    if (!roomType) newErrors.roomType = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('¡Reserva enviada con éxito!');
      // Reset form
      setGuestName('');
      setNumberOfPeople('');
      setCheckInDate('');
      setCheckOutDate('');
      setPhoneNumber('');
      setRoomType('');
      setErrors({});
    }
  };

  return (
    <div className="App">
      <form className="booking-form" onSubmit={handleSubmit} noValidate>
        <h1>Pre - reserva</h1>
        <div className="form-group">
          <label htmlFor="guestName">Nombre y apellido:</label>
          <input
            type="text"
            id="guestName"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className={errors.guestName ? 'error' : ''}
          />
        </div>
        <div className="form-group">
          <label htmlFor="numberOfPeople">Número de personas:</label>
          <input
            type="number"
            id="numberOfPeople"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
            className={errors.numberOfPeople ? 'error' : ''}
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
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Celular:</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={errors.phoneNumber ? 'error' : ''}
          />
        </div>
        <div className="form-group">
          <label htmlFor="roomType">Habitación:</label>
          <select
            id="roomType"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className={errors.roomType ? 'error' : ''}
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
    </div>
  );
}

export default App;
