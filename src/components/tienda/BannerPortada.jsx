import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { PRODUCTOS } from '../../data/catalogo';
import { formatearCOP } from '../../logic/formato';
import { useTema } from '../../theme/TemaContexto';
import LogoMarca from './LogoMarca';

/* =========================================================
   PORTADA / BANNER PRINCIPAL TIPO CARRUSEL · PASTELERÍA LA T
   Tarjeta horizontal panorámica de dos zonas:
   - Izquierda: logotipo circular, separador vertical, titular,
     subtítulo y dos botones pill ("Agita y gana" + cupón).
   - Derecha: carrusel deslizable (pagingEnabled + auto-scroll 4s)
     con fotos reales y pills flotantes de nombre + precio (#F8C967).
   - Debajo: puntos de paginación centrados.
========================================================= */

const IDS_DESTACADOS = [
  'torta-chocolate',
  'cheesecake-frutos-rojos',
  'torta-tres-leches',
  'torta-vainilla',
  'brownie',
];

const DESTACADOS = IDS_DESTACADOS.map((id) =>
  PRODUCTOS.find((item) => item.id === id)
).filter(Boolean);

const DIAPOSITIVAS = DESTACADOS.length > 0 ? DESTACADOS : PRODUCTOS.slice(0, 5);

export default function BannerPortada({
  onAbrirAgita,
  onSeleccionarProducto,
}) {
  const { modo, colores, tokens } = useTema();
  const { width } = useWindowDimensions();
  const esAmplia = width >= 768;
  const esClaro = modo === 'claro';

  const [indice, setIndice] = useState(0);
  const [anchoCarrusel, setAnchoCarrusel] = useState(0);
  const [pausado, setPausado] = useState(false);
  const scrollRef = useRef(null);

  const styles = useMemo(
    () => crearEstilos(esClaro, esAmplia, colores, tokens),
    [esClaro, esAmplia, colores, tokens]
  );

  useEffect(() => {
    if (pausado || anchoCarrusel <= 0 || DIAPOSITIVAS.length <= 1) {
      return undefined;
    }

    const intervalo = setInterval(() => {
      setIndice((actual) => {
        const siguiente = (actual + 1) % DIAPOSITIVAS.length;
        scrollRef.current?.scrollTo({
          x: siguiente * anchoCarrusel,
          animated: true,
        });
        return siguiente;
      });
    }, 4000);

    return () => clearInterval(intervalo);
  }, [pausado, anchoCarrusel]);

  function irADiapositiva(nuevoIndice) {
    setIndice(nuevoIndice);
    if (anchoCarrusel > 0) {
      scrollRef.current?.scrollTo({
        x: nuevoIndice * anchoCarrusel,
        animated: true,
      });
    }
  }

  function manejarScroll(evento) {
    if (anchoCarrusel <= 0) return;
    const x = evento.nativeEvent.contentOffset.x;
    const calculado = Math.round(x / anchoCarrusel);
    const acotado = Math.max(0, Math.min(DIAPOSITIVAS.length - 1, calculado));
    if (acotado !== indice) {
      setIndice(acotado);
    }
  }

  const alturaCarrusel = esAmplia ? 216 : 148;
  const anchoSlide = anchoCarrusel > 0 ? anchoCarrusel : 280;

  return (
    <View style={styles.envoltura}>
      <View
        style={styles.tarjeta}
        accessibilityLabel="Portada promocional de La Pastelería La T"
      >
        {/* ZONA IZQUIERDA · MARCA Y PROMOCIÓN */}
        <View style={styles.zonaIzquierda}>
          <View style={styles.decoracionSuperior} pointerEvents="none" />
          <View style={styles.decoracionInferior} pointerEvents="none" />

          <View style={styles.marcaFila}>
            <LogoMarca tamano={esAmplia ? 50 : 44} mostrarTexto={false} />
            <View style={styles.separadorVertical} />

            <View style={styles.textosColumna}>
              <Text style={styles.titulo} numberOfLines={3}>
                Endulza tu día con un toque de La T
              </Text>
              <Text style={styles.subtitulo} numberOfLines={3}>
                Tortas, cheesecakes y postres hechos en casa. Agita y gana hasta
                15% de descuento.
              </Text>
            </View>
          </View>

          <View style={styles.accionesFila}>
            <Pressable
              onPress={onAbrirAgita}
              accessibilityRole="button"
              accessibilityLabel="Agita y gana"
              accessibilityHint="Abre el juego con acelerómetro para ganar un cupón de descuento"
              style={({ pressed }) => [
                styles.pillPrimaria,
                pressed && styles.pillPrimariaPresionada,
              ]}
            >
              <Text style={styles.pillPrimariaTexto}>🎁 Agita y gana</Text>
            </Pressable>

            <Pressable
              onPress={onAbrirAgita}
              accessibilityRole="button"
              accessibilityLabel="Cupón de 5% a 15%"
              accessibilityHint="Conoce las promociones de Agita y gana"
              style={({ pressed }) => [
                styles.pillSecundaria,
                pressed && styles.pillSecundariaPresionada,
              ]}
            >
              <Text style={styles.pillSecundariaTexto}>
                🏷️ Cupón de 5% a 15%
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ZONA DERECHA · CARRUSEL INTERACTIVO DE POSTRES */}
        <View
          style={[styles.zonaDerecha, { height: alturaCarrusel }]}
          onLayout={(evento) => {
            const medido = Math.round(evento.nativeEvent.layout.width);
            if (medido > 0 && medido !== anchoCarrusel) {
              setAnchoCarrusel(medido);
            }
          }}
          onTouchStart={() => setPausado(true)}
          onTouchEnd={() => setPausado(false)}
          onTouchCancel={() => setPausado(false)}
        >
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={60}
            onScroll={manejarScroll}
            onScrollBeginDrag={() => setPausado(true)}
            onScrollEndDrag={() => setPausado(false)}
            onMomentumScrollEnd={manejarScroll}
            accessibilityLabel="Carrusel de postres destacados"
          >
            {DIAPOSITIVAS.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => onSeleccionarProducto && onSeleccionarProducto(item)}
                accessibilityRole="button"
                accessibilityLabel={`${item.nombre}, ${formatearCOP(item.precio)}`}
                accessibilityHint="Abre los detalles de este producto"
                style={[
                  styles.slide,
                  { width: anchoSlide, height: alturaCarrusel },
                ]}
              >
                <Image
                  source={item.imagen}
                  style={{ width: anchoSlide, height: alturaCarrusel }}
                  resizeMode="cover"
                  fadeDuration={0}
                  accessibilityLabel={`Fotografía de ${item.nombre}`}
                />

                <View style={styles.etiquetasFlotantes}>
                  <View style={styles.pillNombre}>
                    <Text style={styles.pillNombreTexto} numberOfLines={1}>
                      {item.nombre}
                    </Text>
                  </View>

                  <View style={styles.pillPrecio}>
                    <Text style={styles.pillPrecioTexto}>
                      {formatearCOP(item.precio)}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* INDICADORES DE PAGINACIÓN */}
      <View
        style={styles.indicadores}
        accessibilityLabel="Indicadores del carrusel de portada"
      >
        {DIAPOSITIVAS.map((item, idx) => {
          const activo = idx === indice;

          return (
            <Pressable
              key={`indicador-${item.id}`}
              onPress={() => irADiapositiva(idx)}
              accessibilityRole="button"
              accessibilityLabel={`Ver ${item.nombre}`}
              accessibilityHint={`Diapositiva ${idx + 1} de ${DIAPOSITIVAS.length}`}
              accessibilityState={{ selected: activo }}
              hitSlop={{ top: 14, bottom: 14, left: 6, right: 6 }}
              style={styles.puntoHit}
            >
              <View style={[styles.punto, activo && styles.puntoActivo]} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function crearEstilos(esClaro, esAmplia, colores, tokens) {
  const fondoIzquierda = esClaro ? '#FDF1D6' : '#251B14';
  const bordeSeparador = esClaro
    ? 'rgba(92, 51, 23, 0.22)'
    : 'rgba(255, 186, 0, 0.28)';
  const fondoDecoracion = esClaro
    ? 'rgba(149, 79, 40, 0.08)'
    : 'rgba(255, 186, 0, 0.08)';
  const tituloColor = esClaro ? '#3B2417' : '#F8F4F0';
  const subtituloColor = esClaro ? '#5C3D28' : '#C8BEB5';
  const btnPrimarioBg = esClaro ? '#5C3317' : colores.oro;
  const btnPrimarioPres = esClaro ? '#472610' : colores.oroSuave;
  const btnPrimarioTexto = esClaro ? '#FFFFFF' : colores.darkInk;
  const pillCremaBg = esClaro ? '#FFF8E8' : colores.grafito2;
  const pillCremaBorde = esClaro
    ? 'rgba(92, 51, 23, 0.25)'
    : colores.oroBorde;
  const pillCremaTexto = esClaro ? '#4A2914' : colores.oroSuave;
  const puntoActivoColor = esClaro ? '#5C3317' : colores.oro;
  const puntoInactivoColor = esClaro ? '#DFD0B8' : 'rgba(200, 190, 181, 0.35)';

  return StyleSheet.create({
    envoltura: {
      marginTop: 12,
    },
    tarjeta: {
      flexDirection: esAmplia ? 'row' : 'column',
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colores.hairline,
      backgroundColor: fondoIzquierda,
      ...tokens.sombras.suave,
    },
    zonaIzquierda: {
      flex: esAmplia ? 1.08 : undefined,
      backgroundColor: fondoIzquierda,
      paddingHorizontal: esAmplia ? 22 : 16,
      paddingVertical: esAmplia ? 20 : 14,
      justifyContent: 'space-between',
      overflow: 'hidden',
      position: 'relative',
    },
    decoracionSuperior: {
      position: 'absolute',
      width: 140,
      height: 140,
      borderRadius: 70,
      top: -54,
      right: -36,
      backgroundColor: fondoDecoracion,
    },
    decoracionInferior: {
      position: 'absolute',
      width: 96,
      height: 96,
      borderRadius: 48,
      bottom: -36,
      left: -24,
      backgroundColor: fondoDecoracion,
    },
    marcaFila: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    separadorVertical: {
      width: 1,
      alignSelf: 'stretch',
      minHeight: 42,
      backgroundColor: bordeSeparador,
    },
    textosColumna: {
      flex: 1,
      minWidth: 0,
    },
    titulo: {
      color: tituloColor,
      fontSize: esAmplia ? 21 : 18,
      lineHeight: esAmplia ? 26 : 23,
      fontWeight: '700',
      letterSpacing: -0.4,
    },
    subtitulo: {
      color: subtituloColor,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '400',
      marginTop: 4,
    },
    accionesFila: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 10,
      marginTop: esAmplia ? 16 : 12,
    },
    pillPrimaria: {
      backgroundColor: btnPrimarioBg,
      minHeight: tokens.areaTactilMin,
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: tokens.radios.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pillPrimariaPresionada: {
      backgroundColor: btnPrimarioPres,
    },
    pillPrimariaTexto: {
      color: btnPrimarioTexto,
      fontSize: 13,
      fontWeight: '700',
    },
    pillSecundaria: {
      backgroundColor: pillCremaBg,
      borderWidth: 1,
      borderColor: pillCremaBorde,
      minHeight: tokens.areaTactilMin,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: tokens.radios.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pillSecundariaPresionada: {
      opacity: 0.85,
    },
    pillSecundariaTexto: {
      color: pillCremaTexto,
      fontSize: 12,
      fontWeight: '700',
    },
    zonaDerecha: {
      flex: esAmplia ? 0.92 : undefined,
      width: esAmplia ? undefined : '100%',
      backgroundColor: colores.grafito,
      overflow: 'hidden',
    },
    slide: {
      position: 'relative',
      overflow: 'hidden',
    },
    etiquetasFlotantes: {
      position: 'absolute',
      left: 12,
      right: 12,
      bottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 8,
    },
    pillNombre: {
      flexShrink: 1,
      backgroundColor: 'rgba(59, 36, 23, 0.92)',
      borderRadius: tokens.radios.pill,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    pillNombreTexto: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '700',
    },
    pillPrecio: {
      backgroundColor: '#F8C967',
      borderRadius: tokens.radios.pill,
      paddingHorizontal: 12,
      paddingVertical: 6,
      flexShrink: 0,
    },
    pillPrecioTexto: {
      color: '#3B2417',
      fontSize: 12,
      fontWeight: '700',
    },
    indicadores: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 10,
    },
    puntoHit: {
      minWidth: 16,
      minHeight: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    punto: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: puntoInactivoColor,
    },
    puntoActivo: {
      width: 22,
      height: 8,
      borderRadius: 4,
      backgroundColor: puntoActivoColor,
    },
  });
}
