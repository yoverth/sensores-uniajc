import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text } from 'react-native';

import estilos from '../../estilosTienda';

/* =========================================================
   AVISO FLOTANTE (no bloqueante)
   Informa del resultado de una acción sin abrir diálogos.
   Entra con una curva exponencial de salida y se asienta
   sin rebote: feedback, no espectáculo.
========================================================= */

export default function AvisoFlotante({ aviso }) {
  const opacidad = useRef(new Animated.Value(0)).current;
  const desplazamiento = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacidad, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(desplazamiento, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacidad, desplazamiento]);

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      style={[
        estilos.avisoFlotante,
        aviso.tipo === 'error' && estilos.avisoFlotanteError,
        { opacity: opacidad, transform: [{ translateY: desplazamiento }] },
      ]}
    >
      <Text style={estilos.avisoFlotanteTexto}>{aviso.texto}</Text>
    </Animated.View>
  );
}
