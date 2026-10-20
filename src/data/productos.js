/* =========================================================
   CONFIGURACIÓN
========================================================= */

export const TOTAL_PRODUCTOS = 120;

/* =========================================================
   PRODUCTOS
========================================================= */

const imagenes = [
  'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=500',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500',
];

export const productos = Array.from({ length: TOTAL_PRODUCTOS }, (_, index) => ({
  id: index + 1,
  nombre: `Producto ${index + 1}`,
  descripcion: 'Producto de demostración para el laboratorio',
  categoria:
    index % 3 === 0 ? 'Comida' : index % 3 === 1 ? 'Bebida' : 'Especial',
  precio: 15000 + (index % 10) * 2500,
  imagen: imagenes[index % imagenes.length],
}));
