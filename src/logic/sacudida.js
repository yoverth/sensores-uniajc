/* =========================================================
   DETECCIÓN DE SACUDIDAS (función pura, sin React Native)

   El acelerómetro entrega valores en g (1 g = gravedad).
   En reposo la magnitud ronda 1; una sacudida real supera
   el umbral varias veces.
========================================================= */

export function magnitudAceleracion({ x = 0, y = 0, z = 0 } = {}) {
  return Math.sqrt(x * x + y * y + z * z);
}

export function estadoInicialDetector() {
  return { pico: 0, muestrasAltas: 0, ultimoDisparo: 0 };
}

/*
  Devuelve:
  - estado: nuevo estado del detector (inmutable)
  - disparo: true cuando la sacudida es válida
  - magnitud: lectura actual
  - pico: máximo alcanzado desde el último disparo

  `muestrasRequeridas` exige varias lecturas seguidas por encima
  del umbral: así una vibración aislada no entrega un premio.
*/
export function evaluarLectura(estado, lectura, ahora, opciones) {
  const { umbral, enfriamientoMs = 2500, muestrasRequeridas = 2 } = opciones;

  const magnitud = magnitudAceleracion(lectura);
  const pico = Math.max(estado.pico, magnitud);
  const muestrasAltas = magnitud >= umbral ? estado.muestrasAltas + 1 : 0;
  const enEspera = ahora - estado.ultimoDisparo < enfriamientoMs;

  const disparo = !enEspera && muestrasAltas >= muestrasRequeridas;

  return {
    estado: {
      pico: disparo ? 0 : pico,
      muestrasAltas: disparo ? 0 : muestrasAltas,
      ultimoDisparo: disparo ? ahora : estado.ultimoDisparo,
    },
    disparo,
    magnitud,
    pico,
  };
}
