export interface PreReservaData {
    guestName: string;
    phoneNumber: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfPeople: number;
    roomType: string;
}

const API_BASE = "https://hostalsanrosa-production.up.railway.app/api";

export async function enviarPreReserva(data: PreReservaData) {
    const response = await fetch(`${API_BASE}/pre-reserva/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error("Error backend:", error);
        throw new Error("Error en el envío de la pre-reserva");
    }

    return (await response.json()).whatsapp_url;
}

