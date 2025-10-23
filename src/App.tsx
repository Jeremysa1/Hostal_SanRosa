
import { useState } from 'react';
import './App.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { CustomCard } from './componentes/CustomCard.tsx';
import { RoomDetail } from './componentes/RoomDetail.tsx';
import Menu from './componentes/Menu.tsx';
import FranjaIconos from './componentes/FranjaIconos.tsx';
import Footer from './componentes/Footer.tsx';

function App() {
    const [selectedRoom, setSelectedRoom] = useState<any>(null);

    const cardData = [
      {
        imageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760064533/habitacion_9_mhcbqn.png",
        detailImageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760068145/pop_9_ilwxua.png",
        title: "Habitación",
        subtitle: "DOBLE",
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.",
        rating: 3
      },
      {
        imageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760064532/habitacion_3_tyjjyj.png",
        detailImageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760068140/pop_3_xpdf6d.png",
        title: "Habitación",
        subtitle: "PARA 3",
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.",
        rating: 4
      },
      {
        imageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760064532/habitacion_4_xxw1ne.png",
        detailImageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760068141/pop_4_rmiegd.png",
        title: "Habitación",
        subtitle: "PARA 4",
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.",
        rating: 2
      },
      {
        imageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760064532/habitacion_1_c2dcmu.png",
        detailImageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760068139/pop_1_y8szeq.png",
        title: "Habitación",
        subtitle: "PARA 5",
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.",
        rating: 3
      },
      {
        imageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760064532/habitacion_5_jb3zxx.png",
        detailImageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760068142/pop_6_oepcso.png", 
        title: "Habitación",
        subtitle: "PARA 6",
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.",
        rating: 4
      },
      {
        imageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760064533/habitacion_7_onpc4d.png",
        detailImageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760068143/pop_7_wnj3v0.png",
        title: "Habitación",
        subtitle: "SUITE",
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.",
        rating: 5
      }
    ];

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
            ))}

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
