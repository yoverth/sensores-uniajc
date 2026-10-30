/* =========================================================
   PEDIDOS · capa de datos local (demostración)

   No hay backend todavía: el pedido se arma y se devuelve al
   estado de la app. La forma del objeto ya es la que viajaría
   a una API, así que para conectar una base de datos basta con
   reemplazar el cuerpo de `crearPedido` por un fetch:

     const res = await fetch('https://mi-api/pedidos', {...})
     return await res.json()

   Importante para cuando exista backend:
   - validar allí el stock y las promociones (no confiar en el cliente);
   - no marcar el pedido como enviado a la tienda sin respuesta real;
   - no procesar pagos desde el cliente.
========================================================= */

const ESPERA_SIMULADA_MS = 450;
let consecutivo = 0;

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const dos = (numero) => String(numero).padStart(2, '0');

export function generarIdPedido(fecha = new Date(), numero = ++consecutivo) {
  return `LT-${dos(fecha.getDate())}${dos(fecha.getMonth() + 1)}-${String(
    numero
  ).padStart(4, '0')}`;
}

export async function crearPedido({ items, resumen, datos, promocion }) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('El pedido no tiene productos.');
  }

  if (!resumen || !Number.isFinite(resumen.total) || resumen.total < 0) {
    throw new Error('El total del pedido no es válido.');
  }

  /* Aquí iría la llamada real al backend. */
  await esperar(ESPERA_SIMULADA_MS);

  const ahora = new Date();

  return {
    id: generarIdPedido(ahora),
    creadoEn: ahora.toISOString(),
    estado: 'registrado-local',
    estadoTexto: 'Registrado en este dispositivo',
    items: items.map((item) => ({
      productoId: item.productoId,
      nombre: item.nombre,
      precio: item.precio,
      cantidad: item.cantidad,
      subtotal: item.precio * item.cantidad,
    })),
    resumen: {
      subtotal: resumen.subtotal,
      descuento: resumen.descuento,
      envio: resumen.envio,
      total: resumen.total,
    },
    promocion: promocion
      ? {
          id: promocion.id,
          porcentaje: promocion.porcentaje,
          minimo: promocion.minimo,
          origen: promocion.origen,
        }
      : null,
    datos: {
      tipoEntrega: datos.tipoEntrega,
      nombre: datos.nombre,
      telefono: datos.telefono,
      direccion: datos.tipoEntrega === 'domicilio' ? datos.direccion : '',
      notas: datos.notas || '',
      pago: datos.pago,
    },
    nota:
      'Pedido de demostración guardado solo en este dispositivo. No se envió a la tienda ni se procesó ningún pago.',
  };
}
