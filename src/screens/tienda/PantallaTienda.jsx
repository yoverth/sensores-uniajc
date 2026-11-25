import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import {
  CATEGORIAS,
  ORDENES_BUSQUEDA,
  PRODUCTOS,
  RANGOS_PRECIO,
  filtrarProductos,
} from '../../data/catalogo';
import { minutosRestantes } from '../../logic/promociones';
import TarjetaProducto from '../../components/tienda/TarjetaProducto';
import ModalProducto from '../../components/tienda/ModalProducto';
import EsqueletoCatalogo from '../../components/tienda/EsqueletoCatalogo';
import FooterTienda from '../../components/tienda/FooterTienda';
import BannerPortada from '../../components/tienda/BannerPortada';
import { useTema } from '../../theme/TemaContexto';
import { EVENTOS_ANALITICA, registrarEvento } from '../../services/analitica';

/* =========================================================
   TIENDA · catálogo con portada carrusel, skeleton loader,
   búsqueda, categorías, compra y pie de página legal/social.
   `modo="buscar"` reutiliza la misma pantalla enfocada en el
   buscador (es la entrada «Buscar» de la barra inferior).
========================================================= */

function ChipFiltro({ etiqueta, activo, labelAccesible, onPress, estilos }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={labelAccesible}
      accessibilityState={{ selected: activo }}
      style={({ pressed }) => [
        estilos.filtroChip,
        activo && estilos.filtroChipActivo,
        pressed && !activo && { opacity: 0.8 },
      ]}
    >
      <Text
        style={[
          estilos.filtroChipTexto,
          activo && estilos.filtroChipTextoActivo,
        ]}
      >
        {etiqueta}
      </Text>
    </Pressable>
  );
}

