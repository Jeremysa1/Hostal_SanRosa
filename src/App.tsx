import { useState } from 'react';
import './App.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { CustomCard } from './componentes/CustomCard.tsx';
import { RoomDetail } from './componentes/RoomDetail.tsx';

function App() {
    // --- ESTADO DEL COMPONENTE ---
    // selectedRoom: Almacena la habitación que el usuario ha seleccionado. Si es null, no se muestra ninguna ventana emergente.
    const [selectedRoom, setSelectedRoom] = useState<any>(null);

    // --- DATOS DE LAS TARJETAS ---
    // Este es un array de objetos, donde cada objeto representa una tarjeta de habitación.
    // Cada objeto contiene la información que se mostrará en la tarjeta y en la ventana emergente.
    const cardData = [
      {
        imageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760064533/habitacion_9_mhcbqn.png", // URL de la imagen para la tarjeta.
        detailImageUrl: "https://res.cloudinary.com/dfznn7pui/image/upload/v1760068145/pop_9_ilwxua.png", // URL de la imagen para la ventana emergente.
        title: "Habitación", // Título principal.
        subtitle: "DOBLE", // Subtítulo (tipo de habitación).
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.", // Descripción corta.
        rating: 3 // Calificación (de 1 a 5).
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
        // URL de la imagen de detalle corregida para que coincida con el diseño final.
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

    // --- RENDERIZADO DEL COMPONENTE ---
    return (
      // Contenedor principal con una cuadrícula (grid) y un padding.
      <div className="grid p-5">
        {/* Mapea los datos de las tarjetas para renderizar cada componente Card. */}
        {cardData.map((data, index) => (
          // Define el tamaño de la columna en la cuadrícula.
          <div key={index} className="col-12 md:col-6 lg:col-4">
            {/* Renderiza el componente Card con los datos y la función para manejar el clic. */}
            <CustomCard {...data} onCardClick={() => setSelectedRoom(data)} />
          </div>
        ))}

        {/* Renderiza la ventana emergente (RoomDetail) solo si hay una habitación seleccionada. */}
        {selectedRoom && (
          <RoomDetail room={selectedRoom} visible={selectedRoom !== null} onHide={() => setSelectedRoom(null)} />
        )}
      </div>
    );
}

export default App;
