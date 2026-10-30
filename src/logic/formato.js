/* =========================================================
   FORMATO DE VALORES
========================================================= */

/* Formatea pesos colombianos sin decimales: 58000 -> "$58.000".
   Se hace a mano para que el resultado sea idéntico en Android,
   iOS y web (no depende de Intl). */
export function formatearCOP(valor) {
  const numero = Math.max(0, Math.round(Number(valor) || 0));
  return '$' + numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatearFecha(iso) {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return '';

  const dos = (n) => String(n).padStart(2, '0');
  return `${dos(fecha.getDate())}/${dos(
    fecha.getMonth() + 1
  )}/${fecha.getFullYear()} · ${dos(fecha.getHours())}:${dos(
    fecha.getMinutes()
  )}`;
}

export function formatearCantidad(cantidad) {
  return cantidad === 1 ? '1 unidad' : `${cantidad} unidades`;
}
