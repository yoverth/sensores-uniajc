import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import estilos from '../../estilosTienda';
import { formatearCOP, formatearFecha } from '../../logic/formato';

/* =========================================================
   PEDIDOS REGISTRADOS (demostración local)
========================================================= */

const ENTREGAS = {
  recoger: 'Recoger en tienda',
  domicilio: 'Domicilio',
};

export default function PantallaPedidos({ pedidos, onIrTienda }) {
  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <Text style={estilos.tituloPantalla}>Mis pedidos</Text>
      <Text style={estilos.subtituloPantalla}>
        Pedidos registrados en esta sesión. La información vive solo en el
        dispositivo: todavía no hay backend.
      </Text>

      {pedidos.length === 0 ? (
        <>
          <View style={estilos.vacio}>
            <Text style={estilos.vacioIcono}>🧾</Text>
            <Text style={estilos.vacioTitulo}>Aún no tienes pedidos</Text>
            <Text style={estilos.vacioTexto}>
              Cuando confirmes una compra aparecerá aquí con su identificador.
            </Text>
          </View>

          <Pressable
            onPress={onIrTienda}
            accessibilityRole="button"
            accessibilityLabel="Ir a la tienda"
            style={estilos.botonAncho}
          >
            <Text style={estilos.botonAnchoTexto}>Ir a la tienda</Text>
          </Pressable>
        </>
      ) : (
        pedidos.map((pedido) => {
          const unidades = pedido.items.reduce(
            (total, item) => total + item.cantidad,
            0
          );

          return (
            <View key={pedido.id} style={estilos.pedidoCard}>
              <View style={estilos.pedidoFila}>
                <Text style={estilos.pedidoIdTexto}>{pedido.id}</Text>
                <Text style={estilos.pedidoEstado}>{pedido.estadoTexto}</Text>
              </View>

              <Text style={estilos.pedidoFecha}>
                {formatearFecha(pedido.creadoEn)} ·{' '}
                {ENTREGAS[pedido.datos.tipoEntrega]}
              </Text>

              <Text style={estilos.pedidoLinea}>
                {pedido.items
                  .map((item) => `${item.cantidad}× ${item.nombre}`)
                  .join(' · ')}
              </Text>

              <Text style={estilos.pedidoLinea}>
                {unidades} {unidades === 1 ? 'unidad' : 'unidades'}
                {pedido.resumen.descuento > 0
                  ? ` · descuento ${formatearCOP(pedido.resumen.descuento)}`
                  : ''}
              </Text>

              <Text style={estilos.pedidoTotal}>
                Total {formatearCOP(pedido.resumen.total)}
              </Text>
            </View>
          );
        })
      )}

      {pedidos.length > 0 && (
        <Pressable
          onPress={onIrTienda}
          accessibilityRole="button"
          accessibilityLabel="Seguir comprando"
          style={({ pressed }) => [
            estilos.botonClaro,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Text style={estilos.botonClaroTexto}>Seguir comprando</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
