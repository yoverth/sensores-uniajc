import { promocionVigente } from './promociones';

/* =========================================================
   CARRITO · funciones puras

   Los ítems guardan una copia del precio y del stock para que
   el total del pedido no cambie si el catálogo se edita después.
========================================================= */

export const ENVIO_DOMICILIO = 6000;
export const ENVIO_GRATIS_DESDE = 80000;

export function agregarAlCarrito(items, producto, cantidad = 1) {
  const stock = Number.isFinite(producto.stock) ? producto.stock : 0;

  if (!producto.disponible || stock <= 0) {
    return { items, error: `${producto.nombre} está agotado.` };
  }

  const existente = items.find((item) => item.productoId === producto.id);

  if (existente) {
    const nuevaCantidad = existente.cantidad + cantidad;

    if (nuevaCantidad > stock) {
      return {
        items,
        error: `Solo hay ${stock} unidades de ${producto.nombre}.`,
      };
    }

    return {
      items: items.map((item) =>
        item.productoId === producto.id
          ? { ...item, cantidad: nuevaCantidad }
          : item
      ),
      error: null,
    };
  }

  if (cantidad > stock) {
    return {
      items,
      error: `Solo hay ${stock} unidades de ${producto.nombre}.`,
    };
  }

  return {
    items: [
      ...items,
      {
        productoId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        stock,
        cantidad,
      },
    ],
    error: null,
  };
}

/* delta = +1 o -1. Nunca baja de 1 ni supera el stock. */
export function cambiarCantidad(items, productoId, delta) {
  return items.map((item) => {
    if (item.productoId !== productoId) return item;

    const nueva = Math.min(Math.max(item.cantidad + delta, 1), item.stock);
    return nueva === item.cantidad ? item : { ...item, cantidad: nueva };
  });
}

export function eliminarDelCarrito(items, productoId) {
  return items.filter((item) => item.productoId !== productoId);
}

export function contarUnidades(items) {
  return items.reduce((total, item) => total + item.cantidad, 0);
}

/* Calcula subtotal, descuento, envío y total.
   El descuento nunca puede superar el subtotal y el total nunca
   queda negativo. */
export function calcularResumen(items, promocion, tipoEntrega = 'recoger') {
  const subtotal = items.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  let descuento = 0;
  let promoAplicada = false;
  let promoPendiente = null;

  if (promocion) {
    if (!promocionVigente(promocion)) {
      promoPendiente = null;
    } else if (subtotal < promocion.minimo) {
      promoPendiente = promocion.minimo - subtotal;
    } else {
      const calculado = Math.round((subtotal * promocion.porcentaje) / 100);
      descuento = Math.min(calculado, subtotal);
      promoAplicada = descuento > 0;
    }
  }

  const base = subtotal - descuento;
  const envio =
    tipoEntrega === 'domicilio' && base > 0 && base < ENVIO_GRATIS_DESDE
      ? ENVIO_DOMICILIO
      : 0;

  const total = Math.max(0, base + envio);

  return {
    subtotal,
    descuento,
    envio,
    total,
    promoAplicada,
    promoPendiente,
    unidades: contarUnidades(items),
  };
}
