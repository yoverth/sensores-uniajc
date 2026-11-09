import React from 'react';
import { Pressable, Text, View } from 'react-native';

import estilos from '../../estilosTienda';

/* =========================================================
   BARRA DE NAVEGACIÓN DE LA TIENDA
========================================================= */

const ITEMS = [
  { id: 'inicio', icono: '🏠', texto: 'Inicio' },
  { id: 'buscar', icono: '🔍', texto: 'Buscar' },
  { id: 'agita', icono: '🎁', texto: 'Agita' },
  { id: 'carrito', icono: '🛍️', texto: 'Carrito', muestraBadge: true },
  { id: 'pedidos', icono: '🧾', texto: 'Pedidos' },
  {
    id: 'asistente',
    icono: '🤖',
    texto: 'Asistente',
    etiquetaAccesible: 'Asistente IA',
  },
];

export default function BarraTienda({ vista, onNavegar, cantidadCarrito }) {
  /* El checkout y la confirmación pertenecen al flujo del carrito. */
  const activa =
    vista === 'checkout' || vista === 'confirmacion' ? 'carrito' : vista;

  return (
    <View style={estilos.barra}>
      {ITEMS.map((item) => {
        const seleccionada = activa === item.id;

        return (
          <Pressable
            key={item.id}
            onPress={() => onNavegar(item.id)}
            accessibilityRole="tab"
            accessibilityLabel={item.etiquetaAccesible || item.texto}
            accessibilityState={{ selected: seleccionada }}
            hitSlop={{ top: 4, bottom: 4, left: 0, right: 0 }}
            style={({ pressed }) => [
              estilos.barraItem,
              pressed && estilos.barraItemPresionado,
            ]}
          >
            <View style={estilos.barraIconoWrap}>
              <Text
                style={[estilos.barraIcono, seleccionada && estilos.barraIconoActivo]}
              >
                {item.icono}
              </Text>

              {item.muestraBadge && cantidadCarrito > 0 && (
                <View style={estilos.barraBadge}>
                  <Text style={estilos.barraBadgeTexto}>
                    {cantidadCarrito > 9 ? '9+' : cantidadCarrito}
                  </Text>
                </View>
              )}
            </View>

            <Text
              style={[
                estilos.barraTexto,
                seleccionada && estilos.barraTextoActivo,
              ]}
            >
              {item.texto}
            </Text>

            <View
              style={seleccionada ? estilos.barraPunto : estilos.barraPuntoVacio}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
