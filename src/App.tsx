
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
        subtitle: "FAMILIAR",
        description: "Perfecta para familias o grupos pequeños.",
        rating: 3,
        services: ["Wi-Fi", "Agua caliente"]
      },
      {
        imageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760064532/habitacion_3_tyjjyj.png",
        detailImageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760068140/pop_3_twmie0.png",
        title: "Habitación",
        subtitle: "DOBLE",
        description: "Diseñada para parejas o viajeros que buscan comodidad.",
        rating: 4,
        services: ["Wi-Fi", "Agua caliente", "Televisión", "Mesa de trabajo"]
      },
      {
        imageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760064532/habitacion_4_xxw1ne.png",
        detailImageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760068141/pop_4_rmiegd.png",
        title: "Habitación",
        subtitle: "FAMILIAR",
        description: "Amplia y cómoda, ideal para grupos grandes.",
        rating: 2,
        services: ["Wi-Fi", "Agua caliente", "Sofá cama", "Closet" ]
      },
      {
        imageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760064532/habitacion_1_c2dcmu.png",
        detailImageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760068139/pop_1_y8szeq.png",
        title: "Habitación",
        subtitle: "TRIPLE",
        description: "Espacio funcional y tranquilo, ideal para amigos o familias pequeñas.",
        rating: 3,
        services: ["Wi-Fi", "Agua caliente" ]
      },
      {
        imageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760064532/habitacion_5_jb3zxx.png",
        detailImageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760068142/pop_6_oepcso.png", 
        title: "Habitación",
        subtitle: "DOBLE",
        description: "Acogedora y práctica, perfecta para descansar después de un día de viaje.",
        rating: 4,
        services: ["Wi-Fi", "Agua caliente" ]
      },
      {
        imageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760064533/habitacion_7_onpc4d.png",
        detailImageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760068143/pop_7_wnj3v0.png",
        title: "Habitación",
        subtitle: "SUITE",
        description: "Nuestra habitación más completa, ideal para quienes buscan mayor confort.",
        rating: 5,
        services: ["Wi-Fi", "Sofá cama", "Agua caliente", "Repisa", "Televisión", "Mesa de trabajo" ]
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
