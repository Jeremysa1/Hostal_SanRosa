import { useState } from 'react';
import { TarjetaHabitacion } from '../componentes/habitaciones/TarjetaHabitacion';
import { DetalleHabitacion } from '../componentes/habitaciones/DetalleHabitacion';
import { habitaciones } from '../data/habitaciones';
import type { Habitacion } from '../types';
import './Habitaciones.css';
import EspaciosComunes from '../componentes/habitaciones/EspaciosComunes';
// El orden importa: el tema de PrimeReact debe cargarse después de los estilos
// propios de esta página para conservar la cascada CSS original.
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

function Habitaciones() {
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<Habitacion | null>(null);

  return (
    <>
      <EspaciosComunes />
      <div className="content-wrapper">
        <div className="grid p-5">
          {habitaciones.map((habitacion) => (
            <div key={habitacion.id} className="col-12 md:col-6 lg:col-4">
              <TarjetaHabitacion habitacion={habitacion} onVerMas={() => setHabitacionSeleccionada(habitacion)} />
            </div>
          ))}
          {habitacionSeleccionada && (
            <DetalleHabitacion
              habitacion={habitacionSeleccionada}
              visible
              onHide={() => setHabitacionSeleccionada(null)}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Habitaciones;
