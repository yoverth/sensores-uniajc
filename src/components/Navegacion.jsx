import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';

import styles from '../styles';

/* =========================================================
   MEJORA 3: NAVEGACIÓN COMPACTA Y HORIZONTAL

   Sustituye el listado vertical (que en móvil superaba los
   200 px de alto y empujaba la cámara fuera de la vista) por
   una barra desplazable de ~48 px.
========================================================= */

const PESTANAS = [
  { id: 'original', icono: '🐌', titulo: 'Original', subtitulo: 'ScrollView' },
  { id: 'optimizada', icono: '⚡', titulo: 'Optimizada', subtitulo: 'FlatList' },
  { id: 'adaptativa', icono: '🧮', titulo: 'Adaptativa', subtitulo: 'Responsive' },
  { id: 'sensores', icono: '📷', titulo: 'Sensores', subtitulo: 'Cámara + Mov' },
  { id: 'tareas', icono: '📝', titulo: 'Tareas', subtitulo: 'Sesión 9' },
  { id: 'asistente', icono: '🤖', titulo: 'Asistente IA', subtitulo: '1-NN local' },
];

export default function Navegacion({ pestana, setPestana }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsHorizontalContainer}
      style={styles.tabsScroll}
    >
      {PESTANAS.map((item) => (
        <BotonTab
          key={item.id}
          activo={pestana === item.id}
          icono={item.icono}
          titulo={item.titulo}
          subtitulo={item.subtitulo}
          onPress={() => setPestana(item.id)}
        />
      ))}
    </ScrollView>
  );
}

/* =========================================================
   BOTÓN DE TAB
========================================================= */

function BotonTab({ activo, icono, titulo, subtitulo, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityLabel={`${titulo}. ${subtitulo}`}
      accessibilityState={{ selected: activo }}
      style={[styles.tab, activo && styles.tabActivo]}
    >
      <Text style={styles.tabIcono}>{icono}</Text>
      <View>
        <Text style={styles.tabTitulo}>{titulo}</Text>
        <Text style={styles.tabSubtitulo}>{subtitulo}</Text>
      </View>
    </Pressable>
  );
}
