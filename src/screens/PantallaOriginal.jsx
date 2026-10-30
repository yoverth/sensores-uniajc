import React from 'react';
import { View, ScrollView } from 'react-native';

import EncabezadoAdaptativo from '../components/EncabezadoAdaptativo';
import Navegacion from '../components/Navegacion';
import TituloSeccion from '../components/TituloSeccion';
import Alerta from '../components/Alerta';
import ProductoCard from '../components/ProductoCard';
import { TOTAL_PRODUCTOS, productos } from '../data/productos';
import styles from '../styles';

/* =========================================================
   PANTALLA ORIGINAL
========================================================= */

export default function PantallaOriginal({ pestana, setPestana, onSalir }) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contenido}>
        <EncabezadoAdaptativo onSalir={onSalir} />
        <Navegacion pestana={pestana} setPestana={setPestana} />

        <TituloSeccion
          titulo="Lista original"
          descripcion="ScrollView renderiza todos los elementos."
        />

        <Alerta
          icono="⚠️"
          titulo="Sin virtualización"
          descripcion={`Los ${TOTAL_PRODUCTOS} productos se cargan al mismo tiempo.`}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {productos.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}
