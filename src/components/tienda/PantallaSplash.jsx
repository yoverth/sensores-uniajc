import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

/* =========================================================
   PANTALLA SPLASH ANIMADA · LA PASTELERÍA LA T
   Presenta el logotipo oficial (#FDF4D8 / #6B3A1E) en
   primer plano al iniciar la app, esperando su decodificación
   antes de dar paso al catálogo sin recuadros ni elevaciones
   que oculten la imagen en Android Fabric / Expo Go.
   Usa exclusivamente `Animated` nativo de React Native.
   ========================================================= */

const LOGO_MARCA = require('../../../assets/logo-la-t.png');
const USAR_DRIVER_NATIVO = Platform.OS !== 'web';

export default function PantallaSplash({ alTerminar }) {
  const { width, height } = useWindowDimensions();
  const tamanoLogo = Math.max(
    160,
    Math.min(236, Math.round(Math.min(width, height) * 0.56))
  );

  const [imagenLista, setImagenLista] = useState(false);
  const opacidadOverlay = useRef(new Animated.Value(1)).current;
  const escalaLogo = useRef(new Animated.Value(0.95)).current;
  const alTerminarRef = useRef(alTerminar);
  const finalizadoRef = useRef(false);

  useEffect(() => {
    alTerminarRef.current = alTerminar;
  }, [alTerminar]);

  const finalizar = () => {
    if (finalizadoRef.current) return;
    finalizadoRef.current = true;
    if (typeof alTerminarRef.current === 'function') {
      alTerminarRef.current();
    }
  };

  /* Entrada sutil de escala sin ocultar el logotipo (opacidad inicial 1)
     y respaldo por si `onLoadEnd` demora demasiado. */
  useEffect(() => {
    const entrada = Animated.spring(escalaLogo, {
      toValue: 1,
      friction: 7,
      tension: 64,
      useNativeDriver: USAR_DRIVER_NATIVO,
    });
    entrada.start();

    const respaldo = setTimeout(finalizar, 2600);

    return () => {
      clearTimeout(respaldo);
      entrada.stop();
    };
  }, [escalaLogo]);

  /* Una vez decodificado el logo, se muestra visiblemente y se desvanece. */
  useEffect(() => {
    if (!imagenLista) return undefined;

    let cancelado = false;
    const salida = Animated.sequence([
      Animated.delay(950),
      Animated.timing(opacidadOverlay, {
        toValue: 0,
        duration: 280,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: USAR_DRIVER_NATIVO,
      }),
    ]);

    salida.start(() => {
      if (!cancelado) finalizar();
    });

    return () => {
      cancelado = true;
      salida.stop();
    };
  }, [imagenLista, opacidadOverlay]);

  return (
    <Animated.View
      accessibilityLabel="Cargando La Pastelería La T"
      style={[styles.overlay, { opacity: opacidadOverlay }]}
    >
      <Animated.View
        collapsable={false}
        style={[
          styles.centro,
          { transform: [{ scale: escalaLogo }] },
        ]}
      >
        <View collapsable={false}>
          <Image
            source={LOGO_MARCA}
            onLoadEnd={() => setImagenLista(true)}
            onError={() => setImagenLista(true)}
            style={{
              width: tamanoLogo,
              height: tamanoLogo,
              borderRadius: tamanoLogo / 2,
              borderWidth: 2,
              borderColor: '#8B4F24',
              backgroundColor: '#FDF4D8',
            }}
            resizeMode="cover"
            fadeDuration={0}
            accessibilityLabel="Logotipo oficial de La Pastelería La T"
          />
        </View>

        <Text style={styles.tituloMarca}>La Pastelería La T</Text>
        <Text style={styles.subtitulo}>Repostería artesanal &amp; café</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#FDF4D8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  centro: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloMarca: {
    marginTop: 20,
    color: '#6B3A1E',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  subtitulo: {
    marginTop: 6,
    color: '#5C3317',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
});
