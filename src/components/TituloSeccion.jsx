import React from 'react';
import { View, Text } from 'react-native';

import styles from '../styles';

/* =========================================================
   TÍTULO DE SECCIÓN
========================================================= */

export default function TituloSeccion({
  titulo,
  descripcion,
  estiloTitulo,
  estiloDescripcion,
}) {
  return (
    <View style={styles.tituloSeccion}>
      <Text style={[styles.tituloSeccionTexto, estiloTitulo]}>{titulo}</Text>
      <Text style={[styles.descripcionSeccion, estiloDescripcion]}>
        {descripcion}
      </Text>
    </View>
  );
}
