import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import estilos from '../../estilosTienda';
import { nombreCategoria } from '../../data/catalogo';
import { formatearCOP } from '../../logic/formato';

/* =========================================================
   TARJETA DE PRODUCTO DE LA TIENDA
   Botones reales: agregar al carrito y comprar ahora.
========================================================= */

export default function TarjetaProducto({
  producto,
  columnas,
  onAgregar,
  onComprar,
}) {
  const agotado = !producto.disponible || producto.stock <= 0;

  return (
    <View style={estilos.tarjeta}>
      <View>
        <Image
          source={producto.imagen}
          style={[estilos.tarjetaImagen, columnas === 1 && estilos.tarjetaImagenAlta]}
          resizeMode="cover"
          accessibilityLabel={`Fotografía de ${producto.nombre}`}
        />

        {producto.etiqueta && !agotado && (
          <View style={estilos.tarjetaBadge}>
            <Text style={estilos.tarjetaBadgeTexto}>
              {producto.etiqueta.toUpperCase()}
            </Text>
          </View>
        )}

        {agotado && (
          <View style={[estilos.tarjetaBadge, estilos.tarjetaBadgeAgotado]}>
            <Text style={estilos.tarjetaBadgeTexto}>AGOTADO</Text>
          </View>
        )}
      </View>

      <View style={estilos.tarjetaCuerpo}>
        <Text style={estilos.tarjetaCategoria}>
          {nombreCategoria(producto.categoria)}
        </Text>

        <Text style={estilos.tarjetaNombre} numberOfLines={2}>
          {producto.nombre}
        </Text>

        <Text style={estilos.tarjetaDescripcion} numberOfLines={2}>
          {producto.descripcion}
        </Text>

        <Text style={estilos.tarjetaPrecio}>{formatearCOP(producto.precio)}</Text>

        <Text style={estilos.tarjetaStock}>
          {agotado
            ? 'Sin existencias'
            : producto.stock <= 5
              ? `Quedan ${producto.stock}`
              : 'Disponible'}
        </Text>

        <View style={estilos.tarjetaBotones}>
          <Pressable
            onPress={() => onAgregar(producto)}
            disabled={agotado}
            accessibilityRole="button"
            accessibilityLabel={`Agregar ${producto.nombre} al carrito`}
            accessibilityState={{ disabled: agotado }}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            style={({ pressed }) => [
              estilos.botonSecundario,
              agotado && estilos.botonDeshabilitado,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={estilos.botonSecundarioTexto}>Agregar</Text>
          </Pressable>

          <Pressable
            onPress={() => onComprar(producto)}
            disabled={agotado}
            accessibilityRole="button"
            accessibilityLabel={`Comprar ahora ${producto.nombre}`}
            accessibilityHint="Agrega el producto y abre el carrito"
            accessibilityState={{ disabled: agotado }}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            style={({ pressed }) => [
              estilos.botonPrimario,
              agotado && estilos.botonDeshabilitado,
              pressed && { opacity: 0.75 },
            ]}
          >
            <Text style={estilos.botonPrimarioTexto}>Comprar ahora</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
