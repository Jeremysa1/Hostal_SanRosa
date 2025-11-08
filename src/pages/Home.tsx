import CarruselInicio from '../componentes/CarruselInicio';
import Descripcion from '../componentes/Descripcion';
import FranjaIconos from '../componentes/FranjaIconos';
import CarruselHabitaciones from '../componentes/CarruselHabitaciones';
import Mapa from '../componentes/MapaInicio';

export default function Home() {
  return (
    <>
      <CarruselInicio />
      <Descripcion />
      <FranjaIconos />
      <CarruselHabitaciones />
      <Mapa />
    </>
  );
}
