import { useEffect, useState } from 'react';
import { Accelerometer } from 'expo-sensors';

/* =========================================================
   HOOK: SUSCRIPCIÓN AL ACELERÓMETRO
========================================================= */

export default function useAcelerometro() {
  const [datosSensor, setDatosSensor] = useState({ x: 0, y: 0, z: 0 });
  const [sensorDisponible, setSensorDisponible] = useState(true);

  useEffect(() => {
    let suscripcion = null;

    Accelerometer.isAvailableAsync().then((disponible) => {
      setSensorDisponible(disponible);
      if (disponible) {
        Accelerometer.setUpdateInterval(50);
        suscripcion = Accelerometer.addListener((data) => {
          setDatosSensor(data);
        });
      }
    });

    return () => {
      if (suscripcion) suscripcion.remove();
    };
  }, []);

  return { datosSensor, sensorDisponible };
}
