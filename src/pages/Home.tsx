import CarruselInicio from '../componentes/CarruselInicio';
import Descripcion from '../componentes/Descripcion';
import FranjaIconos from '../componentes/FranjaIconos';
import CarruselHabitaciones from '../componentes/CarruselHabitaciones';
import Mapa from '../componentes/Mapa';

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
