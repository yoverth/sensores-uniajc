import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';

import { estadoInicialDetector, evaluarLectura } from '../logic/sacudida';

/* =========================================================
   HOOK: ACELERÓMETRO REAL PARA «AGITA Y GANA»

   - Android/iOS: `expo-sensors` (Accelerometer).
   - Web: evento `devicemotion`. El Accelerometer de expo-sensors
     en web entrega ángulos de orientación, no aceleración.
   - El permiso se pide dentro del toque (`iniciar`) porque iOS
     Safari y Chrome exigen un gesto del usuario.
   - La detección (umbral + muestras + enfriamiento) es la misma
     para las dos fuentes.
========================================================= */

const ES_WEB = Platform.OS === 'web';

export default function useAgitar({
  umbral,
  enfriamientoMs = 2500,
  onSacudida,
}) {
  const [activo, setActivo] = useState(false);
  const [magnitud, setMagnitud] = useState(1);
  const [disponible, setDisponible] = useState(null); // null = comprobando
  const [error, setError] = useState('');
  const [escuchando, setEscuchando] = useState(false);

  const estadoRef = useRef(estadoInicialDetector());
  const callbackRef = useRef(onSacudida);
  const umbralRef = useRef(umbral);

  callbackRef.current = onSacudida;
  umbralRef.current = umbral;

  useEffect(() => {
    if (ES_WEB) {
      setDisponible(
        typeof window !== 'undefined' &&
          typeof window.DeviceMotionEvent !== 'undefined'
      );
      return undefined;
    }

    let vigente = true;

    Accelerometer.isAvailableAsync()
      .then((ok) => {
        if (vigente) setDisponible(ok);
      })
      .catch(() => {
        if (vigente) setDisponible(false);
      });

    return () => {
      vigente = false;
    };
  }, []);

  const iniciar = useCallback(async () => {
    setError('');

    try {
      if (ES_WEB) {
        const Sensor =
          typeof window !== 'undefined' ? window.DeviceMotionEvent : undefined;

        if (!Sensor) {
          setDisponible(false);
          setError('Este navegador no expone el acelerómetro.');
          return false;
        }

        /* iOS Safari y Chrome piden permiso dentro del gesto. */
        if (typeof Sensor.requestPermission === 'function') {
          const respuesta = await Sensor.requestPermission();

          if (respuesta !== 'granted') {
            setError(
              'Permiso de movimiento denegado. Actívalo en los ajustes del navegador.'
            );
            return false;
          }
        }

        setDisponible(true);
        setActivo(true);
        return true;
      }

      const permiso = await Accelerometer.getPermissionsAsync();
      let concedido = Boolean(permiso?.granted);

      if (!concedido && permiso?.canAskAgain !== false) {
        const respuesta = await Accelerometer.requestPermissionsAsync();
        concedido = Boolean(respuesta?.granted);
      }

      if (!concedido) {
        setError(
          'Permiso de movimiento denegado. Actívalo en los ajustes del sistema para poder agitar.'
        );
        return false;
      }

      const haySensor = await Accelerometer.isAvailableAsync();

      if (!haySensor) {
        setDisponible(false);
        setError('Este dispositivo no tiene acelerómetro disponible.');
        return false;
      }

      setDisponible(true);
      setActivo(true);
      return true;
    } catch (fallo) {
      setError('No se pudo iniciar el acelerómetro en este dispositivo.');
      return false;
    }
  }, []);

  const detener = useCallback(() => {
    setActivo(false);
  }, []);

  useEffect(() => {
    if (!activo) {
      setEscuchando(false);
      return undefined;
    }

    let suscripcion = null;
    let dejarDeEscuchar = null;

    const procesar = (lectura) => {
      const resultado = evaluarLectura(
        estadoRef.current,
        lectura,
        Date.now(),
        { umbral: umbralRef.current, enfriamientoMs }
      );

      estadoRef.current = resultado.estado;
      setMagnitud(resultado.magnitud);

      if (resultado.disparo && callbackRef.current) {
        callbackRef.current(resultado);
      }
    };

    estadoRef.current = estadoInicialDetector();

    if (ES_WEB) {
      const manejar = (evento) => {
        const datos = evento.accelerationIncludingGravity || evento.acceleration;
        if (!datos) return;

        procesar({
          x: datos.x || 0,
          y: datos.y || 0,
          z: datos.z || 0,
        });
      };

      window.addEventListener('devicemotion', manejar);
      dejarDeEscuchar = () => window.removeEventListener('devicemotion', manejar);
    } else {
      Accelerometer.setUpdateInterval(70);
      suscripcion = Accelerometer.addListener(procesar);
    }

    setEscuchando(true);

    return () => {
      if (suscripcion) suscripcion.remove();
      if (dejarDeEscuchar) dejarDeEscuchar();
    };
  }, [activo, enfriamientoMs]);

  return {
    activo,
    escuchando,
    magnitud,
    disponible,
    error,
    iniciar,
    detener,
  };
}
