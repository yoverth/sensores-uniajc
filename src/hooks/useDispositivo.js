import { useWindowDimensions } from 'react-native';

/* =========================================================
   HOOK: DIMENSIONES Y ORIENTACIÓN DEL DISPOSITIVO

   - esMovil:     el equipo es un teléfono (lado corto < 600).
   - esHorizontal: la pantalla está en horizontal (ancho > alto).
   - apilado:     disposición vertical compacta (solo en retrato
                  de teléfono); en horizontal nunca se apila,
                  porque falta alto y sobra ancho.
   - columnas:    columnas de la lista adaptativa según el ancho.
========================================================= */

export default function useDispositivo() {
  const { width, height } = useWindowDimensions();

  const esMovil = Math.min(width, height) < 600;
  const esHorizontal = width > height;
  const apilado = esMovil && !esHorizontal;
  const columnas = width >= 1100 ? 3 : width >= 720 ? 2 : 1;

  return { width, height, esMovil, esHorizontal, apilado, columnas };
}
