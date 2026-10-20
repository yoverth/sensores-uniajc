import React from 'react';
import { View, Text, Image } from 'react-native';

import styles from '../styles';

/* =========================================================
   TARJETA ADAPTATIVA (según cantidad de columnas)
========================================================= */

export default function TarjetaAdaptativa({ producto, columnas }) {
  return (
    <View
      style={[
        styles.tarjetaAdaptativa,
        columnas === 1 && styles.tarjetaUnaColumna,
        columnas === 2 && styles.tarjetaDosColumnas,
        columnas === 3 && styles.tarjetaTresColumnas,
      ]}
    >
      <Image
        source={{ uri: producto.imagen }}
        style={[
          styles.imagenAdaptativa,
          columnas === 1 && styles.imagenUnaColumna,
        ]}
      />
      <View style={styles.adaptativaInfo}>
        <Text style={styles.adaptativaNombre} numberOfLines={1}>
          {producto.nombre}
        </Text>
        <Text style={styles.adaptativaCategoria}>{producto.categoria}</Text>
        <Text style={styles.adaptativaPrecio}>
          ${producto.precio.toLocaleString('es-CO')}
        </Text>
      </View>
    </View>
  );
}
