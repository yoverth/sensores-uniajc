import React from 'react';
import { Pressable, Text, View } from 'react-native';

import estilos from '../../estilosTienda';

/* =========================================================
   SELECTOR DE CANTIDAD (+ / -)
   Se bloquea en 1 y en el stock disponible.
========================================================= */

export default function SelectorCantidad({
  cantidad,
  stock,
  onMenos,
  onMas,
  etiqueta,
}) {
  const puedeMenos = cantidad > 1;
  const puedeMas = cantidad < stock;

  return (
    <View style={estilos.cantidadFila}>
      <Pressable
        onPress={onMenos}
        disabled={!puedeMenos}
        accessibilityRole="button"
        accessibilityLabel={`Quitar una unidad de ${etiqueta || 'este producto'}`}
        accessibilityState={{ disabled: !puedeMenos }}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        style={({ pressed }) => [
          estilos.cantidadBoton,
          !puedeMenos && estilos.botonDeshabilitado,
          pressed && estilos.cantidadBotonPresionado,
        ]}
      >
        <Text style={estilos.cantidadBotonTexto}>−</Text>
      </Pressable>

      <Text style={estilos.cantidadValor} accessibilityLabel={`Cantidad ${cantidad}`}>
        {cantidad}
      </Text>

      <Pressable
        onPress={onMas}
        disabled={!puedeMas}
        accessibilityRole="button"
        accessibilityLabel={`Agregar una unidad de ${etiqueta || 'este producto'}`}
        accessibilityState={{ disabled: !puedeMas }}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        style={({ pressed }) => [
          estilos.cantidadBoton,
          !puedeMas && estilos.botonDeshabilitado,
          pressed && estilos.cantidadBotonPresionado,
        ]}
      >
        <Text style={estilos.cantidadBotonTexto}>+</Text>
      </Pressable>
    </View>
  );
}
