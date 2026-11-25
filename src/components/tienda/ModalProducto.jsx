import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { nombreCategoria } from '../../data/catalogo';
import { formatearCOP } from '../../logic/formato';
import { useTema } from '../../theme/TemaContexto';
import { EVENTOS_ANALITICA, registrarEvento } from '../../services/analitica';

/* =========================================================
   VISOR DEL PRODUCTO (lightbox con zoom libre 1x–4x)
   - Móvil / Tablet: pellizco con dos dedos (PanResponder),
     arrastre con un dedo cuando está ampliada y doble toque
     para restablecer a 1x.
   - Web / Escritorio: zoom continuo con rueda del ratón o
     pellizco en trackpad (wheel), arrastre con puntero y
     doble clic para restablecer a 1x.
   - `overflow: 'hidden'` evita que la imagen tape el botón ✕
     o la ficha del producto.
========================================================= */

const ESCALA_MIN = 1;
const ESCALA_MAX = 4;
const USAR_DRIVER_NATIVO = Platform.OS !== 'web';

function leerPunto(toque) {
  if (!toque) return { x: 0, y: 0 };
  const x = Number.isFinite(toque.pageX)
    ? toque.pageX
    : toque.locationX || 0;
  const y = Number.isFinite(toque.pageY)
    ? toque.pageY
    : toque.locationY || 0;
  return { x, y };
}

