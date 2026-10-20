import React from 'react';
import { View, Text } from 'react-native';

import { TOTAL_PRODUCTOS } from '../data/productos';
import useDispositivo from '../hooks/useDispositivo';
import styles from '../styles';

/* =========================================================
   ENCABEZADO ADAPTATIVO
========================================================= */

export default function EncabezadoAdaptativo() {
  const { apilado } = useDispositivo();

  return (
    <View style={[styles.header, apilado && styles.headerMovil]}>
      <View style={styles.headerTexto}>
        <Text style={styles.etiqueta}>LABORATORIO DE RENDIMIENTO & SENSORES</Text>
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
  );
}
