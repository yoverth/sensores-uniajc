import React, { useRef, useState } from 'react';
import { Animated, Image, Pressable, Text, View } from 'react-native';

import { nombreCategoria } from '../../data/catalogo';
import { formatearCOP } from '../../logic/formato';
import { useTema } from '../../theme/TemaContexto';

/* =========================================================
   TARJETA DE PRODUCTO DE LA TIENDA
   - Altura uniforme: título y descripción a 2 líneas, precio y
     acciones siempre alineados al pie.
   - La imagen abre el visor ampliado del producto.
   - Cada tarjeta permite consultar el producto con la IA.
========================================================= */

export default function TarjetaProducto({
  producto,
  columnas,
  onAgregar,
  onComprar,
  onAbrirProducto,
  onConsultarIA,
}) {
  const { estilos } = useTema();
  const agotado = !producto.disponible || producto.stock <= 0;
  const quedanPocos = !agotado && producto.stock <= 5;

  /* Momento táctil de la tienda: la tarjeta confirma el toque con
     el borde de oro y el CTA caramelo se hunde con un muelle corto. */
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
        onPress={() => onAbrirProducto(producto)}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalle de ${producto.nombre}, ${formatearCOP(
          producto.precio
        )}`}
        accessibilityHint="Abre el visor del producto con su descripción y opciones de compra"
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
        <View style={estilos.tarjetaImagenWrap}>
          <Image
            source={producto.imagen}
            style={[
              estilos.tarjetaImagenZoom,
              columnas === 1 && estilos.tarjetaImagenZoomAlta,
            ]}
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
                style={[
                  estilos.tarjetaBadgeTexto,
                  estilos.tarjetaBadgeTextoAgotado,
                ]}
              >
                AGOTADO
              </Text>
            </View>
          )}
        </View>
      </Pressable>

      <View style={[estilos.tarjetaCuerpo, estilos.tarjetaContenido]}>
        <View style={estilos.tarjetaInfo}>
          <Text style={estilos.tarjetaCategoria}>
            {nombreCategoria(producto.categoria)}
          </Text>

          <Text
            style={estilos.tarjetaNombre}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {producto.nombre}
          </Text>

          <Text
            style={estilos.tarjetaDescripcion}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {producto.descripcion}
          </Text>
        </View>

        <View style={estilos.tarjetaInfoPie}>
          <Text style={estilos.tarjetaPrecio}>
            {formatearCOP(producto.precio)}
          </Text>

          <Text
            style={[estilos.tarjetaStock, quedanPocos && estilos.tarjetaStockBajo]}
            numberOfLines={1}
          >
            {agotado
              ? 'Sin existencias'
              : quedanPocos
                ? `Quedan ${producto.stock}`
                : 'Disponible'}
          </Text>

          <Pressable
            onPress={() => onConsultarIA(producto)}
            accessibilityRole="button"
            accessibilityLabel={`Consultar con la IA sobre ${producto.nombre}`}
            accessibilityHint="Abre el asistente con este producto seleccionado"
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            style={({ pressed }) => [
              estilos.tarjetaIA,
              pressed && estilos.tarjetaIAPresionado,
            ]}
          >
            <Text style={estilos.tarjetaIATexto}>🤖 Consultar IA</Text>
          </Pressable>
        </View>
      </View>

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
