import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { useTema } from '../../theme/TemaContexto';

/* =========================================================
   LOGOTIPO DE MARCA · LA PASTELERÍA LA T
   Componente reutilizable que renderiza el emblema oficial
   dentro de un contenedor circular crema (#FDF4D8) con borde
   delgado (#8B4F24). Usa dimensiones en píxeles explícitas y
   `fadeDuration={0}` para garantizar visibilidad en Android,
   iOS, tablets y web.
========================================================= */

const LOGO_MARCA = require('../../../assets/logo-la-t.png');

export default function LogoMarca({
  tamano = 40,
  mostrarTexto = true,
  subtitulo = '',
  colorTexto,
  colorSubtitulo,
}) {
  const { colores, estilos } = useTema();

  const textoFinal = colorTexto || colores.champán;
  const subtituloFinal = colorSubtitulo || colores.textoSuave;
  return (
    <View style={styles.fila}>
      <Image
        source={LOGO_MARCA}
        style={[
          styles.circulo,
          {
            width: tamano,
            height: tamano,
            borderRadius: tamano / 2,
          },
        ]}
        resizeMode="cover"
        fadeDuration={0}
        accessibilityElementsHidden={mostrarTexto}
        importantForAccessibility={mostrarTexto ? 'no' : 'auto'}
        accessibilityLabel={
          mostrarTexto ? undefined : 'Logotipo de La Pastelería La T'
        }
      />

      {mostrarTexto && (
        <View style={styles.textos}>
          <Text
            style={[estilos.marcaNombre, { color: textoFinal }]}
            numberOfLines={1}
          >
            Pastelería La T
          </Text>

          {Boolean(subtitulo) && (
            <Text
              style={[estilos.marcaSubtitulo, { color: subtituloFinal }]}
              numberOfLines={1}
            >
              {subtitulo}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
    minWidth: 0,
  },
  circulo: {
    backgroundColor: '#FDF4D8',
    borderWidth: 1,
    borderColor: '#8B4F24',
    flexShrink: 0,
  },
  textos: {
    flexShrink: 1,
    minWidth: 0,
  },
});
