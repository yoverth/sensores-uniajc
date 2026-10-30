/* =========================================================
   REGLAS DE LAS PROMOCIONES DE «AGITA Y GANA»

   Todo se resuelve en el dispositivo (demostración local).
   Con un backend real, el premio y el porcentaje deben
   validarse en el servidor al confirmar el pedido.
========================================================= */

export const PROMOCIONES = [
  {
    porcentaje: 5,
    minimo: 0,
    titulo: '5% de descuento',
    descripcion: 'Válido en cualquier compra.',
  },
  {
    porcentaje: 10,
    minimo: 40000,
    titulo: '10% de descuento',
    descripcion: 'Compra mínima de $40.000.',
  },
  {
    porcentaje: 15,
    minimo: 80000,
    titulo: '15% de descuento',
    descripcion: 'Compra mínima de $80.000.',
  },
];

/* Minutos que dura el cupón desde que se gana. */
export const VIGENCIA_MINUTOS = 15;

/* Segundos de espera entre intentos. */
export const ESPERA_ENTRE_INTENTOS_S = 8;

/* Umbrales de aceleración (en g) que puede elegir el cliente. */
export const UMBRALES = [
  { valor: 1.8, etiqueta: 'Suave' },
  { valor: 2.2, etiqueta: 'Normal' },
  { valor: 2.8, etiqueta: 'Fuerte' },
];

export const UMBRAL_DEFECTO = 2.2;

/* Enfriamiento del detector: evita premios repetidos seguidos. */
export const ENFRIAMIENTO_MS = 2500;
