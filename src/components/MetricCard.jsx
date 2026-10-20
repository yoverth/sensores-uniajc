import React from 'react';
import { View, Text } from 'react-native';

import styles from '../styles';

/* =========================================================
   TARJETA DE MÉTRICA
========================================================= */

export default function MetricCard({ icono, titulo, numero, descripcion }) {
  return (
    <View style={styles.metrica}>
      <Text style={styles.metricaIcono}>{icono}</Text>
      <Text style={styles.metricaTitulo}>{titulo}</Text>
      <Text style={styles.metricaNumero}>{numero}</Text>
      <Text style={styles.metricaDescripcion}>{descripcion}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeTexto}>ACTIVO</Text>
      </View>
    </View>
  );
}
