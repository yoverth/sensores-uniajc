import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useTema } from '../../theme/TemaContexto';
import LogoMarca from './LogoMarca';

/* =========================================================
   ENCABEZADO DE LA TIENDA
   Logo, nombre del negocio, cambio de tema y carrito.
========================================================= */

export default function EncabezadoTienda({
  cantidadCarrito,
  onAbrirCarrito,
}) {
  const { modo, estilos, alternarTema } = useTema();

  const resumenCarrito = `${cantidadCarrito} ${
    cantidadCarrito === 1 ? 'producto' : 'productos'
  }`;

  const esClaro = modo === 'claro';

  return (
    <View style={estilos.header}>
      <View style={[estilos.marca, { minWidth: 0 }]}>
        <LogoMarca tamano={40} subtitulo="Repostería artesanal" />
      </View>

      <View style={estilos.accionesHeader}>
        <Pressable
          onPress={alternarTema}
          accessibilityRole="button"
          accessibilityLabel={
            esClaro ? 'Cambiar al tema oscuro' : 'Cambiar al tema claro'
          }
          accessibilityHint="Alterna entre el modo claro y el modo oscuro"
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          style={({ pressed }) => [
            estilos.botonTema,
            pressed && estilos.botonTemaPresionado,
          ]}
        >
          <Text style={estilos.botonTemaTexto}>
            {esClaro ? '🌙 Oscuro' : '☀️ Claro'}
          </Text>
        </Pressable>

        <Pressable
          onPress={onAbrirCarrito}
          accessibilityRole="button"
          accessibilityLabel={`Carrito de compras, ${resumenCarrito}`}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          style={({ pressed }) => [
            estilos.iconoBoton,
            pressed && estilos.iconoBotonPresionado,
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