export default function PantallaTienda({
  modo = 'inicio',
  promocion,
  onAgregar,
  onComprarAhora,
  onAbrirAgita,
  onAbrirCarrito,
  onAbrirAsistente,
  onAbrirLegal,
  onMostrarError,
}) {
  const { estilos, colores } = useTema();
  const [texto, setTexto] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [rangoPrecio, setRangoPrecio] = useState('todos');
  const [orden, setOrden] = useState('relevancia');
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [soloEtiqueta, setSoloEtiqueta] = useState(false);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [buscadorFoco, setBuscadorFoco] = useState(false);
  const [productoVisto, setProductoVisto] = useState(null);
  const [cargandoCatalogo, setCargandoCatalogo] = useState(false);
  const esPrimerFiltroRef = useRef(true);

  const { width } = useWindowDimensions();
  const columnas = width < 600 ? 1 : width < 900 ? 2 : 3;
  const esInicio = modo === 'inicio';

  const cantidadFiltrosAvanzados =
    (rangoPrecio !== 'todos' ? 1 : 0) +
    (orden !== 'relevancia' ? 1 : 0) +
    (soloDisponibles ? 1 : 0) +
    (soloEtiqueta ? 1 : 0);

  const cantidadFiltros =
    cantidadFiltrosAvanzados + (categoria !== 'todas' ? 1 : 0);

  const hayBusquedaOFiltros = Boolean(texto.trim()) || cantidadFiltros > 0;

  function limpiarFiltros() {
    setCategoria('todas');
    setRangoPrecio('todos');
    setOrden('relevancia');
    setSoloDisponibles(false);
    setSoloEtiqueta(false);
  }

  function limpiarTodo() {
    setTexto('');
    limpiarFiltros();
  }

  const filtrados = useMemo(
    () =>
      filtrarProductos(PRODUCTOS, {
        texto,
        categoria,
        rangoPrecio,
        soloDisponibles,
        soloEtiqueta,
        orden,
      }),
    [texto, categoria, rangoPrecio, soloDisponibles, soloEtiqueta, orden]
  );

  /* Skeleton breve solo al cambiar categoría o filtros de búsqueda. */
  useEffect(() => {
    if (esPrimerFiltroRef.current) {
      esPrimerFiltroRef.current = false;
      return undefined;
    }

    setCargandoCatalogo(true);
    const id = setTimeout(() => setCargandoCatalogo(false), 220);
    return () => clearTimeout(id);
  }, [texto, categoria, rangoPrecio, soloDisponibles, soloEtiqueta, orden]);

  /* Analítica de búsqueda/filtro con debounce para no saturar por tecla. */
  useEffect(() => {
    const consulta = texto.trim();
    if (!consulta && cantidadFiltros === 0) return undefined;

    const id = setTimeout(() => {
      registrarEvento(EVENTOS_ANALITICA.BUSQUEDA_PRODUCTO, {
        texto: consulta,
        categoria,
        rangoPrecio,
        orden,
        soloDisponibles,
        soloEtiqueta,
        resultados: filtrados.length,
      });
    }, 450);

    return () => clearTimeout(id);
  }, [
    texto,
    categoria,
    rangoPrecio,
    orden,
    soloDisponibles,
    soloEtiqueta,
    cantidadFiltros,
    filtrados.length,
  ]);

  /* Completa la última fila cuando hay 2 o 3 columnas para conservar ancho uniforme. */
  const datosGrilla = useMemo(() => {
    if (cargandoCatalogo) return [];
    if (columnas <= 1 || filtrados.length === 0) return filtrados;

    const resto = filtrados.length % columnas;
    if (resto === 0) return filtrados;

    const relleno = Array.from({ length: columnas - resto }, (_, idx) => ({
      id: `__espacio-${idx}`,
      _espacio: true,
    }));

    return [...filtrados, ...relleno];
  }, [cargandoCatalogo, columnas, filtrados]);

  const consultarIA = (producto) => {
    setProductoVisto(null);
    onAbrirAsistente(producto);
  };

  const cabecera = (
    <View>
      {esInicio && (
        <>
          <BannerPortada
            onAbrirAgita={onAbrirAgita}
            onSeleccionarProducto={setProductoVisto}
          />

          <View style={estilos.promosCinta}>
            <Text style={estilos.promosCintaTexto} numberOfLines={1}>
              🎁 Hasta 15% menos
            </Text>
            <Text style={estilos.promosCintaSeparador}>·</Text>
            <Text style={estilos.promosCintaTexto} numberOfLines={1}>
              🚚 Envío gratis desde $80.000
            </Text>
          </View>
        </>
      )}

      {promocion && (
        <Pressable
          onPress={onAbrirCarrito}
          accessibilityRole="button"
          accessibilityLabel={`Tienes un cupón de ${promocion.porcentaje} por ciento. Abrir carrito`}
          accessibilityHint="Te lleva al carrito para revisar tu descuento"
          style={[estilos.promoBox, { marginTop: 10 }]}
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

      <View style={[estilos.buscador, buscadorFoco && estilos.buscadorFoco]}>
        <Text style={estilos.buscadorIcono}>🔍</Text>

        <TextInput
          value={texto}
          onChangeText={setTexto}
          placeholder="Busca tortas, cupcakes, café…"
          placeholderTextColor={colores.textoTenue}
          onFocus={() => setBuscadorFoco(true)}
          onBlur={() => setBuscadorFoco(false)}
          style={estilos.buscadorInput}
          returnKeyType="search"
          autoFocus={!esInicio}
          accessibilityLabel="Buscar productos en la pastelería"
          accessibilityHint="Filtra el catálogo por nombre, descripción o categoría"
          autoCorrect={false}
        />

        {texto.length > 0 && (
          <Pressable
            onPress={() => setTexto('')}
            accessibilityRole="button"
            accessibilityLabel="Limpiar la búsqueda"
            accessibilityHint="Borra el texto del buscador"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            style={estilos.buscadorLimpiar}
          >
            <Text style={estilos.buscadorLimpiarTexto}>✕</Text>
          </Pressable>
        )}

        <Pressable
          onPress={() => setFiltrosAbiertos((abierto) => !abierto)}
          accessibilityRole="button"
          accessibilityLabel={
            cantidadFiltros > 0
              ? `Filtros de búsqueda, ${cantidadFiltros} activos`
              : 'Filtros de búsqueda'
          }
          accessibilityHint="Muestra u oculta opciones para filtrar por precio, orden y disponibilidad"
          accessibilityState={{ expanded: filtrosAbiertos }}
          style={({ pressed }) => [
            estilos.buscadorFiltroBtn,
            (filtrosAbiertos || cantidadFiltros > 0) &&
              estilos.buscadorFiltroBtnActivo,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text
            style={[
              estilos.buscadorFiltroBtnTexto,
              (filtrosAbiertos || cantidadFiltros > 0) &&
                estilos.buscadorFiltroBtnTextoActivo,
            ]}
          >
            {cantidadFiltros > 0 ? `Filtros (${cantidadFiltros})` : 'Filtros'}
          </Text>
        </Pressable>
      </View>

      {filtrosAbiertos && (
        <View style={estilos.filtroPanel}>
          <View style={estilos.filtroCabecera}>
            <Text style={estilos.filtroTitulo}>Filtros de búsqueda</Text>
            {cantidadFiltros > 0 && (
              <Pressable
                onPress={limpiarFiltros}
                accessibilityRole="button"
                accessibilityLabel="Limpiar filtros de búsqueda"
                style={estilos.filtroLimpiarBtn}
              >
                <Text style={estilos.filtroLimpiarTexto}>Limpiar filtros</Text>
              </Pressable>
            )}
          </View>

          <View style={estilos.filtroGrupo}>
            <Text style={estilos.filtroGrupoTitulo}>Rango de precio</Text>
            <View style={estilos.filtroChipsWrap}>
              {RANGOS_PRECIO.map((rango) => (
                <ChipFiltro
                  key={rango.id}
                  etiqueta={rango.etiqueta}
                  activo={rangoPrecio === rango.id}
                  labelAccesible={`Precio: ${rango.etiqueta}`}
                  onPress={() => setRangoPrecio(rango.id)}
                  estilos={estilos}
                />
              ))}
            </View>
          </View>

          <View style={estilos.filtroGrupo}>
            <Text style={estilos.filtroGrupoTitulo}>Ordenar por</Text>
            <View style={estilos.filtroChipsWrap}>
              {ORDENES_BUSQUEDA.map((opcion) => (
                <ChipFiltro
                  key={opcion.id}
                  etiqueta={opcion.etiqueta}
                  activo={orden === opcion.id}
                  labelAccesible={`Ordenar por: ${opcion.etiqueta}`}
                  onPress={() => setOrden(opcion.id)}
                  estilos={estilos}
                />
              ))}
            </View>
          </View>

          <View style={estilos.filtroGrupo}>
            <Text style={estilos.filtroGrupoTitulo}>Disponibilidad y sello</Text>
            <View style={estilos.filtroChipsWrap}>
              <ChipFiltro
                etiqueta="Solo disponibles"
                activo={soloDisponibles}
                labelAccesible="Solo disponibles en tienda"
                onPress={() => setSoloDisponibles((v) => !v)}
                estilos={estilos}
              />
              <ChipFiltro
                etiqueta="Destacados / Nuevos"
                activo={soloEtiqueta}
                labelAccesible="Destacados y nuevos"
                onPress={() => setSoloEtiqueta((v) => !v)}
                estilos={estilos}
              />
            </View>
          </View>
        </View>
      )}

      {!filtrosAbiertos && cantidadFiltrosAvanzados > 0 && (
        <View style={estilos.filtrosActivosFila}>
          {[
            rangoPrecio !== 'todos' && {
              id: 'precio',
              etiqueta: (
                RANGOS_PRECIO.find((r) => r.id === rangoPrecio) || {}
              ).etiqueta,
              label: 'Quitar filtro de precio',
              onPress: () => setRangoPrecio('todos'),
            },
            orden !== 'relevancia' && {
              id: 'orden',
              etiqueta: (
                ORDENES_BUSQUEDA.find((o) => o.id === orden) || {}
              ).etiqueta,
              label: 'Quitar orden personalizado',
              onPress: () => setOrden('relevancia'),
            },
            soloDisponibles && {
              id: 'disponibles',
              etiqueta: 'Solo disponibles',
              label: 'Quitar filtro solo disponibles',
              onPress: () => setSoloDisponibles(false),
            },
            soloEtiqueta && {
              id: 'destacados',
              etiqueta: 'Destacados',
              label: 'Quitar filtro destacados',
              onPress: () => setSoloEtiqueta(false),
            },
          ]
            .filter(Boolean)
            .map((chip) => (
              <Pressable
                key={chip.id}
                onPress={chip.onPress}
                accessibilityRole="button"
                accessibilityLabel={chip.label}
                style={estilos.filtroActivoChip}
              >
                <Text style={estilos.filtroActivoTexto}>
                  {chip.etiqueta} ✕
                </Text>
              </Pressable>
            ))}
        </View>
      )}

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
              accessibilityHint={`Filtra los productos de ${cat.nombre}`}
              accessibilityState={{ selected: activa }}
              style={({ pressed }) => [
                estilos.categoriaChip,
                pressed && !activa && estilos.categoriaChipPresionado,
                activa && estilos.categoriaChipActivo,
              ]}
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
        <Text style={estilos.seccionCuenta} accessibilityLiveRegion="polite">
          {cargandoCatalogo
            ? 'Actualizando…'
            : `${filtrados.length} ${
                filtrados.length === 1 ? 'producto' : 'productos'
              }`}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={datosGrilla}
        key={`catalogo-${columnas}`}
        numColumns={columnas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          item._espacio ? (
            <View style={{ flex: 1 }} />
          ) : (
            <TarjetaProducto
              producto={item}
              columnas={columnas}
              onAgregar={onAgregar}
              onComprar={onComprarAhora}
              onAbrirProducto={setProductoVisto}
              onConsultarIA={consultarIA}
            />
          )
        }
        columnWrapperStyle={columnas > 1 ? estilos.filaProductos : undefined}
        ListHeaderComponent={cabecera}
        ListEmptyComponent={
          cargandoCatalogo ? (
            <EsqueletoCatalogo columnas={columnas} />
          ) : (
            <View style={estilos.vacio}>
              <Text style={estilos.vacioIcono}>🍰</Text>
              <Text style={estilos.vacioTitulo}>No encontramos productos</Text>
              <Text style={estilos.vacioTexto}>
                Prueba con otra palabra o ajusta los filtros de búsqueda.
              </Text>
              {hayBusquedaOFiltros && (
                <Pressable
                  onPress={limpiarTodo}
                  accessibilityRole="button"
                  accessibilityLabel="Limpiar búsqueda y filtros"
                  style={({ pressed }) => [
                    estilos.vacioResetBtn,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={estilos.vacioResetTexto}>
                    Limpiar búsqueda y filtros
                  </Text>
                </Pressable>
              )}
            </View>
          )
        }
        ListFooterComponent={
          <FooterTienda
            onAbrirLegal={onAbrirLegal}
            onErrorEnlace={onMostrarError}
          />
        }
        contentContainerStyle={estilos.contenido}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        style={{ flex: 1, backgroundColor: colores.laca }}
      />

      <ModalProducto
        producto={productoVisto}
        visible={Boolean(productoVisto)}
        onCerrar={() => setProductoVisto(null)}
        onAgregar={(producto) => {
          setProductoVisto(null);
          onAgregar(producto);
        }}
        onConsultarIA={consultarIA}
      />
    </View>
  );
}
