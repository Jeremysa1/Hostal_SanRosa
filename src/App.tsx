
import { useState } from 'react';
import './App.css';
import { CustomCard } from './componentes/CustomCard.tsx';
import { RoomDetail } from './componentes/RoomDetail.tsx';
import Menu from './componentes/Menu.tsx';
import FranjaIconos from './componentes/FranjaIconos.tsx';
import Footer from './componentes/Footer.tsx';
import { cardData } from './componentes/infoRooms.tsx';

function App() {
    const [selectedRoom, setSelectedRoom] = useState<any>(null);

    return (
      <>
        <Menu />
        <FranjaIconos />
        <div className="content-wrapper">
          <div className="grid p-5">
            {cardData.map((data, index) => (
              <div key={index} className="col-12 md:col-6 lg:col-4">
                <CustomCard {...data} onCardClick={() => setSelectedRoom(data)} />
              </div>
            ))

            }

            {selectedRoom && (
              <RoomDetail room={selectedRoom} visible={selectedRoom !== null} onHide={() => setSelectedRoom(null)} />
            )}
          </div>
        </div>
        <Footer />
      </>
    );
}

export default App;
