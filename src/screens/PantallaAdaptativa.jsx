import React from 'react';
import { View, FlatList, Platform } from 'react-native';

import EncabezadoAdaptativo from '../components/EncabezadoAdaptativo';
import Navegacion from '../components/Navegacion';
import Metricas from '../components/Metricas';
import UsoRecursos from '../components/UsoRecursos';
import TarjetaAdaptativa from '../components/TarjetaAdaptativa';
import useDispositivo from '../hooks/useDispositivo';
import { productos } from '../data/productos';
import styles from '../styles';

/* =========================================================
   PANTALLA ADAPTATIVA
========================================================= */

export default function PantallaAdaptativa({ pestana, setPestana }) {
  const { apilado, columnas } = useDispositivo();

  const porcentaje = columnas === 3 ? '30%' : columnas === 2 ? '45%' : '60%';

  return (
    <View style={styles.container}>
      <FlatList
        data={productos}
        key={`lista-${columnas}`}
        numColumns={columnas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TarjetaAdaptativa producto={item} columnas={columnas} />
        )}
        ListHeaderComponent={
          <View>
            <EncabezadoAdaptativo />
            <Navegacion pestana={pestana} setPestana={setPestana} />

            <Metricas
              movil={apilado}
              montados="36"
              porcentaje="30%"
            />

            <UsoRecursos
              porcentaje={porcentaje}
              descripcion="FlatList adapta la cantidad de columnas al tamaño de pantalla."
            />
          </View>
        }
        contentContainerStyle={styles.contenido}
        initialNumToRender={columnas === 1 ? 6 : 12}
        maxToRenderPerBatch={columnas === 1 ? 6 : 12}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        columnWrapperStyle={columnas > 1 ? styles.fila : undefined}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
