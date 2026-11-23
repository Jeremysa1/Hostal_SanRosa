import CarruselInicio from '../componentes/inicio/CarruselInicio';
import Descripcion from '../componentes/inicio/Descripcion';
import FranjaIconos from '../componentes/comunes/FranjaIconos';
import CarruselHabitaciones from '../componentes/inicio/CarruselHabitaciones';
import MapaInicio from '../componentes/inicio/MapaInicio';
import { caracteristicasDestacadas } from '../data/hostal';

function Inicio() {
  return (
    <>
      <CarruselInicio />
      <Descripcion />
      <FranjaIconos items={caracteristicasDestacadas} />
      <CarruselHabitaciones />
      <MapaInicio />
    </>
  );
}

export default Inicio;
