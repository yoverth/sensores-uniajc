import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';

import estilos from '../../estilosTienda';
import useAgitar from '../../hooks/useAgitar';
import {
  ENFRIAMIENTO_MS,
  ESPERA_ENTRE_INTENTOS_S,
  UMBRALES,
  UMBRAL_DEFECTO,
  VIGENCIA_MINUTOS,
} from '../../data/promociones';
import { calcularResumen } from '../../logic/carrito';
import { formatearCOP } from '../../logic/formato';
import {
  crearPromocion,
  minutosRestantes,
  premioParaSacudida,
  promocionVigente,
} from '../../logic/promociones';

/* =========================================================
   AGITA Y GANA
   Usa el acelerómetro real. El premio se calcula con la fuerza
   de la sacudida (pico en g), no con números al azar sueltos:
   el azar solo elige el porcentaje dentro de la regla alcanzada.
========================================================= */

export default function PantallaAgitaYGana({
  carrito,
  promocion,
  onGanarPromocion,
  onIrCarrito,
  onIrTienda,
}) {
  const [umbral, setUmbral] = useState(UMBRAL_DEFECTO);
  const [premio, setPremio] = useState(null);
  const [espera, setEspera] = useState(0);
  const [pico, setPico] = useState(0);
  const [aviso, setAviso] = useState(null);

  const escala = useRef(new Animated.Value(0.7)).current;
  const opacidad = useRef(new Animated.Value(0)).current;
  const pulso = useRef(new Animated.Value(1)).current;

  const { activo, escuchando, magnitud, disponible, error, iniciar, detener } =
    useAgitar({
      umbral,
      enfriamientoMs: ENFRIAMIENTO_MS,
      onSacudida: manejarSacudida,
    });

  function manejarSacudida(resultado) {
    detener();
    setPico(resultado.pico);
    setEspera(ESPERA_ENTRE_INTENTOS_S);

    const porcentaje = premioParaSacudida(resultado.pico, umbral);

    if (!porcentaje) {
      setAviso({
        tipo: 'error',
        texto: 'El movimiento no fue suficiente. Intenta de nuevo.',
      });
      return;
    }

    const cupon = crearPromocion(porcentaje);

    setPremio(cupon);
    setAviso(null);

    /* El cupón queda guardado en la sesión apenas se gana, para que no
       se pierda si el cliente va a la tienda a agregar productos. */
    if (onGanarPromocion) {
      onGanarPromocion(cupon);
    }
  }

  /* Animación de entrada del premio */
  useEffect(() => {
    if (!premio) return;

    escala.setValue(0.7);
    opacidad.setValue(0);

    Animated.parallel([
      Animated.spring(escala, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacidad, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [premio, escala, opacidad]);

  /* Latido del círculo mientras se escucha el sensor */
  useEffect(() => {
    if (!escuchando) {
      pulso.stopAnimation();
      pulso.setValue(1);
      return undefined;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, {
          toValue: 1.06,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulso, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [escuchando, pulso]);

  /* Espera entre intentos */
  useEffect(() => {
    if (espera <= 0) return undefined;

    const id = setTimeout(() => setEspera((actual) => Math.max(0, actual - 1)), 1000);
    return () => clearTimeout(id);
  }, [espera]);

  const resumen = calcularResumen(carrito, premio, 'recoger');
  const cuponVigente = Boolean(premio) && promocionVigente(premio);

  const notaCupon = !premio
    ? ''
    : carrito.length === 0
      ? 'Agrega productos al carrito para usar el cupón.'
      : resumen.promoPendiente
        ? `El cupón se activará cuando el subtotal llegue a ${formatearCOP(premio.minimo)}.`
        : 'El descuento ya está activo en tu carrito.';

  const anchoBarra = Math.min(100, Math.max(4, (magnitud / (umbral + 1.2)) * 100));

  const textoEstado =
    disponible === null
      ? 'Comprobando…'
      : disponible === false
        ? 'No disponible'
        : escuchando
          ? 'Escuchando'
          : activo
            ? 'Activando…'
            : 'Listo';

  async function comenzar() {
    if (disponible === false) return;

    setAviso(null);
    setPremio(null);
    setPico(0);

    await iniciar();
  }

  async function reintentar() {
    if (espera > 0) return;

    setAviso(null);
    setPremio(null);
    setPico(0);

    await iniciar();
  }

  /* El cupón se guarda al ganarlo; este botón solo lleva al carrito. */

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <Text style={estilos.tituloPantalla}>Agita y gana</Text>
      <Text style={estilos.subtituloPantalla}>
        Mueve el teléfono de verdad: el acelerómetro mide tu sacudida y
        desbloquea un descuento.
      </Text>

      {promocion && !premio && (
        <View style={[estilos.avisoInline, estilos.avisoExito]}>
          <Text style={[estilos.avisoTexto, estilos.avisoTextoExito]}>
            Ya tienes un cupón del {promocion.porcentaje}% en el carrito. Si
            ganas otro, reemplaza al anterior: los descuentos no se acumulan.
          </Text>
        </View>
      )}

      <View style={estilos.confirmacionCaja}>
        <Text style={estilos.campoEtiqueta}>Cómo funciona</Text>
        <Text style={estilos.pedidoLinea}>
          1. Toca «Comenzar» y permite el acceso al movimiento.
        </Text>
        <Text style={estilos.pedidoLinea}>
          2. Agita el teléfono con energía durante un segundo.
        </Text>
        <Text style={estilos.pedidoLinea}>
          3. Recibe un cupón de 5%, 10% o 15% y aplícalo al carrito.
        </Text>
      </View>

      <View style={estilos.sensorCaja}>
        <View style={estilos.sensorFila}>
          <Text style={estilos.sensorClave}>Acelerómetro</Text>
          <Text style={estilos.sensorValor}>{textoEstado}</Text>
        </View>

        <View style={estilos.sensorFila}>
          <Text style={estilos.sensorClave}>Movimiento actual</Text>
          <Text style={estilos.sensorValor}>{magnitud.toFixed(2)} g</Text>
        </View>

        <View style={estilos.barraSensor}>
          <View
            style={[
              estilos.barraSensorRelleno,
              { width: `${anchoBarra}%` },
              anchoBarra >= 75 && estilos.barraSensorCerca,
            ]}
          />
        </View>

        <Text style={[estilos.notaPie, { textAlign: 'left', marginTop: 8 }]}>
          Umbral {umbral.toFixed(1)} g · pico del último intento{' '}
          {pico.toFixed(2)} g
        </Text>

        <View style={estilos.umbralFila}>
          {UMBRALES.map((opcion) => {
            const activa = umbral === opcion.valor;

            return (
              <Pressable
                key={opcion.valor}
                onPress={() => setUmbral(opcion.valor)}
                disabled={activo}
                accessibilityRole="button"
                accessibilityLabel={`Sensibilidad ${opcion.etiqueta}`}
                accessibilityState={{ selected: activa, disabled: activo }}
                style={({ pressed }) => [
                  estilos.umbralChip,
                  pressed && !activa && estilos.umbralChipPresionado,
                  activa && estilos.umbralChipActivo,
                  activo && estilos.botonDeshabilitado,
                ]}
              >
                <Text
                  style={[
                    estilos.umbralTexto,
                    activa && estilos.umbralTextoActivo,
                  ]}
                >
                  {opcion.etiqueta} · {opcion.valor.toFixed(1)} g
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {disponible === false && (
        <View style={[estilos.avisoInline, estilos.avisoError]}>
          <Text style={[estilos.avisoTexto, estilos.avisoTextoError]}>
            Este dispositivo no reporta acelerómetro disponible. Abre la app en
            un teléfono real para jugar.
          </Text>
        </View>
      )}

      {error ? (
        <View style={[estilos.avisoInline, estilos.avisoError]}>
          <Text style={[estilos.avisoTexto, estilos.avisoTextoError]}>
            {error}
          </Text>
        </View>
      ) : null}

      {aviso && (
        <View
          style={[
            estilos.avisoInline,
            aviso.tipo === 'error' ? estilos.avisoError : estilos.avisoExito,
          ]}
          accessibilityLiveRegion="polite"
        >
          <Text
            style={[
              estilos.avisoTexto,
              aviso.tipo === 'error'
                ? estilos.avisoTextoError
                : estilos.avisoTextoExito,
            ]}
          >
            {aviso.texto}
          </Text>
        </View>
      )}

      <Pressable
        onPress={activo ? detener : comenzar}
        disabled={!activo && (disponible === false || espera > 0)}
        accessibilityRole="button"
        accessibilityLabel={
          activo ? 'Detener la detección de movimiento' : 'Comenzar a agitar'
        }
        accessibilityState={{ disabled: !activo && (disponible === false || espera > 0) }}
        style={({ pressed }) => pressed && estilos.circuloPresionado}
      >
        <Animated.View
          style={[
            estilos.circuloAgitar,
            escuchando && estilos.circuloEscuchando,
            { transform: [{ scale: pulso }] },
            !activo && espera > 0 && estilos.botonDeshabilitado,
          ]}
        >
          <Text style={estilos.circuloAgitarIcono}>{activo ? '📳' : '📱'}</Text>
          <Text style={estilos.circuloAgitarTexto}>
            {activo ? '¡Agita ahora!' : espera > 0 ? `Espera ${espera}s` : 'Comenzar'}
          </Text>
          <Text style={estilos.circuloAgitarSub}>
            {activo
              ? 'Mantén el movimiento firme'
              : espera > 0
                ? 'Un intento a la vez'
                : 'Toca para activar el sensor'}
          </Text>
        </Animated.View>
      </Pressable>

      {premio && (
        <>
          <Animated.View
            style={[
              estilos.premioCaja,
              { opacity: opacidad, transform: [{ scale: escala }] },
            ]}
            accessibilityLiveRegion="polite"
          >
            <Text style={estilos.premioPorcentaje}>{premio.porcentaje}%</Text>
            <Text style={estilos.premioTitulo}>¡Ganaste un descuento!</Text>

            <Text style={estilos.premioTexto}>
              Compra mínima:{' '}
              {premio.minimo > 0 ? formatearCOP(premio.minimo) : 'sin mínimo'}.
              Vigencia: {minutosRestantes(premio)} de {VIGENCIA_MINUTOS} min.
            </Text>

            <Text style={estilos.premioCondiciones}>
              1 uso · no acumulable · canje local de demostración
            </Text>
          </Animated.View>

          <Pressable
            onPress={onIrCarrito}
            disabled={!cuponVigente}
            accessibilityRole="button"
            accessibilityLabel={`Usar el ${premio.porcentaje} por ciento en el carrito`}
            accessibilityState={{ disabled: !cuponVigente }}
            style={({ pressed }) => [
              estilos.botonAncho,
              !cuponVigente && estilos.botonDeshabilitado,
              pressed && estilos.botonAnchoPresionado,
            ]}
          >
            <Text style={estilos.botonAnchoTexto}>
              {cuponVigente
                ? `Usar ${premio.porcentaje}% en mi carrito`
                : 'Cupón vencido'}
            </Text>
          </Pressable>

          <Text style={estilos.notaPie}>{notaCupon}</Text>

          <Pressable
            onPress={reintentar}
            disabled={espera > 0}
            accessibilityRole="button"
            accessibilityLabel="Intentar de nuevo"
            accessibilityState={{ disabled: espera > 0 }}
            style={({ pressed }) => [
              estilos.botonClaro,
              espera > 0 && estilos.botonDeshabilitado,
              pressed && estilos.botonClaroPresionado,
            ]}
          >
            <Text style={estilos.botonClaroTexto}>
              {espera > 0 ? `Podrás intentar en ${espera}s` : 'Intentar de nuevo'}
            </Text>
          </Pressable>
        </>
      )}

      {!premio && (
        <>
          <Text style={estilos.notaPie}>
            Premios: 5% sin mínimo · 10% desde $40.000 · 15% desde $80.000.
          </Text>

          <Pressable
            onPress={onIrTienda}
            accessibilityRole="button"
            accessibilityLabel="Volver a la tienda"
            style={({ pressed }) => [
              estilos.botonClaro,
              pressed && estilos.botonClaroPresionado,
            ]}
          >
            <Text style={estilos.botonClaroTexto}>Volver a la tienda</Text>
          </Pressable>
        </>
      )}

      <Text style={estilos.notaPie}>
        Demostración local: el premio se calcula con las lecturas reales del
        acelerómetro y el descuento se valida solo en el teléfono. Con un
        backend, esa validación debe repetirse al confirmar el pedido.
      </Text>
    </ScrollView>
  );
}
