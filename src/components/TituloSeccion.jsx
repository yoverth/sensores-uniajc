import React from 'react';
import { View, Text } from 'react-native';

import styles from '../styles';

/* =========================================================
   TÍTULO DE SECCIÓN
========================================================= */

export default function TituloSeccion({ titulo, descripcion }) {
  return (
    <View style={styles.tituloSeccion}>
      <Text style={styles.tituloSeccionTexto}>{titulo}</Text>
      <Text style={styles.descripcionSeccion}>{descripcion}</Text>
    </View>
  );
}
