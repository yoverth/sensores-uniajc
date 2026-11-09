import React, { useRef, useState } from 'react';
import { Animated, Image, Pressable, Text, View } from 'react-native';

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
  const quedanPocos = !agotado && producto.stock <= 5;

  /* Momento táctil de la tienda: la tarjeta confirma el toque con
     el borde de oro y el CTA dorado se hunde con un muelle corto. */
  const escala = useRef(new Animated.Value(1)).current;
  const [hover, setHover] = useState(false);
  const presionar = (destino) =>
    Animated.spring(escala, {
      toValue: destino,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();

  return (
    <Animated.View style={[estilos.tarjeta, { transform: [{ scale: escala }] }]}>
      <Pressable
        onPress={() => onComprar(producto)}
        disabled={agotado}
        accessibilityRole="button"
        accessibilityLabel={`Ver ${producto.nombre}, ${formatearCOP(
          producto.precio
        )}`}
        accessibilityHint="Abre la compra directa de este producto"
        accessibilityState={{ disabled: agotado }}
        onPressIn={() => presionar(0.985)}
        onPressOut={() => presionar(1)}
        onHoverIn={() => {
          setHover(true);
          presionar(0.995);
        }}
        onHoverOut={() => {
          setHover(false);
          presionar(1);
        }}
        style={({ pressed }) => [
          estilos.tarjetaZona,
          (pressed || hover) && estilos.tarjetaPresionada,
        ]}
      >
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
            <Text
              style={[estilos.tarjetaBadgeTexto, estilos.tarjetaBadgeTextoAgotado]}
            >
              AGOTADO
            </Text>
          </View>
        )}

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

          <Text
            style={[estilos.tarjetaStock, quedanPocos && estilos.tarjetaStockBajo]}
          >
            {agotado
              ? 'Sin existencias'
              : quedanPocos
                ? `Quedan ${producto.stock}`
                : 'Disponible'}
          </Text>
        </View>
      </Pressable>

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
            pressed && estilos.botonSecundarioPresionado,
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
            pressed && estilos.botonPrimarioPresionado,
          ]}
        >
          <Text style={estilos.botonPrimarioTexto}>Comprar ahora</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
