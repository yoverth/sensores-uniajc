import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import EncabezadoAdaptativo from '../components/EncabezadoAdaptativo';
import Navegacion from '../components/Navegacion';
import TituloSeccion from '../components/TituloSeccion';
import Alerta from '../components/Alerta';
import {
  ETIQUETAS_INTENCION,
  UMBRAL_CONFIANZA,
  UMBRAL_DIFERENCIA,
  clasificarIntencion,
} from '../logic/modeloIA';
import { formatearCOP } from '../logic/formato';
import estilosGlobales from '../styles';
import { colores } from '../estilosTienda';

/* =========================================================
   ASISTENTE IA · CONSULTAS SOBRE EL CATÁLOGO REAL

   El listado llega por props (`productos`), de modo que el
   asistente siempre trabaja con el catálogo vigente sin duplicar
   datos. La intención se clasifica localmente con `modeloIA.js`.
========================================================= */

const SUGERENCIAS = [
  '¿Cuánto cuesta este producto?',
  '¿Cómo se llama este artículo?',
  '¿Qué características tiene?',
];

/* Opciones manuales que se ofrecen cuando el clasificador no puede
   decidir (pregunta ambigua o fuera de contexto). */
const OPCIONES_MANUALES = [
  { intencion: 'nombre', icono: '🏷️', texto: 'Ver Nombre' },
  { intencion: 'precio', icono: '💲', texto: 'Ver Precio' },
  { intencion: 'descripcion', icono: '📋', texto: 'Ver Descripción' },
];

function obtenerFuenteImagen(imagen) {
  if (!imagen) return null;
  return typeof imagen === 'string' ? { uri: imagen } : imagen;
}

function construirRespuesta(intencion, producto) {
  const nombre = producto?.nombre || 'Este producto';

  if (intencion === 'precio') {
    const precio = Number(producto?.precio);

    if (
      producto?.precio === undefined ||
      producto?.precio === null ||
      Number.isNaN(precio)
    ) {
      return `No hay un precio registrado para ${nombre}.`;
    }

    return `El precio de ${nombre} es ${formatearCOP(precio)}.`;
  }

  if (intencion === 'nombre') {
    return producto?.nombre
      ? `El producto seleccionado se llama ${producto.nombre}.`
      : 'El producto seleccionado no tiene un nombre registrado.';
  }

  if (intencion === 'descripcion') {
    if (!producto?.descripcion) {
      return `No hay una descripción registrada para ${nombre}.`;
    }

    const descripcion = String(producto.descripcion).trim();
    const cierre = /[.!?]$/.test(descripcion) ? '' : '.';
    const categoria = producto.categoria
      ? ` Categoría: ${producto.categoria}.`
      : '';

    return `${nombre}: ${descripcion}${cierre}${categoria}`;
  }

  return 'No pude generar una respuesta para este producto.';
}

