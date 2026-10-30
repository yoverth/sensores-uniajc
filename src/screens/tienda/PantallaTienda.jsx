import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import estilos, { colores } from '../../estilosTienda';
import { CATEGORIAS, PRODUCTOS, filtrarProductos } from '../../data/catalogo';
import { minutosRestantes } from '../../logic/promociones';
import TarjetaProducto from '../../components/tienda/TarjetaProducto';

/* =========================================================
   TIENDA · catálogo con búsqueda, categorías y compra
   `modo="buscar"` reutiliza la misma pantalla enfocada en el
   buscador (es la entrada «Buscar» de la barra inferior).
========================================================= */

export default function PantallaTienda({
  modo = 'inicio',
  promocion,
  onAgregar,
  onComprarAhora,
  onAbrirAgita,
  onAbrirCarrito,
  onAbrirLaboratorio,
}) {
  const [texto, setTexto] = useState('');
  const [categoria, setCategoria] = useState('todas');

  const { width } = useWindowDimensions();
  const columnas = width < 600 ? 1 : width < 900 ? 2 : 3;

  const esInicio = modo === 'inicio';

  const filtrados = useMemo(
    () => filtrarProductos(PRODUCTOS, { texto, categoria }),
    [texto, categoria]
  );

  const cabecera = (
    <View>
      {esInicio && (
        <>
          <View style={estilos.hero}>
            <View
              style={[
                estilos.heroCirculo,
                { width: 170, height: 170, top: -50, right: -40 },
              ]}
            />
            <View
              style={[
                estilos.heroCirculo,
                { width: 100, height: 100, bottom: -34, right: 90 },
              ]}
            />

            <Text style={estilos.heroEtiqueta}>PASTELERÍA ARTESANAL</Text>
            <Text style={estilos.heroTitulo}>
              Endulza tu día{'\n'}con un toque de La T
            </Text>
            <Text style={estilos.heroTexto}>
              Tortas, cheesecakes y postres hechos en casa. Agita tu teléfono y
              gana hasta 15% de descuento en tu pedido.
            </Text>

            <Pressable
              onPress={onAbrirAgita}
              accessibilityRole="button"
              accessibilityLabel="Abrir Agita y gana"
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              style={({ pressed }) => [
                estilos.heroBoton,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={estilos.heroBotonTexto}>🎁 Agita y gana</Text>
            </Pressable>
          </View>

          <View style={estilos.promosFila}>
            <View style={estilos.promoMini}>
              <Text style={estilos.promoMiniIcono}>🎁</Text>
              <Text style={estilos.promoMiniTitulo}>Hasta 15% menos</Text>
              <Text style={estilos.promoMiniTexto}>
                Agita el teléfono y desbloquea un cupón de 5%, 10% o 15%.
              </Text>
            </View>

            <View style={estilos.promoMini}>
              <Text style={estilos.promoMiniIcono}>🚚</Text>
              <Text style={estilos.promoMiniTitulo}>Envío gratis</Text>
              <Text style={estilos.promoMiniTexto}>
                En pedidos a domicilio desde $80.000.
              </Text>
            </View>
          </View>
        </>
      )}

      {promocion && (
        <Pressable
          onPress={onAbrirCarrito}
          accessibilityRole="button"
          accessibilityLabel={`Tienes un cupón de ${promocion.porcentaje} por ciento. Abrir carrito`}
          style={[estilos.promoBox, { marginTop: 12 }]}
        >
          <Text style={estilos.promoBoxTitulo}>
            Tienes {promocion.porcentaje}% de descuento activo
          </Text>
          <Text style={estilos.promoBoxTexto}>
            Válido por {minutosRestantes(promocion)} min · toca para ver tu
            carrito.
          </Text>
        </Pressable>
      )}

      <View style={estilos.buscador}>
        <Text style={estilos.buscadorIcono}>🔍</Text>

        <TextInput
          value={texto}
          onChangeText={setTexto}
          placeholder="Busca tortas, cupcakes, café…"
          placeholderTextColor="#A98F82"
          style={estilos.buscadorInput}
          returnKeyType="search"
          autoFocus={!esInicio}
          accessibilityLabel="Buscar productos"
          autoCorrect={false}
        />

        {texto.length > 0 && (
          <Pressable
            onPress={() => setTexto('')}
            accessibilityRole="button"
            accessibilityLabel="Limpiar la búsqueda"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={estilos.buscadorLimpiar}
          >
            <Text style={estilos.buscadorLimpiarTexto}>✕</Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilos.categoriasFila}
        style={estilos.categoriasScroll}
      >
        {CATEGORIAS.map((cat) => {
          const activa = categoria === cat.id;

          return (
            <Pressable
              key={cat.id}
              onPress={() => setCategoria(cat.id)}
              accessibilityRole="button"
              accessibilityLabel={`Categoría ${cat.nombre}`}
              accessibilityState={{ selected: activa }}
              style={[estilos.categoriaChip, activa && estilos.categoriaChipActivo]}
            >
              <Text>{cat.icono}</Text>
              <Text
                style={[
                  estilos.categoriaTexto,
                  activa && estilos.categoriaTextoActivo,
                ]}
              >
                {cat.nombre}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={estilos.seccionFila}>
        <Text style={estilos.seccionTitulo}>
          {esInicio ? 'Nuestro catálogo' : 'Resultados'}
        </Text>
        <Text style={estilos.seccionCuenta}>
          {filtrados.length} {filtrados.length === 1 ? 'producto' : 'productos'}
        </Text>
      </View>
    </View>
  );

  const pie = esInicio ? (
    <View style={estilos.pieHerramientas}>
      <Text style={estilos.pieEtiqueta}>SECCIÓN INTERNA</Text>
      <Text style={estilos.pieTitulo}>Herramientas académicas</Text>
      <Text style={estilos.pieTexto}>
        Laboratorio de rendimiento y sensores: listas original y optimizada,
        vista adaptativa, cámara con nivel y tareas. No hace parte de la tienda.
      </Text>

      <Pressable
        onPress={onAbrirLaboratorio}
        accessibilityRole="button"
        accessibilityLabel="Abrir el laboratorio interno"
        style={({ pressed }) => [
          estilos.botonSecundario,
          { marginTop: 10 },
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={estilos.botonSecundarioTexto}>Abrir laboratorio</Text>
      </Pressable>
    </View>
  ) : null;

  return (
    <FlatList
      data={filtrados}
      key={`catalogo-${columnas}`}
      numColumns={columnas}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TarjetaProducto
          producto={item}
          columnas={columnas}
          onAgregar={onAgregar}
          onComprar={onComprarAhora}
        />
      )}
      columnWrapperStyle={columnas > 1 ? estilos.filaProductos : undefined}
      ListHeaderComponent={cabecera}
      ListFooterComponent={pie}
      ListEmptyComponent={
        <View style={estilos.vacio}>
          <Text style={estilos.vacioIcono}>🍰</Text>
          <Text style={estilos.vacioTitulo}>No encontramos productos</Text>
          <Text style={estilos.vacioTexto}>
            Prueba con otra palabra o cambia de categoría.
          </Text>
        </View>
      }
      contentContainerStyle={estilos.contenido}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      style={{ backgroundColor: colores.crema }}
    />
  );
}
