import React from 'react';
import { View, Text } from 'react-native';

import styles from '../styles';

/* =========================================================
   PANEL DE USO DE RECURSOS (barra de progreso)
========================================================= */

export default function UsoRecursos({ porcentaje, descripcion }) {
  return (
    <View style={styles.recursos}>
      <View style={styles.recursosHeader}>
        <Text style={styles.recursosTitulo}>Uso de recursos</Text>
        <Text style={styles.recursosPorcentaje}>{porcentaje}</Text>
      </View>

      <View style={styles.barra}>
        <View
          style={[
            styles.barraProgreso,
            { width: porcentaje },
          ]}
        />
      </View>

      <Text style={styles.recursosDescripcion}>{descripcion}</Text>
    </View>
  );
}
