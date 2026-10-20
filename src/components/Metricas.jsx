import React from 'react';
import { View } from 'react-native';

import MetricCard from './MetricCard';
import styles from '../styles';

/* =========================================================
   MÉTRICAS (fila de dos tarjetas)
========================================================= */

export default function Metricas({ montados, porcentaje, movil }) {
  return (
    <View style={[styles.metricas, movil && styles.metricasMovil]}>
      <MetricCard
        icono="🧠"
        titulo="Elementos montados"
        numero={montados}
        descripcion="Elementos virtualizados"
      />
      <MetricCard
        icono="💾"
        titulo="Carga estimada"
        numero={porcentaje}
        descripcion="Menor trabajo simultáneo"
      />
    </View>
  );
}