export default function AsistenteIA({
  productos = [],
  pestana,
  setPestana,
  onSalir,
  embebido = false,
}) {
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState(null);
  const [indice, setIndice] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [entradaFoco, setEntradaFoco] = useState(false);

  const { width } = useWindowDimensions();
  const esAmplia = width >= 860;

  /* Momento del asistente: la respuesta entra asentándose
     (opacidad + desplazamiento corto), sin rebote. */
  const opacidadRespuesta = useRef(new Animated.Value(1)).current;
  const desplazamientoRespuesta = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!respuesta) return;

    opacidadRespuesta.setValue(0);
    desplazamientoRespuesta.setValue(10);
    Animated.parallel([
      Animated.timing(opacidadRespuesta, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(desplazamientoRespuesta, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [respuesta, opacidadRespuesta, desplazamientoRespuesta]);

  const lista = Array.isArray(productos) ? productos : [];
  const total = lista.length;
  const indiceSeguro = total > 0 ? indice % total : 0;
  const producto = total > 0 ? lista[indiceSeguro] : null;
  const fuenteImagen = producto ? obtenerFuenteImagen(producto.imagen) : null;

  const precioDisponible =
    producto?.precio !== undefined &&
    producto?.precio !== null &&
    !Number.isNaN(Number(producto.precio));

  function registrarHistorial(texto, textoRespuesta, ok) {
    setHistorial((actual) =>
      [
        {
          id: `${Date.now()}-${actual.length}-${Math.random()
            .toString(36)
            .slice(2, 7)}`,
          pregunta: texto,
          texto: textoRespuesta,
          ok,
        },
        ...actual,
      ].slice(0, 4)
    );
  }

  function responder(textoOriginal) {
    const texto = String(textoOriginal ?? '').trim();

    if (total === 0) {
      setRespuesta({
        tipo: 'error',
        titulo: 'Catálogo vacío',
        texto:
          'No hay productos disponibles. Verifica el listado que recibe el asistente por props.',
      });
      return;
    }

    if (!texto) {
      setRespuesta({
        tipo: 'error',
        titulo: 'Pregunta vacía',
        texto:
          'Escribe una pregunta antes de consultar. Por ejemplo: "¿Cuánto cuesta este producto?".',
      });
      return;
    }

    const resultado = clasificarIntencion(texto);

    if (!resultado.valida) {
      const ambigua = resultado.motivo === 'ambigua';

      const detalle = ambigua
        ? 'La pregunta se parece a más de una intención y prefiero no adivinar.'
        : 'No encontré suficientes palabras clave sobre precio, nombre o descripción.';

      const mensaje = `${detalle} Elige un dato con las opciones de abajo o escribe otra pregunta como "¿Cuánto cuesta?" o "¿Qué características tiene?".`;

      /* Evidencia del clasificador: similitudes de las dos mejores
         intenciones y la diferencia frente al umbral de ambigüedad. */
      const porcentaje = (v) => `${Math.round(v * 100)}%`;
      const evidencia =
        ambigua && resultado.intencion && resultado.segundaIntencion
          ? `Similitudes: ${resultado.intencion} ${porcentaje(
              resultado.confianza
            )} · ${resultado.segundaIntencion} ${porcentaje(
              resultado.segundaConfianza
            )} · diferencia ${resultado.diferencia.toFixed(
              2
            )} < umbral ${UMBRAL_DIFERENCIA.toFixed(2)}.`
          : `Confianza máxima: ${porcentaje(
              resultado.confianza
            )} < umbral mínimo ${porcentaje(UMBRAL_CONFIANZA)}.`;

      setRespuesta({
        tipo: 'error',
        titulo: ambigua ? 'Pregunta ambigua' : 'Intención no reconocida',
        texto: mensaje,
        evidencia,
        muestraOpciones: total > 0,
      });
      registrarHistorial(texto, mensaje, false);
      return;
    }

    const textoRespuesta = construirRespuesta(resultado.intencion, producto);

    setRespuesta({
      tipo: 'exito',
      titulo: ETIQUETAS_INTENCION[resultado.intencion] || 'Respuesta',
      texto: textoRespuesta,
      confianza: resultado.confianza,
      intencion: resultado.intencion,
    });
    registrarHistorial(texto, textoRespuesta, true);
  }

  function consultar() {
    responder(pregunta);
  }

  function siguienteProducto() {
    if (total === 0) return;

    setIndice((actual) => (actual + 1) % total);
    setPregunta('');
    setRespuesta(null);
  }

  function usarSugerencia(texto) {
    setPregunta(texto);
    responder(texto);
  }

  /* Respuesta manual: el usuario elige el dato cuando el clasificador
     no pudo decidir. Sale siempre del producto activo. */
  function responderManual(intencion) {
    if (total === 0 || !producto) return;

    const etiqueta = ETIQUETAS_INTENCION[intencion] || 'Respuesta';
    const textoRespuesta = construirRespuesta(intencion, producto);

    setRespuesta({
      tipo: 'exito',
      titulo: etiqueta,
      texto: textoRespuesta,
      manual: true,
      intencion,
    });
    registrarHistorial(`${etiqueta} (opción manual)`, textoRespuesta, true);
  }

  const estiloRespuesta =
    respuesta?.tipo === 'error'
      ? estilos.respuestaError
      : respuesta?.tipo === 'exito'
        ? estilos.respuestaExito
        : estilos.respuestaNeutra;

  return (
    <View style={[estilosGlobales.container, estilos.fondo]}>
      <KeyboardAvoidingView
        style={estilos.flex}
        behavior={Platform.select({
          ios: 'padding',
          android: 'height',
          default: undefined,
        })}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={[estilosGlobales.contenido, estilos.contenido]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {embebido ? (
            onSalir ? (
              <Pressable
                onPress={onSalir}
                accessibilityRole="button"
                accessibilityLabel="Volver al catálogo de la tienda"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={[estilosGlobales.botonVolverTienda, estilos.volverTienda]}
              >
                <Text
                  style={[
                    estilosGlobales.botonVolverTiendaTexto,
                    estilos.volverTiendaTexto,
                  ]}
                >
                  ← Volver al catálogo
                </Text>
              </Pressable>
            ) : null
          ) : (
            <>
              <EncabezadoAdaptativo onSalir={onSalir} />
              <Navegacion pestana={pestana} setPestana={setPestana} />
            </>
          )}

          <TituloSeccion
            titulo="Asistente IA"
            descripcion="Pregunta por el precio, el nombre o la descripción del producto activo. Todo se procesa localmente."
            estiloTitulo={estilos.tituloTexto}
            estiloDescripcion={estilos.tituloDescripcion}
          />

          <View style={estilos.indicadores}>
            <View style={estilos.indicador}>
              <Text style={estilos.indicadorClave}>MODELO</Text>
              <Text style={estilos.indicadorValor}>1-NN</Text>
            </View>
            <View style={estilos.indicador}>
              <Text style={estilos.indicadorClave}>PROCESAMIENTO</Text>
              <Text style={estilos.indicadorValor}>100% local</Text>
            </View>
            <View style={estilos.indicador}>
              <Text style={estilos.indicadorClave}>CATÁLOGO</Text>
              <Text style={estilos.indicadorValor}>
                {total} {total === 1 ? 'producto' : 'productos'}
              </Text>
            </View>
          </View>

          {total === 0 && (
            <Alerta
              icono="📭"
              titulo="Catálogo vacío"
              descripcion="El asistente necesita al menos un producto para responder. Revisa el listado que se inyecta por props."
            />
          )}

          <View
            style={[estilos.paneles, esAmplia && estilos.panelesAmplios]}
          >
            {/* ---------- PRODUCTO ACTIVO ---------- */}
            {producto && (
              <View
                style={[estilos.panel, esAmplia && estilos.panelMitad]}
                accessibilityLabel={`Producto activo: ${producto.nombre}`}
              >
                <View style={estilos.panelCabecera}>
                  <Text style={estilos.panelEtiqueta}>PRODUCTO ACTIVO</Text>
                  <View style={estilos.contador}>
                    <Text style={estilos.contadorTexto}>
                      Producto {indiceSeguro + 1} de {total}
                    </Text>
                  </View>
                </View>

                {fuenteImagen ? (
                  <Image
                    source={fuenteImagen}
                    style={[
                      estilos.productoImagen,
                      esAmplia && estilos.productoImagenAmplia,
                    ]}
                    resizeMode="cover"
                    accessibilityLabel={`Imagen de ${producto.nombre}`}
                  />
                ) : (
                  <View style={estilos.imagenVacia}>
                    <Text style={estilos.imagenVaciaIcono}>🍰</Text>
                    <Text style={estilos.imagenVaciaTexto}>
                      Sin imagen disponible
                    </Text>
                  </View>
                )}

                <Text style={estilos.productoNombre}>
                  {producto.nombre || 'Producto sin nombre'}
                </Text>

                {producto.categoria ? (
                  <Text style={estilos.productoCategoria}>
                    {String(producto.categoria).toUpperCase()}
                  </Text>
                ) : null}

                <Text style={estilos.productoPrecio}>
                  {precioDisponible
                    ? formatearCOP(producto.precio)
                    : 'Precio no registrado'}
                </Text>

                <Text style={estilos.productoDescripcion}>
                  {producto.descripcion || 'Sin descripción registrada.'}
                </Text>

                <Pressable
                  onPress={siguienteProducto}
                  accessibilityRole="button"
                  accessibilityLabel="Ver el siguiente producto del catálogo"
                  accessibilityHint="Avanza de forma cíclica al siguiente producto"
                  style={({ pressed }) => [
                    estilos.botonProducto,
                    pressed && estilos.botonSecundarioPresionado,
                  ]}
                >
                  <Text style={estilos.botonSecundarioTexto}>
                    Siguiente producto →
                  </Text>
                </Pressable>
              </View>
            )}

            {/* ---------- CONSULTA ---------- */}
            <View
              style={[
                estilos.panel,
                esAmplia && producto && estilos.panelMitad,
                !producto && estilos.panelCompleto,
              ]}
            >
              <View style={estilos.panelCabecera}>
                <Text style={estilos.panelEtiqueta}>CONSULTA</Text>
                <Text style={estilos.modeloBadge}>CLASIFICADOR LOCAL</Text>
              </View>

              <Text style={estilos.ayuda}>
                {producto
                  ? `Consultando: ${producto.nombre}`
                  : 'No hay un producto activo porque el catálogo está vacío.'}
              </Text>

              <TextInput
                value={pregunta}
                onChangeText={setPregunta}
                editable={total > 0}
                placeholder="Ej. ¿Cuánto cuesta este producto?"
                placeholderTextColor={colores.textoTenue}
                accessibilityLabel="Pregunta sobre el producto seleccionado"
                accessibilityHint="Escribe una pregunta sobre precio, nombre o descripción"
                onFocus={() => setEntradaFoco(true)}
                onBlur={() => setEntradaFoco(false)}
                style={[
                  estilos.entrada,
                  entradaFoco && estilos.entradaFoco,
                  total === 0 && estilos.entradaDeshabilitada,
                ]}
                returnKeyType="send"
                onSubmitEditing={consultar}
                submitBehavior="submit"
                autoCorrect={false}
              />

              <View style={estilos.sugerencias}>
                {SUGERENCIAS.map((sugerencia) => (
                  <Pressable
                    key={sugerencia}
                    onPress={() => usarSugerencia(sugerencia)}
                    disabled={total === 0}
                    accessibilityRole="button"
                    accessibilityLabel={`Usar pregunta: ${sugerencia}`}
                    accessibilityState={{ disabled: total === 0 }}
                    style={({ pressed }) => [
                      estilos.sugerencia,
                      pressed && estilos.sugerenciaPresionado,
                      total === 0 && estilos.botonDeshabilitado,
                    ]}
                  >
                    <Text style={estilos.sugerenciaTexto}>{sugerencia}</Text>
                  </Pressable>
                ))}
              </View>

              <View style={estilos.botones}>
                <Pressable
                  onPress={consultar}
                  disabled={total === 0}
                  accessibilityRole="button"
                  accessibilityLabel="Consultar al asistente"
                  accessibilityState={{ disabled: total === 0 }}
                  style={({ pressed }) => [
                    estilos.botonPrimario,
                    total === 0 && estilos.botonDeshabilitado,
                    pressed && estilos.botonPrimarioPresionado,
                  ]}
                >
                  <Text style={estilos.botonPrimarioTexto}>Consultar</Text>
                </Pressable>

                {producto && (
                  <Pressable
                    onPress={siguienteProducto}
                    accessibilityRole="button"
                    accessibilityLabel="Siguiente producto"
                    style={({ pressed }) => [
                      estilos.botonSecundario,
                      pressed && estilos.botonSecundarioPresionado,
                    ]}
                  >
                    <Text style={estilos.botonSecundarioTexto}>
                      Siguiente producto
                    </Text>
                  </Pressable>
                )}
              </View>

              {/* ---------- RESPUESTA / VALIDACIÓN ---------- */}
              <Animated.View
                style={[
                  estilos.respuesta,
                  estiloRespuesta,
                  {
                    opacity: opacidadRespuesta,
                    transform: [{ translateY: desplazamientoRespuesta }],
                  },
                ]}
                accessibilityLiveRegion="polite"
              >
                <Text
                  style={[
                    estilos.respuestaEtiqueta,
                    respuesta?.tipo === 'error' && estilos.respuestaEtiquetaError,
                  ]}
                >
                  {respuesta
                    ? respuesta.tipo === 'exito'
                      ? `INTENCIÓN · ${respuesta.titulo.toUpperCase()}`
                      : 'VALIDACIÓN'
                    : 'RESPUESTA'}
                </Text>

                <Text
                  style={[
                    estilos.respuestaTexto,
                    respuesta?.tipo === 'error' && estilos.respuestaTextoError,
                  ]}
                >
                  {respuesta
                    ? respuesta.texto
                    : 'Escribe una pregunta o toca una sugerencia para comenzar.'}
                </Text>

                {respuesta?.evidencia && (
                  <Text style={estilos.evidencia}>{respuesta.evidencia}</Text>
                )}

                {respuesta?.confianza !== undefined && (
                  <Text style={estilos.confianza}>
                    Confianza del clasificador:{' '}
                    {Math.round(respuesta.confianza * 100)}%
                  </Text>
                )}

                {respuesta?.manual && (
                  <Text style={estilos.confianza}>
                    Dato verificado del producto activo (selección manual).
                  </Text>
                )}
              </Animated.View>

              {/* ---------- OPCIONES MANUALES ---------- */}
              {respuesta?.muestraOpciones && producto && (
                <View style={estilos.opciones}>
                  <Text style={estilos.opcionesTitulo}>
                    Elige el dato que quieres ver de {producto.nombre}:
                  </Text>

                  <View style={estilos.opcionesFila}>
                    {OPCIONES_MANUALES.map((opcion) => (
                      <Pressable
                        key={opcion.intencion}
                        onPress={() => responderManual(opcion.intencion)}
                        accessibilityRole="button"
                        accessibilityLabel={`${opcion.texto} de ${producto.nombre}`}
                        style={({ pressed }) => [
                          estilos.opcion,
                          pressed && estilos.opcionPresionado,
                        ]}
                      >
                        <Text style={estilos.opcionTexto}>
                          {opcion.icono} {opcion.texto}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              {/* ---------- HISTORIAL ---------- */}
              {historial.length > 0 && (
                <View style={estilos.historial}>
                  <Text style={estilos.historialTitulo}>Historial reciente</Text>

                  {historial.map((item) => (
                    <View
                      key={item.id}
                      style={[
                        estilos.historialItem,
                        !item.ok && estilos.historialItemError,
                      ]}
                    >
                      <Text style={estilos.historialPregunta} numberOfLines={2}>
                        {item.pregunta}
                      </Text>
                      <Text
                        style={[
                          estilos.historialTexto,
                          !item.ok && estilos.historialTextoError,
                        ]}
                        numberOfLines={2}
                      >
                        {item.texto}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          <Text style={estilos.notaPie}>
            El clasificador compara tu pregunta con ejemplos de entrenamiento
            mediante similitud de coseno y rechaza consultas ambiguas o fuera de
            contexto. No se envía información a internet.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* =========================================================
   ESTILOS · SISTEMA NEO KINPAKU (tokens de estilosTienda)
   Misma base visual que la tienda: laca negra, oro kinpaku
   como acento y pátina para los estados vivos.
========================================================= */

const estilos = StyleSheet.create({
  flex: { flex: 1 },
  fondo: { backgroundColor: colores.laca },
  volverTienda: {
    backgroundColor: colores.grafito,
    borderColor: colores.hairline,
    borderRadius: 4,
  },
  volverTiendaTexto: {
    color: colores.oro,
    fontWeight: '600',
  },
  tituloTexto: {
    color: colores.champán,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  tituloDescripcion: {
    color: colores.textoSuave,
    fontSize: 13,
    lineHeight: 19,
  },
  contenido: {
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
  },
  indicadores: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  indicador: {
    flexGrow: 1,
    minWidth: 130,
    backgroundColor: colores.panel,
    borderWidth: 1,
    borderColor: colores.hairline,
    borderRadius: 4,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  indicadorClave: {
    color: colores.textoTenue,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  indicadorValor: {
    color: colores.champán,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },
  paneles: { gap: 16 },
  panelesAmplios: { flexDirection: 'row', alignItems: 'flex-start' },
  panelMitad: { flex: 1, minWidth: 0 },
  panelCompleto: { width: '100%' },
  panel: {
    backgroundColor: colores.panel,
    borderWidth: 1,
    borderColor: colores.hairline,
    borderRadius: 4,
    padding: 16,
  },
  panelCabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  panelEtiqueta: {
    color: colores.oro,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.3,
  },
  contador: {
    backgroundColor: colores.patinaTinte,
    borderWidth: 1,
    borderColor: colores.patinaBorde,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  contadorTexto: { color: colores.patinaTexto, fontSize: 11, fontWeight: '700' },
  modeloBadge: {
    color: colores.patinaTexto,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    backgroundColor: colores.patinaTinte,
    borderWidth: 1,
    borderColor: colores.patinaBorde,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  productoImagen: {
    width: '100%',
    height: 175,
    borderRadius: 4,
    backgroundColor: colores.grafito,
    marginBottom: 12,
  },
  productoImagenAmplia: { height: 215 },
  imagenVacia: {
    width: '100%',
    height: 140,
    borderRadius: 4,
    backgroundColor: colores.grafito,
    borderWidth: 1,
    borderColor: colores.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  imagenVaciaIcono: { fontSize: 34 },
  imagenVaciaTexto: { color: colores.textoTenue, fontSize: 12, marginTop: 6 },
  productoNombre: {
    color: colores.champán,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  productoCategoria: {
    color: colores.oro,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginTop: 5,
  },
  productoPrecio: {
    color: colores.oro,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
    letterSpacing: -0.3,
  },
  productoDescripcion: {
    color: colores.textoSuave,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 14,
  },
  ayuda: {
    color: colores.textoSuave,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  entrada: {
    width: '100%',
    backgroundColor: colores.grafito,
    borderWidth: 1,
    borderColor: colores.hairline,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 48,
    color: colores.champán,
    fontSize: 14,
  },
  entradaFoco: { borderColor: colores.hairlineFuerte },
  entradaDeshabilitada: { opacity: 0.55 },
  sugerencias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  sugerencia: {
    backgroundColor: colores.grafito,
    borderWidth: 1,
    borderColor: colores.hairline,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxWidth: '100%',
  },
  sugerenciaPresionado: {
    backgroundColor: colores.grafito2,
    borderColor: colores.hairlineFuerte,
  },
  sugerenciaTexto: {
    color: colores.texto,
    fontSize: 12,
    fontWeight: '600',
  },
  botones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    marginBottom: 12,
  },
  botonPrimario: {
    flex: 1,
    minWidth: 140,
    minHeight: 46,
    borderRadius: 2,
    backgroundColor: colores.oro,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  botonPrimarioPresionado: { backgroundColor: colores.oroSuave },
  botonPrimarioTexto: {
    color: colores.darkInk,
    fontSize: 13,
    fontWeight: '700',
  },
  botonSecundario: {
    flex: 1,
    minWidth: 150,
    minHeight: 46,
    borderRadius: 2,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colores.hairlineFuerte,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginTop: 0,
  },
  botonSecundarioPresionado: {
    backgroundColor: colores.oroActivo,
    borderColor: colores.oro,
  },
  botonProducto: {
    minHeight: 46,
    borderRadius: 2,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colores.hairlineFuerte,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  botonSecundarioTexto: {
    color: colores.oro,
    fontSize: 12,
    fontWeight: '600',
  },
  botonDeshabilitado: { opacity: 0.45 },
  respuesta: {
    minHeight: 112,
    borderRadius: 4,
    borderWidth: 1,
    padding: 16,
    justifyContent: 'center',
  },
  respuestaNeutra: {
    backgroundColor: colores.grafito,
    borderColor: colores.hairline,
  },
  respuestaExito: {
    backgroundColor: colores.exitoTinte,
    borderColor: colores.patinaBorde,
  },
  respuestaError: {
    backgroundColor: colores.errorTinte,
    borderColor: colores.errorBorde,
  },
  respuestaEtiqueta: {
    color: colores.patinaTexto,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  respuestaEtiquetaError: { color: colores.errorTexto },
  respuestaTexto: {
    color: colores.champán,
    fontSize: 13,
    lineHeight: 20,
  },
  respuestaTextoError: { color: colores.errorTexto },
  confianza: {
    color: colores.textoTenue,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  evidencia: {
    fontFamily: 'monospace',
    color: colores.patinaTexto,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    lineHeight: 16,
  },
  opciones: {
    borderTopWidth: 1,
    borderTopColor: colores.hairline,
    marginTop: 12,
    paddingTop: 12,
  },
  opcionesTitulo: {
    color: colores.champán,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  opcionesFila: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  opcion: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colores.hairlineFuerte,
    backgroundColor: 'transparent',
    minWidth: 110,
  },
  opcionPresionado: {
    backgroundColor: colores.oroActivo,
    borderColor: colores.oro,
  },
  opcionTexto: {
    color: colores.oro,
    fontSize: 13,
    fontWeight: '700',
  },
  historial: {
    borderTopWidth: 1,
    borderTopColor: colores.hairline,
    marginTop: 14,
    paddingTop: 12,
  },
  historialTitulo: {
    color: colores.champán,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  historialItem: {
    borderLeftWidth: 1,
    borderLeftColor: colores.patina,
    paddingLeft: 10,
    marginBottom: 9,
  },
  historialItemError: { borderLeftColor: colores.error },
  historialPregunta: {
    color: colores.texto,
    fontSize: 12,
    fontWeight: '600',
  },
  historialTexto: {
    color: colores.textoTenue,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3,
  },
  historialTextoError: { color: colores.errorTexto },
  notaPie: {
    color: colores.textoTenue,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 16,
    alignSelf: 'center',
    maxWidth: 620,
  },
});
