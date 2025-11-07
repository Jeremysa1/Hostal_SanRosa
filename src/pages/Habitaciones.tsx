import { CustomCard } from '../componentes/CustomCard.tsx';
import { RoomDetail } from '../componentes/RoomDetail.tsx';
import { cardData } from '../componentes/infoRooms.tsx';
import { useState } from 'react';
import './Habitaciones.css';
import FranjaIconosHab from '../componentes/FranjaIconos-Hab';
import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primeflex/primeflex.css';                                   // css utility
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';


export default function Habitaciones() {

  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  return (
    <>
      <FranjaIconosHab />
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
    </>
  );
}
