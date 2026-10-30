import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import estilos from '../../estilosTienda';
import ResumenPrecios from '../../components/tienda/ResumenPrecios';
import { formatearCOP, formatearFecha } from '../../logic/formato';

/* =========================================================
   CONFIRMACIÓN DEL PEDIDO
   Resumen final + identificador local del pedido.
========================================================= */

const ENTREGAS = {
  recoger: 'Recoger en tienda',
  domicilio: 'Domicilio',
};

const PAGOS = {
  efectivo: 'Efectivo contra entrega',
  transferencia: 'Transferencia bancaria (coordinación manual)',
};

export default function PantallaConfirmacion({
  pedido,
  onSeguirComprando,
  onVerPedidos,
}) {
  if (!pedido) {
    return (
      <ScrollView contentContainerStyle={estilos.contenido}>
        <View style={estilos.vacio}>
          <Text style={estilos.vacioIcono}>🧾</Text>
          <Text style={estilos.vacioTitulo}>No hay un pedido reciente</Text>
          <Text style={estilos.vacioTexto}>
            Cuando confirmes una compra verás aquí su comprobante.
          </Text>
        </View>

        <Pressable
          onPress={onSeguirComprando}
          accessibilityRole="button"
          accessibilityLabel="Volver a la tienda"
          style={estilos.botonAncho}
        >
          <Text style={estilos.botonAnchoTexto}>Volver a la tienda</Text>
        </Pressable>
      </ScrollView>
    );
  }

  const resumen = {
    subtotal: pedido.resumen.subtotal,
    descuento: pedido.resumen.descuento,
    envio: pedido.resumen.envio,
    total: pedido.resumen.total,
    promoAplicada: pedido.resumen.descuento > 0,
    promoPendiente: null,
  };

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <View style={estilos.exitoCirculo}>
        <Text style={estilos.exitoIcono}>✓</Text>
      </View>

      <Text style={estilos.pedidoId}>{pedido.id}</Text>
      <Text style={estilos.pedidoNota}>
        Pedido registrado en este dispositivo ·{' '}
        {formatearFecha(pedido.creadoEn)}
      </Text>

      <View style={estilos.confirmacionCaja}>
        <Text style={estilos.campoEtiqueta}>Entrega</Text>
        <Text style={estilos.resumenValor}>
          {ENTREGAS[pedido.datos.tipoEntrega]}
        </Text>
        {pedido.datos.tipoEntrega === 'domicilio' && (
          <Text style={estilos.pedidoLinea}>{pedido.datos.direccion}</Text>
        )}

        <Text style={[estilos.campoEtiqueta, { marginTop: 12 }]}>Pago</Text>
        <Text style={estilos.resumenValor}>
          {PAGOS[pedido.datos.pago] || pedido.datos.pago}
        </Text>

        <Text style={[estilos.campoEtiqueta, { marginTop: 12 }]}>
          Cliente
        </Text>
        <Text style={estilos.resumenValor}>{pedido.datos.nombre}</Text>
        <Text style={estilos.pedidoLinea}>{pedido.datos.telefono}</Text>

        {pedido.datos.notas ? (
          <Text style={estilos.pedidoLinea}>Notas: {pedido.datos.notas}</Text>
        ) : null}
      </View>

      <View style={estilos.confirmacionCaja}>
        <Text style={estilos.campoEtiqueta}>Productos</Text>

        {pedido.items.map((item) => (
          <View
            key={item.productoId}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 10,
              marginBottom: 6,
            }}
          >
            <Text style={estilos.pedidoLinea} numberOfLines={1}>
              {item.cantidad} × {item.nombre}
            </Text>
            <Text style={estilos.resumenValor}>
              {formatearCOP(item.subtotal)}
            </Text>
          </View>
        ))}
      </View>

      <ResumenPrecios
        resumen={resumen}
        mostrarEnvio={pedido.datos.tipoEntrega === 'domicilio'}
        porcentajePromocion={pedido.promocion ? pedido.promocion.porcentaje : 0}
      />

      <Text style={estilos.notaPie}>{pedido.nota}</Text>

      <Pressable
        onPress={onVerPedidos}
        accessibilityRole="button"
        accessibilityLabel="Ver mis pedidos"
        style={({ pressed }) => [
          estilos.botonAncho,
          pressed && { opacity: 0.85 },
        ]}
      >
        <Text style={estilos.botonAnchoTexto}>Ver mis pedidos</Text>
      </Pressable>

      <Pressable
        onPress={onSeguirComprando}
        accessibilityRole="button"
        accessibilityLabel="Seguir comprando"
        style={({ pressed }) => [
          estilos.botonClaro,
          pressed && { opacity: 0.8 },
        ]}
      >
        <Text style={estilos.botonClaroTexto}>Seguir comprando</Text>
      </Pressable>
    </ScrollView>
  );
}
