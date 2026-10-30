import React, { useState } from 'react';
import { View, FlatList, Platform } from 'react-native';

import EncabezadoAdaptativo from '../components/EncabezadoAdaptativo';
import Navegacion from '../components/Navegacion';
import TituloSeccion from '../components/TituloSeccion';
import Metricas from '../components/Metricas';
import ProductoCard from '../components/ProductoCard';
import { productos } from '../data/productos';
import styles from '../styles';

/* =========================================================
   PANTALLA OPTIMIZADA
========================================================= */

export default function PantallaOptimizada({ pestana, setPestana, onSalir }) {
  const [montados, setMontados] = useState(0);

  const registrarMontaje = () => {
    setMontados((actual) => {
      if (actual >= 36) return actual;
      return actual + 1;
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductoCard producto={item} onMount={registrarMontaje} />
        )}
        ListHeaderComponent={
          <View>
            <EncabezadoAdaptativo onSalir={onSalir} />
            <Navegacion pestana={pestana} setPestana={setPestana} />

            <TituloSeccion
              titulo="Lista optimizada"
              descripcion="FlatList utiliza virtualización."
            />

            <Metricas montados={montados} porcentaje="30%" />
          </View>
        }
        contentContainerStyle={styles.contenido}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
