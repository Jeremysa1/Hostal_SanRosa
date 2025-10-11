import CarruselHabitaciones from './componentes/CarruselHabitaciones';
import FranjaIconos from './componentes/FranjaIconos';
import './App.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <div className="App">
      <FranjaIconos />
      <CarruselHabitaciones />
    </div>
  );
}

export default App;