function distanciaEntreToques(touches) {
  if (!touches || touches.length < 2) return 1;
  const p0 = leerPunto(touches[0]);
  const p1 = leerPunto(touches[1]);
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function centroEntreToques(touches) {
  if (!touches || touches.length < 2) return { x: 0, y: 0 };
  const p0 = leerPunto(touches[0]);
  const p1 = leerPunto(touches[1]);
  return {
    x: (p0.x + p1.x) / 2,
    y: (p0.y + p1.y) / 2,
  };
}

export default function ModalProducto({
  producto,
  visible,
  onCerrar,
  onAgregar,
  onConsultarIA,
}) {
  const { estilos, colores } = useTema();
  const [estaAmpliada, setEstaAmpliada] = useState(false);
  const [tocandoFoto, setTocandoFoto] = useState(false);
  const [nodoWeb, setNodoWeb] = useState(null);

  const escalaAnim = useRef(new Animated.Value(1)).current;
  const traslacionAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const escalaRef = useRef(1);
  const traslacionRef = useRef({ x: 0, y: 0 });
  const tamanoContenedorRef = useRef({ width: 0, height: 0 });
  const contenedorRef = useRef(null);
  const asignarContenedorRef = useCallback((el) => {
    contenedorRef.current = el;
    if (Platform.OS === 'web') {
      setNodoWeb(el);
    }
  }, []);
  const productoRef = useRef(producto);
  const zoomRegistradoRef = useRef(false);
  const ultimoToqueRef = useRef(0);
  const estaAmpliadaRef = useRef(false);

  const gestoRef = useRef({
    modo: null,
    distanciaInicial: 0,
    escalaBase: 1,
    panBase: { x: 0, y: 0 },
    centroInicial: { x: 0, y: 0 },
    offsetDx: 0,
    offsetDy: 0,
    movido: false,
  });

  productoRef.current = producto;

  function actualizarEstadoAmpliada(nuevaEscala) {
    const ampliada = nuevaEscala > 1.02;
    if (estaAmpliadaRef.current !== ampliada) {
      estaAmpliadaRef.current = ampliada;
      setEstaAmpliada(ampliada);
    }
  }

  function acotarTraslacion(x, y, escala) {
    const medida = tamanoContenedorRef.current;
    const width = medida.width || 320;
    const height = medida.height || 280;
    if (escala <= 1.001) {
      return { x: 0, y: 0 };
    }
    const maxX = (width * (escala - 1)) / 2;
    const maxY = (height * (escala - 1)) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }

  function registrarZoomLibreSiAplica(escala) {
    if (escala > 1.08 && !zoomRegistradoRef.current && productoRef.current) {
      zoomRegistradoRef.current = true;
      registrarEvento(EVENTOS_ANALITICA.VER_ZOOM_PRODUCTO, {
        productoId: productoRef.current.id,
        nombre: productoRef.current.nombre,
        accion: 'zoom_libre',
      });
    }
  }

  function aplicarTransformacion(escala, x, y) {
    const acotada = Math.max(ESCALA_MIN, Math.min(ESCALA_MAX, escala));
    const pos = acotarTraslacion(x, y, acotada);

    escalaRef.current = acotada;
    traslacionRef.current = pos;
    escalaAnim.setValue(acotada);
    traslacionAnim.setValue(pos);

    actualizarEstadoAmpliada(acotada);
    registrarZoomLibreSiAplica(acotada);
  }

  function restablecerZoom(animar = true) {
    escalaRef.current = 1;
    traslacionRef.current = { x: 0, y: 0 };
    zoomRegistradoRef.current = false;
    setTocandoFoto(false);
    actualizarEstadoAmpliada(1);

    if (animar) {
      Animated.parallel([
        Animated.spring(escalaAnim, {
          toValue: 1,
          friction: 7,
          tension: 75,
          useNativeDriver: USAR_DRIVER_NATIVO,
        }),
        Animated.spring(traslacionAnim, {
          toValue: { x: 0, y: 0 },
          friction: 7,
          tension: 75,
          useNativeDriver: USAR_DRIVER_NATIVO,
        }),
      ]).start();
    } else {
      escalaAnim.setValue(1);
      traslacionAnim.setValue({ x: 0, y: 0 });
    }
  }

  useEffect(() => {
    if (!visible) {
      restablecerZoom(false);
      return;
    }

    restablecerZoom(false);

    if (producto) {
      registrarEvento(EVENTOS_ANALITICA.VER_ZOOM_PRODUCTO, {
        productoId: producto.id,
        nombre: producto.nombre,
        accion: 'abrir',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, producto?.id]);

  /* En navegador Web: rueda del ratón / pellizco trackpad y doble clic sin bloqueos pasivos. */
  useEffect(() => {
    if (Platform.OS !== 'web' || !visible) return undefined;

    const nodo = nodoWeb || contenedorRef.current;
    if (!nodo || typeof nodo.addEventListener !== 'function') return undefined;

    const manejarRueda = (evento) => {
      evento.preventDefault();
      evento.stopPropagation();

      const intensidad = evento.ctrlKey ? 0.01 : 0.0022;
      const factor = Math.exp(-evento.deltaY * intensidad);
      const escalaAnterior = escalaRef.current;
      const nuevaEscala = Math.max(
        ESCALA_MIN,
        Math.min(ESCALA_MAX, escalaAnterior * factor)
      );

      if (nuevaEscala <= 1.005) {
        aplicarTransformacion(1, 0, 0);
        return;
      }

      let nuevoX = traslacionRef.current.x;
      let nuevoY = traslacionRef.current.y;

      if (typeof nodo.getBoundingClientRect === 'function') {
        const rect = nodo.getBoundingClientRect();
        const cx = evento.clientX - (rect.left + rect.width / 2);
        const cy = evento.clientY - (rect.top + rect.height / 2);
        const razon = nuevaEscala / escalaAnterior;
        nuevoX = traslacionRef.current.x * razon + cx * (1 - razon);
        nuevoY = traslacionRef.current.y * razon + cy * (1 - razon);
      }

      aplicarTransformacion(nuevaEscala, nuevoX, nuevoY);
    };

    const manejarDobleClic = () => {
      if (escalaRef.current > 1.02) {
        restablecerZoom(true);
      }
    };

    nodo.addEventListener('wheel', manejarRueda, { passive: false });
    nodo.addEventListener('dblclick', manejarDobleClic);

    return () => {
      nodo.removeEventListener('wheel', manejarRueda);
      nodo.removeEventListener('dblclick', manejarDobleClic);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, nodoWeb, producto?.id]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
        onPanResponderGrant: (evt) => {
          setTocandoFoto(true);
          const touches = evt.nativeEvent.touches || [];

          if (touches.length >= 2) {
            gestoRef.current = {
              modo: 'pinch',
              distanciaInicial: Math.max(1, distanciaEntreToques(touches)),
              escalaBase: escalaRef.current,
              panBase: { ...traslacionRef.current },
              centroInicial: centroEntreToques(touches),
              offsetDx: 0,
              offsetDy: 0,
              movido: true,
            };
          } else {
            gestoRef.current = {
              modo: 'pan',
              distanciaInicial: 0,
              escalaBase: escalaRef.current,
              panBase: { ...traslacionRef.current },
              centroInicial: { x: 0, y: 0 },
              offsetDx: 0,
              offsetDy: 0,
              movido: false,
            };
          }
        },
        onPanResponderMove: (evt, gestureState) => {
          const touches = evt.nativeEvent.touches || [];

          if (touches.length >= 2) {
            if (gestoRef.current.modo !== 'pinch') {
              gestoRef.current = {
                modo: 'pinch',
                distanciaInicial: Math.max(1, distanciaEntreToques(touches)),
                escalaBase: escalaRef.current,
                panBase: { ...traslacionRef.current },
                centroInicial: centroEntreToques(touches),
                offsetDx: 0,
                offsetDy: 0,
                movido: true,
              };
              return;
            }

            const distActual = Math.max(1, distanciaEntreToques(touches));
            const nuevaEscala =
              gestoRef.current.escalaBase *
              (distActual / gestoRef.current.distanciaInicial);
            const centroActual = centroEntreToques(touches);
            const dxCentro =
              centroActual.x - gestoRef.current.centroInicial.x;
            const dyCentro =
              centroActual.y - gestoRef.current.centroInicial.y;

            aplicarTransformacion(
              nuevaEscala,
              gestoRef.current.panBase.x + dxCentro,
              gestoRef.current.panBase.y + dyCentro
            );
            return;
          }

          if (gestoRef.current.modo === 'pinch') {
            gestoRef.current = {
              modo: 'pan',
              distanciaInicial: 0,
              escalaBase: escalaRef.current,
              panBase: { ...traslacionRef.current },
              centroInicial: { x: 0, y: 0 },
              offsetDx: gestureState.dx,
              offsetDy: gestureState.dy,
              movido: true,
            };
            return;
          }

          if (escalaRef.current > 1.02) {
            if (
              Math.abs(gestureState.dx) > 3 ||
              Math.abs(gestureState.dy) > 3
            ) {
              gestoRef.current.movido = true;
            }

            const dx = gestureState.dx - (gestoRef.current.offsetDx || 0);
            const dy = gestureState.dy - (gestoRef.current.offsetDy || 0);

            aplicarTransformacion(
              escalaRef.current,
              gestoRef.current.panBase.x + dx,
              gestoRef.current.panBase.y + dy
            );
          }
        },
        onPanResponderRelease: (_evt, gestureState) => {
          const sinArrastre =
            !gestoRef.current.movido &&
            Math.abs(gestureState.dx) < 6 &&
            Math.abs(gestureState.dy) < 6;

          if (sinArrastre) {
            const ahora = Date.now();
            if (
              ahora - ultimoToqueRef.current < 280 &&
              escalaRef.current > 1.02
            ) {
              restablecerZoom(true);
              ultimoToqueRef.current = 0;
            } else {
              ultimoToqueRef.current = ahora;
            }
          } else if (escalaRef.current <= 1.02) {
            restablecerZoom(true);
          }

          setTocandoFoto(false);
          gestoRef.current.modo = null;
        },
        onPanResponderTerminate: () => {
          setTocandoFoto(false);
          gestoRef.current.modo = null;
          if (escalaRef.current <= 1.02) {
            restablecerZoom(true);
          }
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (!producto) return null;

  const agotado = !producto.disponible || producto.stock <= 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCerrar}
    >
      <View style={estilos.modalFondo} accessibilityViewIsModal>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onCerrar}
          accessibilityRole="button"
          accessibilityLabel="Cerrar el visor del producto"
          accessibilityHint="Vuelve al catálogo de la tienda"
        />

        <View style={estilos.modalHoja}>
          <View style={estilos.modalCabecera}>
            <Text style={estilos.modalEtiqueta}>
              {nombreCategoria(producto.categoria)}
            </Text>

            <Pressable
              onPress={onCerrar}
              accessibilityRole="button"
              accessibilityLabel="Cerrar el visor"
              accessibilityHint="Cierra la ventana del producto"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={({ pressed }) => [
                estilos.modalCerrar,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={estilos.modalCerrarTexto}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={estilos.modalScroll}
            showsVerticalScrollIndicator={false}
            scrollEnabled={!estaAmpliada && !tocandoFoto}
          >
            <View
              ref={asignarContenedorRef}
              collapsable={false}
              onLayout={(evento) => {
                const { width, height } = evento.nativeEvent.layout;
                tamanoContenedorRef.current = { width, height };
              }}
              style={[
                estilos.modalImagenWrap,
                Platform.OS === 'web' && {
                  touchAction: 'none',
                  userSelect: 'none',
                  cursor: estaAmpliada ? 'grab' : 'zoom-in',
                },
              ]}
              {...panResponder.panHandlers}
            >
              <Animated.View
                pointerEvents="none"
                collapsable={false}
                style={[
                  estilos.modalImagen,
                  Platform.OS === 'web' && { pointerEvents: 'none' },
                  {
                    transform: [
                      { translateX: traslacionAnim.x },
                      { translateY: traslacionAnim.y },
                      { scale: escalaAnim },
                    ],
                  },
                ]}
              >
                <Image
                  source={producto.imagen}
                  style={estilos.modalImagen}
                  resizeMode="cover"
                  fadeDuration={0}
                  accessibilityLabel={`Fotografía de ${producto.nombre}`}
                />
              </Animated.View>
            </View>

            <Text style={estilos.modalNombre}>{producto.nombre}</Text>
            <Text style={estilos.modalPrecio}>
              {formatearCOP(producto.precio)}
            </Text>

            <Text style={estilos.modalDescripcion}>{producto.descripcion}</Text>

            <Text style={estilos.modalStock}>
              {agotado
                ? 'Sin existencias'
                : producto.stock <= 5
                  ? `Quedan ${producto.stock} unidades`
                  : 'Disponible para entrega'}
            </Text>

            <View style={estilos.modalAcciones}>
              <Pressable
                onPress={() => onAgregar(producto)}
                disabled={agotado}
                accessibilityRole="button"
                accessibilityLabel={`Agregar ${producto.nombre} al carrito`}
                accessibilityHint="Añade una unidad al carrito"
                accessibilityState={{ disabled: agotado }}
                style={({ pressed }) => [
                  estilos.botonAncho,
                  agotado && estilos.botonDeshabilitado,
                  pressed && estilos.botonAnchoPresionado,
                ]}
              >
                <Text style={estilos.botonAnchoTexto}>
                  {agotado ? 'Producto agotado' : 'Agregar al carrito'}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => onConsultarIA(producto)}
                accessibilityRole="button"
                accessibilityLabel={`Preguntar a la IA sobre ${producto.nombre}`}
                accessibilityHint="Abre el asistente de productos"
                style={({ pressed }) => [
                  estilos.modalBotonIA,
                  pressed && estilos.modalBotonIAPresionado,
                ]}
              >
                <Text style={estilos.modalBotonIATexto}>
                  🤖 Preguntar a la IA por este producto
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={onCerrar}
              accessibilityRole="button"
              accessibilityLabel="Cerrar el visor y volver al catálogo"
              accessibilityHint="Vuelve a la lista de productos"
              style={({ pressed }) => [
                estilos.botonClaro,
                pressed && { opacity: 0.75 },
              ]}
            >
              <Text style={estilos.botonClaroTexto}>Cerrar</Text>
            </Pressable>

            <Text style={[estilos.notaPie, { color: colores.textoTenue }]}>
              {Platform.OS === 'web'
                ? 'Usa la rueda del ratón o pellizca en el trackpad para acercar, arrastra para explorar y haz doble clic para volver a la vista original.'
                : 'Pellizca la foto con dos dedos para acercar libremente, arrastra para explorar y toca dos veces para volver al tamaño original.'}
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
