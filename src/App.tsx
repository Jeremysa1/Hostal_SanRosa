import CarruselHabitaciones from './componentes/CarruselHabitaciones';
import FranjaIconos from './componentes/FranjaIconos';
import Menu from './componentes/Menu';
import Descripcion from './componentes/Descripcion';
import Footer from './componentes/Footer';
import Mapa from './componentes/Mapa';
import CarruselInicio from './componentes/CarruselInicio';
import './App.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


function App() {
  return (
    <div className="App">
      <Menu />
      <CarruselInicio />
      <Descripcion />
      <FranjaIconos />
      <CarruselHabitaciones />
      <Mapa />
      <Footer />
    </div>
  );
}

export default App;
