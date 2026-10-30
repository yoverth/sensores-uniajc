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
    let vigente = true;

    Accelerometer.isAvailableAsync()
      .then((disponible) => {
        if (!vigente) return;

        setSensorDisponible(disponible);

        if (!disponible) return;

        Accelerometer.setUpdateInterval(50);
        suscripcion = Accelerometer.addListener((data) => {
          setDatosSensor(data);
        });
      })
      .catch(() => {
        /* En web algunos navegadores exponen el evento pero no el
           módulo nativo: se informa como sensor no disponible. */
        if (vigente) setSensorDisponible(false);
      });

    return () => {
      vigente = false;
      if (suscripcion) suscripcion.remove();
    };
  }, []);

  return { datosSensor, sensorDisponible };
}
