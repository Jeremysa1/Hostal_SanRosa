import type { Cama } from '../types';

/** Formas plurales de los tipos de cama conocidos. */
const PLURALES: Record<string, string> = {
  'cama individual': 'camas individuales',
  'cama doble': 'camas dobles',
  'sofá cama': 'sofás cama',
};

/** "1 cama doble", "3 camas dobles", "2 sofás cama"... */
export function describirCama({ type, count }: Cama): string {
  if (count === 1) return `1 ${type}`;

  const singular = Object.keys(PLURALES).find((clave) => type.includes(clave));
  const plural = singular ? type.replace(singular, PLURALES[singular]) : `${type}s`;
  return `${count} ${plural}`;
}

export function pluralizar(cantidad: number, singular: string, plural: string): string {
  return cantidad === 1 ? singular : plural;
}
