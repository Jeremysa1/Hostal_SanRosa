import { postJson } from './api';

/** Datos que espera POST /api/pre-reserva/ (nombres en camelCase por contrato). */
export interface PreReservaData {
  guestName: string;
  phoneNumber: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfPeople: number;
  roomType: string;
}

/** Envía la pre-reserva y devuelve el enlace de WhatsApp generado por el backend. */
export async function enviarPreReserva(data: PreReservaData): Promise<string> {
  const respuesta = await postJson<{ whatsapp_url: string }>(
    '/pre-reserva/',
    data,
    'Error en el envío de la pre-reserva',
  );
  return respuesta.whatsapp_url;
}
