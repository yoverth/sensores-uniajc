import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import estilos from '../../estilosTienda';
import ResumenPrecios from '../../components/tienda/ResumenPrecios';
import SelectorCantidad from '../../components/tienda/SelectorCantidad';
import { calcularResumen } from '../../logic/carrito';
import { formatearCOP } from '../../logic/formato';
import { minutosRestantes, promocionVigente } from '../../logic/promociones';

/* =========================================================
   CARRITO
   Cantidades, eliminación, subtotales, descuento y total.
========================================================= */

export default function PantallaCarrito({
  carrito,
  promocion,
  onCambiarCantidad,
  onEliminar,
  onQuitarPromocion,
  onAbrirAgita,
  onIrCheckout,
  onIrTienda,
}) {
  const resumen = calcularResumen(carrito, promocion, 'recoger');
  const vacio = carrito.length === 0;

  if (vacio) {
    return (
      <ScrollView contentContainerStyle={estilos.contenido}>
        <Text style={estilos.tituloPantalla}>Tu carrito</Text>
        <Text style={estilos.subtituloPantalla}>
          Aquí verás los productos que elijas de la tienda.
        </Text>

        <View style={estilos.vacio}>
          <Text style={estilos.vacioIcono}>🛍️</Text>
          <Text style={estilos.vacioTitulo}>Tu carrito está vacío</Text>
          <Text style={estilos.vacioTexto}>
            Agrega una torta, un cheesecake o un postre para empezar tu pedido.
          </Text>
        </View>

        <Pressable
          onPress={onIrTienda}
          accessibilityRole="button"
          accessibilityLabel="Ver productos de la tienda"
          style={({ pressed }) => [
            estilos.botonAncho,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={estilos.botonAnchoTexto}>Ver productos</Text>
        </Pressable>
      </ScrollView>
    );
  }

  const cuponVencido = promocion && !promocionVigente(promocion);

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <Text style={estilos.tituloPantalla}>Tu carrito</Text>
      <Text style={estilos.subtituloPantalla}>
        {resumen.unidades} {resumen.unidades === 1 ? 'unidad' : 'unidades'} ·{' '}
        {carrito.length} {carrito.length === 1 ? 'producto' : 'productos'}
      </Text>

      {carrito.map((item) => (
        <View key={item.productoId} style={estilos.carritoItem}>
          <Image
            source={item.imagen}
            style={estilos.carritoImagen}
            resizeMode="cover"
            accessibilityLabel={`Fotografía de ${item.nombre}`}
          />

          <View style={estilos.carritoInfo}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              <Text style={estilos.carritoNombre} numberOfLines={2}>
                {item.nombre}
              </Text>

              <Pressable
                onPress={() => onEliminar(item.productoId)}
                accessibilityRole="button"
                accessibilityLabel={`Eliminar ${item.nombre} del carrito`}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={({ pressed }) => [
                  estilos.eliminarBoton,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={estilos.eliminarTexto}>🗑️</Text>
              </Pressable>
            </View>

            <Text style={estilos.carritoUnitario}>
              {formatearCOP(item.precio)} c/u
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <SelectorCantidad
                cantidad={item.cantidad}
                stock={item.stock}
                etiqueta={item.nombre}
                onMenos={() => onCambiarCantidad(item.productoId, -1)}
                onMas={() => onCambiarCantidad(item.productoId, 1)}
              />

              <Text style={estilos.carritoSubtotal}>
                {formatearCOP(item.precio * item.cantidad)}
              </Text>
            </View>
          </View>
        </View>
      ))}

      {promocion ? (
        <View style={estilos.promoBox}>
          <Text style={estilos.promoBoxTitulo}>
            🎟️ {promocion.titulo} · {promocion.origen === 'local-demo' ? 'local' : 'cupón'}
          </Text>

          <Text style={estilos.promoBoxTexto}>
            {cuponVencido
              ? 'El cupón venció y ya no se aplica.'
              : resumen.promoAplicada
                ? 'Descuento aplicado a este pedido.'
                : resumen.promoPendiente != null
                  ? `Se activará cuando el subtotal llegue a ${formatearCOP(
                      promocion.minimo
                    )}.`
                  : 'Agrega productos para usar el cupón.'}
          </Text>

          <Text style={estilos.promoBoxEstado}>
            {cuponVencido
              ? 'Vencido'
              : `Vigencia: ${minutosRestantes(promocion)} min · 1 uso · no acumulable`}
          </Text>

          <View style={estilos.promoAcciones}>
            <Pressable
              onPress={onQuitarPromocion}
              accessibilityRole="button"
              accessibilityLabel="Quitar el cupón del carrito"
              style={({ pressed }) => [
                estilos.promoQuitar,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={estilos.promoQuitarTexto}>Quitar cupón</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={estilos.promoBox}>
          <Text style={estilos.promoBoxTitulo}>🎁 ¿Buscas un descuento?</Text>
          <Text style={estilos.promoBoxTexto}>
            Agita tu teléfono y gana entre 5% y 15% para este pedido.
          </Text>

          <Pressable
            onPress={onAbrirAgita}
            accessibilityRole="button"
            accessibilityLabel="Ir a Agita y gana"
            style={({ pressed }) => [
              estilos.botonClaro,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={estilos.botonClaroTexto}>Ir a Agita y gana</Text>
          </Pressable>
        </View>
      )}

      <ResumenPrecios
        resumen={resumen}
        porcentajePromocion={promocion ? promocion.porcentaje : 0}
      />

      <Text style={estilos.notaPie}>
        El envío se calcula en el siguiente paso. Domicilio gratis desde
        $80.000.
      </Text>

      <Pressable
        onPress={onIrCheckout}
        accessibilityRole="button"
        accessibilityLabel="Continuar con el pedido"
        style={({ pressed }) => [
          estilos.botonAncho,
          pressed && { opacity: 0.85 },
        ]}
      >
        <Text style={estilos.botonAnchoTexto}>Continuar con el pedido</Text>
      </Pressable>

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
    </ScrollView>
  );
}
