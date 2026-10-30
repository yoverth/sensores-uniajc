/* =========================================================
   CATÁLOGO COMERCIAL · PASTELERÍA LA T

   Este archivo es SOLO para la tienda. Los 120 productos de
   demostración del laboratorio viven en `productos.js` y no se
   mezclan con el catálogo real.
========================================================= */

const imagenes = {
  chocolate: require('../../assets/productos/torta-chocolate.jpg'),
  tresLeches: require('../../assets/productos/torta-tres-leches.jpg'),
  vainilla: require('../../assets/productos/torta-vainilla.jpg'),
  cheesecakeFrutosRojos: require('../../assets/productos/cheesecake-frutos-rojos.jpg'),
  cheesecakeMaracuya: require('../../assets/productos/cheesecake-maracuya.jpg'),
  cupcakeVainilla: require('../../assets/productos/cupcake-vainilla.jpg'),
  cupcakeChocolate: require('../../assets/productos/cupcake-chocolate.jpg'),
  brownie: require('../../assets/productos/brownie.jpg'),
  galletas: require('../../assets/productos/galletas-chispas.jpg'),
  milhojas: require('../../assets/productos/milhojas.jpg'),
  donas: require('../../assets/productos/donas.jpg'),
  flan: require('../../assets/productos/flan.jpg'),
  cafe: require('../../assets/productos/cafe.jpg'),
  jugo: require('../../assets/productos/jugo-maracuya.jpg'),
};

export const CATEGORIAS = [
  { id: 'todas', nombre: 'Todas', icono: '✨' },
  { id: 'tortas', nombre: 'Tortas', icono: '🎂' },
  { id: 'cheesecakes', nombre: 'Cheesecakes', icono: '🍰' },
  { id: 'cupcakes', nombre: 'Cupcakes', icono: '🧁' },
  { id: 'brownies', nombre: 'Brownies', icono: '🍫' },
  { id: 'galletas', nombre: 'Galletas', icono: '🍪' },
  { id: 'postres', nombre: 'Postres', icono: '🍮' },
  { id: 'bebidas', nombre: 'Bebidas', icono: '☕' },
];

/* Precios de ejemplo en COP, editables.
   `stock` es la existencia disponible en esta demostración. */
export const PRODUCTOS = [
  {
    id: 'torta-chocolate',
    nombre: 'Torta de chocolate',
    descripcion: 'Bizcocho húmedo de cacao con ganache semiamargo.',
    categoria: 'tortas',
    precio: 58000,
    stock: 8,
    disponible: true,
    etiqueta: 'Más vendida',
    imagen: imagenes.chocolate,
  },
  {
    id: 'torta-tres-leches',
    nombre: 'Torta tres leches',
    descripcion: 'Esponjoso bizcocho bañado en tres leches con durazno.',
    categoria: 'tortas',
    precio: 62000,
    stock: 6,
    disponible: true,
    imagen: imagenes.tresLeches,
  },
  {
    id: 'torta-vainilla',
    nombre: 'Torta de vainilla y fresas',
    descripcion: 'Capas de vainilla, crema chantilly y fresas frescas.',
    categoria: 'tortas',
    precio: 55000,
    stock: 5,
    disponible: true,
    etiqueta: 'Nueva',
    imagen: imagenes.vainilla,
  },
  {
    id: 'cheesecake-frutos-rojos',
    nombre: 'Cheesecake de frutos rojos',
    descripcion: 'Base crocante de galleta, queso crema y coulis de mora.',
    categoria: 'cheesecakes',
    precio: 68000,
    stock: 4,
    disponible: true,
    etiqueta: 'Favorita',
    imagen: imagenes.cheesecakeFrutosRojos,
  },
  {
    id: 'cheesecake-maracuya',
    nombre: 'Cheesecake de maracuyá',
    descripcion: 'Cremosidad de queso con salsa ácida de maracuyá.',
    categoria: 'cheesecakes',
    precio: 65000,
    stock: 3,
    disponible: true,
    imagen: imagenes.cheesecakeMaracuya,
  },
  {
    id: 'cupcake-vainilla',
    nombre: 'Cupcake de vainilla',
    descripcion: 'Vainilla con buttercream suizo y azúcar perlada.',
    categoria: 'cupcakes',
    precio: 6500,
    stock: 24,
    disponible: true,
    imagen: imagenes.cupcakeVainilla,
  },
  {
    id: 'cupcake-chocolate',
    nombre: 'Cupcake de chocolate',
    descripcion: 'Chocolate intenso con crema de cacao y sprinkles.',
    categoria: 'cupcakes',
    precio: 6500,
    stock: 20,
    disponible: true,
    imagen: imagenes.cupcakeChocolate,
  },
  {
    id: 'brownie',
    nombre: 'Brownie de chocolate',
    descripcion: 'Húmedo por dentro, cubierto con chocolate brillante.',
    categoria: 'brownies',
    precio: 8500,
    stock: 15,
    disponible: true,
    etiqueta: 'Recomendado',
    imagen: imagenes.brownie,
  },
  {
    id: 'galletas-chispas',
    nombre: 'Galletas con chispas (x6)',
    descripcion: 'Seis galletas artesanales con chispas de chocolate.',
    categoria: 'galletas',
    precio: 12000,
    stock: 18,
    disponible: true,
    imagen: imagenes.galletas,
  },
  {
    id: 'milhojas',
    nombre: 'Milhojas de arequipe',
    descripcion: 'Hojaldre crujiente relleno de arequipe y crema.',
    categoria: 'postres',
    precio: 9500,
    stock: 10,
    disponible: true,
    imagen: imagenes.milhojas,
  },
  {
    id: 'donas',
    nombre: 'Donas glaseadas',
    descripcion: 'Dona esponjosa con glaseado de chocolate y sprinkles.',
    categoria: 'postres',
    precio: 5500,
    stock: 22,
    disponible: true,
    imagen: imagenes.donas,
  },
  {
    id: 'flan',
    nombre: 'Flan de caramelo',
    descripcion: 'Flan casero de vainilla con caramelo líquido.',
    categoria: 'postres',
    precio: 7000,
    stock: 12,
    disponible: true,
    imagen: imagenes.flan,
  },
  {
    id: 'cafe',
    nombre: 'Café capuchino',
    descripcion: 'Espresso doble con leche espumada y cacao.',
    categoria: 'bebidas',
    precio: 4500,
    stock: 40,
    disponible: true,
    imagen: imagenes.cafe,
  },
  {
    id: 'jugo-maracuya',
    nombre: 'Jugo de maracuyá',
    descripcion: 'Jugo natural de maracuyá servido bien frío.',
    categoria: 'bebidas',
    precio: 7500,
    stock: 25,
    disponible: true,
    imagen: imagenes.jugo,
  },
];

export function nombreCategoria(id) {
  const encontrada = CATEGORIAS.find((c) => c.id === id);
  return encontrada ? encontrada.nombre : id;
}

/* Búsqueda + filtro usados por la tienda (función pura). */
export function filtrarProductos(lista, { texto = '', categoria = 'todas' } = {}) {
  const consulta = texto.trim().toLowerCase();

  return lista.filter((producto) => {
    if (categoria !== 'todas' && producto.categoria !== categoria) return false;
    if (!consulta) return true;

    const contenido =
      `${producto.nombre} ${producto.descripcion} ${nombreCategoria(
        producto.categoria
      )}`.toLowerCase();

    return contenido.includes(consulta);
  });
}
