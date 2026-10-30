import { PROMOCIONES, VIGENCIA_MINUTOS } from '../data/promociones';
import { formatearCOP } from './formato';

/* =========================================================
   LÓGICA DE PROMOCIONES
   Funciones puras y fáciles de mover a un backend.
========================================================= */

let contador = 0;

export function reglaPorPorcentaje(porcentaje) {
  return (
    PROMOCIONES.find((promo) => promo.porcentaje === porcentaje) || PROMOCIONES[0]
  );
}

/* Elige el premio según la fuerza real de la sacudida.
   Una sacudida más intensa mejora las probabilidades del 10% y 15%. */
export function premioParaSacudida(pico, umbral, aleatorio = Math.random) {
  if (!Number.isFinite(pico) || !Number.isFinite(umbral)) return null;
  if (pico < umbral) return null;

  const tirada = aleatorio();

  if (pico >= umbral + 0.9) {
    if (tirada < 0.35) return 15;
    if (tirada < 0.75) return 10;
    return 5;
  }

  if (pico >= umbral + 0.4) {
    if (tirada < 0.12) return 15;
    if (tirada < 0.55) return 10;
    return 5;
  }

  return tirada < 0.05 ? 10 : 5;
}

export function crearPromocion(porcentaje, ahora = Date.now()) {
  const regla = reglaPorPorcentaje(porcentaje);
  contador += 1;

  return {
    id: `promo-${ahora}-${contador}`,
    porcentaje: regla.porcentaje,
    minimo: regla.minimo,
    titulo: regla.titulo,
    descripcion: regla.descripcion,
    expiraEn: ahora + VIGENCIA_MINUTOS * 60000,
    origen: 'local-demo',
    usos: 1,
  };
}

export function promocionVigente(promo, ahora = Date.now()) {
  if (!promo || !Number.isFinite(promo.expiraEn)) return false;
  return promo.expiraEn > ahora;
}

export function minutosRestantes(promo, ahora = Date.now()) {
  if (!promo) return 0;
  return Math.max(0, Math.ceil((promo.expiraEn - ahora) / 60000));
}

/* Comprueba si el cupón puede aplicarse al carrito actual.
   Devuelve un motivo legible cuando no se puede. */
export function puedeAplicar(promo, subtotal, ahora = Date.now()) {
  if (!promo) {
    return { ok: false, motivo: 'No tienes una promoción activa.' };
  }

  if (!promocionVigente(promo, ahora)) {
    return {
      ok: false,
      motivo: 'La promoción venció. Agita de nuevo para conseguir otra.',
    };
  }

  if (subtotal < promo.minimo) {
    return {
      ok: false,
      motivo: `Te faltan ${formatearCOP(
        promo.minimo - subtotal
      )} en el carrito para usar este cupón.`,
    };
  }

  return { ok: true, motivo: '' };
}
