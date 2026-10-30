import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { TOTAL_PRODUCTOS } from '../data/productos';
import useDispositivo from '../hooks/useDispositivo';
import styles from '../styles';

/* =========================================================
   ENCABEZADO DEL LABORATORIO (sección interna)

   `onSalir` muestra el botón para volver a la tienda.
========================================================= */

export default function EncabezadoAdaptativo({ onSalir }) {
  const { apilado } = useDispositivo();

  return (
    <View>
      {onSalir && (
        <Pressable
          onPress={onSalir}
          accessibilityRole="button"
          accessibilityLabel="Volver a la tienda"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.botonVolverTienda}
        >
          <Text style={styles.botonVolverTiendaTexto}>← Volver a la tienda</Text>
        </Pressable>
      )}

      <View style={[styles.header, apilado && styles.headerMovil]}>
        <View style={styles.headerTexto}>
          <Text style={styles.etiqueta}>
            HERRAMIENTAS INTERNAS · LABORATORIO
          </Text>
          <Text style={[styles.titulo, apilado && styles.tituloMovil]}>
            Móviles & Hardware
          </Text>
          <Text style={styles.subtitulo}>
            Sesión 4 · Optimización y captura con acelerómetro
          </Text>
        </View>

        <View style={[styles.contador, apilado && styles.contadorMovil]}>
          <Text style={styles.contadorNumero}>{TOTAL_PRODUCTOS}</Text>
          <Text style={styles.contadorTexto}>ITEMS</Text>
        </View>
      </View>
    </View>
  );
}
