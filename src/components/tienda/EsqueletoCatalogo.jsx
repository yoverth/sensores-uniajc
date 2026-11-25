import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';

import { useTema } from '../../theme/TemaContexto';

/* =========================================================
   ESQUELETO DE CARGA DEL CATÁLOGO
   Simula la cuadrícula de tarjetas mientras se inicializa o
   filtra el catálogo, adaptado al modo claro y oscuro.
========================================================= */

const USAR_DRIVER_NATIVO = Platform.OS !== 'web';

export default function EsqueletoCatalogo({ columnas = 1, cantidad }) {
  const { colores, tokens } = useTema();
  const pulso = useRef(new Animated.Value(0.48)).current;

  const totalTarjetas = cantidad ?? (columnas === 1 ? 3 : columnas * 2);

  useEffect(() => {
    const animacion = Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, {
          toValue: 0.94,
          duration: 620,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: USAR_DRIVER_NATIVO,
        }),
        Animated.timing(pulso, {
          toValue: 0.48,
          duration: 620,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: USAR_DRIVER_NATIVO,
        }),
      ])
    );

    animacion.start();
    return () => animacion.stop();
  }, [pulso]);

  const bloques = Array.from({ length: totalTarjetas }, (_, i) => i);
  const filas = [];
  for (let i = 0; i < bloques.length; i += columnas) {
    filas.push(bloques.slice(i, i + columnas));
  }

  const colorBloque = colores.esqueletoBase;
  const colorSuave = colores.esqueletoBrillo;
  const radioTarjeta = tokens.radios.md;
  const alturaImagen = columnas === 1 ? 200 : 150;

  return (
    <View
      accessibilityLabel="Cargando productos de la pastelería"
      accessibilityLiveRegion="polite"
      style={styles.contenedor}
    >
      {filas.map((fila, indiceFila) => (
        <View
          key={`fila-esqueleto-${indiceFila}`}
          style={[styles.fila, columnas > 1 && styles.filaGrid]}
        >
          {fila.map((id) => (
            <View
              key={`tarjeta-esqueleto-${id}`}
              style={[
                styles.tarjeta,
                {
                  backgroundColor: colores.panel,
                  borderColor: colores.hairline,
                  borderRadius: radioTarjeta,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.imagen,
                  {
                    height: alturaImagen,
                    backgroundColor: colorBloque,
                    opacity: pulso,
                  },
                ]}
              />

              <View style={styles.cuerpo}>
                <Animated.View
                  style={[
                    styles.lineaMicro,
                    { backgroundColor: colorSuave, opacity: pulso },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.lineaTitulo,
                    { backgroundColor: colorBloque, opacity: pulso },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.lineaTexto,
                    { backgroundColor: colorSuave, opacity: pulso },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.lineaTextoCorta,
                    { backgroundColor: colorSuave, opacity: pulso },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.lineaPrecio,
                    { backgroundColor: colorBloque, opacity: pulso },
                  ]}
                />

                <View style={styles.botones}>
                  <Animated.View
                    style={[
                      styles.boton,
                      { backgroundColor: colorSuave, opacity: pulso },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.boton,
                      { backgroundColor: colorBloque, opacity: pulso },
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}

          {columnas > 1 &&
            fila.length < columnas &&
            Array.from({ length: columnas - fila.length }).map((_, idx) => (
              <View
                key={`espacio-esqueleto-${indiceFila}-${idx}`}
                style={styles.espaciador}
              />
            ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
  },
  fila: {
    width: '100%',
  },
  filaGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  tarjeta: {
    flex: 1,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  espaciador: {
    flex: 1,
  },
  imagen: {
    width: '100%',
  },
  cuerpo: {
    padding: 16,
  },
  lineaMicro: {
    width: '34%',
    height: 11,
    borderRadius: 4,
  },
  lineaTitulo: {
    width: '78%',
    height: 16,
    borderRadius: 4,
    marginTop: 10,
  },
  lineaTexto: {
    width: '94%',
    height: 12,
    borderRadius: 4,
    marginTop: 10,
  },
  lineaTextoCorta: {
    width: '62%',
    height: 12,
    borderRadius: 4,
    marginTop: 6,
  },
  lineaPrecio: {
    width: '42%',
    height: 18,
    borderRadius: 4,
    marginTop: 14,
  },
  botones: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  boton: {
    flex: 1,
    height: 44,
    borderRadius: 4,
  },
});
