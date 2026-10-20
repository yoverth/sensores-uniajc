import React from 'react';
import { View, Text, Pressable } from 'react-native';

import styles from '../styles';

/* =========================================================
   ALERTA (banner informativo, opcionalmente con acción)
========================================================= */

export default function Alerta({ icono, titulo, descripcion, accion }) {
  return (
    <View style={styles.alertaOriginal}>
      <Text style={styles.alertaIcono}>{icono}</Text>
      <View style={styles.alertaTexto}>
        <Text style={styles.alertaTitulo}>{titulo}</Text>
        <Text style={styles.alertaDescripcion}>{descripcion}</Text>
        {accion && (
          <Pressable style={styles.botonPermiso} onPress={accion.onPress}>
            <Text style={styles.botonPermisoTexto}>{accion.etiqueta}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
