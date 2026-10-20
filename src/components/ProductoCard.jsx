import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';

import styles from '../styles';

/* =========================================================
   TARJETA DE PRODUCTO (lista original / optimizada)
========================================================= */

export default function ProductoCard({ producto, onMount }) {
  useEffect(() => {
    if (onMount) onMount();
  }, []);

  return (
    <View style={styles.producto}>
      <Image source={{ uri: producto.imagen }} style={styles.productoImagen} />
      <View style={styles.productoInfo}>
        <Text style={styles.productoNombre}>{producto.nombre}</Text>
        <Text style={styles.productoDescripcion}>{producto.descripcion}</Text>
        <Text style={styles.productoCategoria}>{producto.categoria}</Text>
        <Text style={styles.productoPrecio}>
          ${producto.precio.toLocaleString('es-CO')}
        </Text>
      </View>
    </View>
  );
}
