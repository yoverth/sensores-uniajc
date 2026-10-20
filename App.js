import React, { useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import PantallaOriginal from './src/screens/PantallaOriginal';
import PantallaOptimizada from './src/screens/PantallaOptimizada';
import PantallaAdaptativa from './src/screens/PantallaAdaptativa';
import PantallaSensores from './src/screens/PantallaSensores';
import styles from './src/styles';

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

export default function App() {
  const [pestana, setPestana] = useState('sensores');

  return (
    <View style={styles.app}>
      <StatusBar style="light" />

      {pestana === 'original' && (
        <PantallaOriginal pestana={pestana} setPestana={setPestana} />
      )}

      {pestana === 'optimizada' && (
        <PantallaOptimizada pestana={pestana} setPestana={setPestana} />
      )}

      {pestana === 'adaptativa' && (
        <PantallaAdaptativa pestana={pestana} setPestana={setPestana} />
      )}

      {pestana === 'sensores' && (
        <PantallaSensores pestana={pestana} setPestana={setPestana} />
      )}
    </View>
  );
}
