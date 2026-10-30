import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
// API legacy: la única incluida en Expo Go (la nueva necesita el módulo
// nativo 'ExpoMediaLibraryNext', ausente en Expo Go)
import * as MediaLibrary from 'expo-media-library/legacy';

import EncabezadoAdaptativo from '../components/EncabezadoAdaptativo';
import Navegacion from '../components/Navegacion';
import TituloSeccion from '../components/TituloSeccion';
import Alerta from '../components/Alerta';
import MetricCard from '../components/MetricCard';
import useAcelerometro from '../hooks/useAcelerometro';
import useDispositivo from '../hooks/useDispositivo';
import styles from '../styles';

/* =========================================================
   PANTALLA SENSORES (CÁMARA CON HORIZONTE VIRTUAL)
   Mejora 1: feedback de captura (spinner, toast y miniatura).
   Mejora 2: retícula centrada, hitSlop y accesibilidad.
========================================================= */

export default function PantallaSensores({ pestana, setPestana, onSalir }) {
  const [permission, requestPermission] = useCameraPermissions();
  // Permisos de la galería (writeOnly: solo guardamos, no leemos)
  const [permisoGaleria, solicitarPermisoGaleria] = MediaLibrary.usePermissions({
    writeOnly: true,
  });
  const { datosSensor, sensorDisponible } = useAcelerometro();
  const { esHorizontal } = useDispositivo();

  // Estados de la Mejora 1
  const [tomandoFoto, setTomandoFoto] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);
  const [ultimaCaptura, setUltimaCaptura] = useState(null);

  const camaraRef = useRef(null);
  const temporizadores = useRef([]);

  // Limpia los temporizadores al desmontar para no hacer setState huérfano
  useEffect(() => {
    const lista = temporizadores.current;
    return () => lista.forEach((id) => clearTimeout(id));
  }, []);

  const anguloRotacion = Math.round(datosSensor.x * -90);
  const estaNivelado = Math.abs(datosSensor.x) < 0.06;

  const desprogramar = (fn, ms) => {
    temporizadores.current.push(setTimeout(fn, ms));
  };

  /* Captura real + guardado en la galería del sistema */
  const dispararCamara = async () => {
    if (tomandoFoto || !camaraRef.current) return;

    try {
      setTomandoFoto(true);

      // 1) Permiso de galería (si no está concedido, se solicita)
      if (!permisoGaleria?.granted) {
        const respuesta = await solicitarPermisoGaleria();
        if (!respuesta?.granted) {
          Alert.alert(
            'Permiso denegado',
            'Se requiere acceso a la galería para guardar tus fotos.'
          );
          return;
        }
      }

      // 2) Foto real desde el visor
      const foto = await camaraRef.current.takePictureAsync({
        quality: 0.85,
        skipProcessing: false,
      });
      if (!foto?.uri) return;

      // 3) Guardar en la galería/álbum del sistema (API legacy de Expo Go)
      const asset = await MediaLibrary.createAssetAsync(foto.uri);

      // 4) Miniatura + confirmación
      setUltimaCaptura(asset?.uri ?? foto.uri);
      setMensajeExito(true);
      desprogramar(() => setMensajeExito(false), 2500);
    } catch (error) {
      console.warn('Error al capturar/guardar la imagen:', error);
      Alert.alert('Error', 'No se pudo guardar la fotografía.');
    } finally {
      setTomandoFoto(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contenido}>
        <EncabezadoAdaptativo onSalir={onSalir} />
        <Navegacion pestana={pestana} setPestana={setPestana} />

        <TituloSeccion
          titulo="Cámara Asistida por Sensor"
          descripcion="Gira el teléfono hasta alinear el horizonte en verde antes del disparo."
        />

        {!permission?.granted ? (
          <Alerta
            icono="🔒"
            titulo="Permiso Requerido"
            descripcion="Se requiere acceso a la cámara para utilizar el asistente de nivelación."
            accion={{
              etiqueta: 'Habilitar Cámara',
              onPress: requestPermission,
            }}
          />
        ) : (
          <View
            style={[
              styles.camaraContenedor,
              esHorizontal && styles.camaraContenedorHorizontal,
            ]}
          >
            <CameraView
              ref={camaraRef}
              style={styles.camaraVisor}
              facing="back"
            />

            {/* El overlay va FUERA de CameraView (no acepta hijos) */}
            <View style={styles.overlayCamara}>
              {/* Banner superior de estado en vivo */}
              <View
                style={[
                  styles.badgeEstado,
                  estaNivelado ? styles.badgeNivelado : styles.badgeInclinado,
                ]}
                accessibilityLiveRegion="polite"
              >
                <Text style={styles.badgeEstadoTexto}>
                  {estaNivelado
                    ? '✓ HORIZONTE NIVELADO (TOMA ESTABLE)'
                    : `INCLINACIÓN: ${anguloRotacion}°`}
                </Text>
              </View>

              {/* MEJORA 2: retícula centrada geométricamente */}
              <View style={styles.centroGuia}>
                <View
                  style={[
                    styles.lineaHorizonte,
                    { transform: [{ rotate: `${anguloRotacion}deg` }] },
                    estaNivelado && styles.lineaHorizonteNivelada,
                  ]}
                >
                  <View style={styles.punteroCentro} />
                </View>
              </View>

              {/* MEJORA 1: toast de confirmación */}
              {mensajeExito && (
                <View style={styles.toastExito} accessibilityLiveRegion="polite">
                  <Text style={styles.toastTexto}>
                    ✓ Foto guardada en la galería
                  </Text>
                </View>
              )}

              {/* Controles inferiores: miniatura + disparador accesible */}
              <View style={styles.botoneraInferior}>
                <View style={styles.contenedorMiniatura}>
                  {ultimaCaptura ? (
                    <Image
                      source={{ uri: ultimaCaptura }}
                      style={styles.miniatura}
                      accessibilityLabel="Miniatura de la última fotografía capturada"
                    />
                  ) : (
                    <View style={styles.miniaturaVacia} />
                  )}
                </View>

                {/* MEJORA 2: disparador con hitSlop y accesibilidad */}
                <Pressable
                  onPress={dispararCamara}
                  disabled={tomandoFoto}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  accessibilityRole="button"
                  accessibilityLabel="Tomar fotografía con asistente de nivel"
                  accessibilityHint="Captura la imagen y la guarda en la galería del dispositivo"
                  accessibilityState={{ disabled: tomandoFoto }}
                  style={[
                    styles.botonCaptura,
                    estaNivelado && styles.botonCapturaNivelado,
                    tomandoFoto && styles.botonDeshabilitado,
                  ]}
                >
                  {tomandoFoto ? (
                    <ActivityIndicator size="small" color="#00E5FF" />
                  ) : (
                    <View style={styles.botonCapturaInterno} />
                  )}
                </Pressable>

                <View style={styles.espaciadorDerecho} />
              </View>
            </View>
          </View>
        )}

        {/* Métricas del sensor */}
        <View style={styles.metricas}>
          <MetricCard
            icono="📐"
            titulo="Eje X (Inclinación)"
            numero={datosSensor.x.toFixed(2)}
            descripcion={estaNivelado ? 'Nivelado' : 'Desviado'}
          />
          <MetricCard
            icono="📱"
            titulo="Eje Y (Elevación)"
            numero={datosSensor.y.toFixed(2)}
            descripcion={sensorDisponible ? 'Sensor activo' : 'No disponible'}
          />
        </View>
      </ScrollView>
    </View>
  );
}
