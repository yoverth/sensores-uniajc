import React from 'react';
import { Pressable, Text, View } from 'react-native';

import estilos from '../../estilosTienda';

/* =========================================================
   ENCABEZADO DE LA TIENDA
   Logo, nombre del negocio, acceso al carrito y a las
   herramientas internas.
========================================================= */

export default function EncabezadoTienda({
  cantidadCarrito,
  onAbrirCarrito,
  onAbrirLaboratorio,
}) {
  const resumenCarrito = `${cantidadCarrito} ${
    cantidadCarrito === 1 ? 'producto' : 'productos'
  }`;

  return (
    <View style={estilos.header}>
      <View style={estilos.marca}>
        <View style={estilos.logo} accessibilityElementsHidden importantForAccessibility="no">
          <Text style={estilos.logoTexto}>La T</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={estilos.marcaNombre} numberOfLines={1}>
            Pastelería La T
          </Text>
          <Text style={estilos.marcaSubtitulo} numberOfLines={1}>
            Tortas y postres artesanales
          </Text>
        </View>
      </View>

      <View style={estilos.accionesHeader}>
        <Pressable
          onPress={onAbrirLaboratorio}
          accessibilityRole="button"
          accessibilityLabel="Herramientas internas"
          accessibilityHint="Abre el laboratorio de rendimiento y sensores"
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          style={({ pressed }) => [
            estilos.iconoBoton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={estilos.iconoBotonTexto}>🧪</Text>
        </Pressable>

        <Pressable
          onPress={onAbrirCarrito}
          accessibilityRole="button"
          accessibilityLabel={`Carrito de compras, ${resumenCarrito}`}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          style={({ pressed }) => [
            estilos.iconoBoton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={estilos.iconoBotonTexto}>🛍️</Text>

          {cantidadCarrito > 0 && (
            <View style={estilos.badgeCarrito}>
              <Text style={estilos.badgeCarritoTexto}>
                {cantidadCarrito > 9 ? '9+' : cantidadCarrito}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}
