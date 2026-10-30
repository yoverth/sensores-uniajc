import { useWindowDimensions } from 'react-native';

/* =========================================================
   HOOK: DIMENSIONES Y ORIENTACIÓN DEL DISPOSITIVO

   - esMovil:     el equipo es un teléfono (lado corto < 600).
   - esHorizontal: la pantalla está en horizontal (ancho > alto).
   - apilado:     disposición vertical compacta (solo en retrato
                  de teléfono); en horizontal nunca se apila,
                  porque falta alto y sobra ancho.
   - columnas:    1 columna < 600 px, 2 entre 600 y 899 px,
                  3 desde 900 px (requisito de la vista adaptativa).
========================================================= */

export default function useDispositivo() {
  const { width, height } = useWindowDimensions();

  const esMovil = Math.min(width, height) < 600;
  const esHorizontal = width > height;
  const apilado = esMovil && !esHorizontal;
  const columnas = width < 600 ? 1 : width < 900 ? 2 : 3;

  return { width, height, esMovil, esHorizontal, apilado, columnas };
}
