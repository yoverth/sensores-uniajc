import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import estilos, { colores } from '../../estilosTienda';
import ResumenPrecios from '../../components/tienda/ResumenPrecios';
import {
  calcularResumen,
  ENVIO_DOMICILIO,
  ENVIO_GRATIS_DESDE,
} from '../../logic/carrito';
import { formatearCOP } from '../../logic/formato';
import { promocionVigente } from '../../logic/promociones';

/* =========================================================
   PROCESO DE COMPRA
   Recoger / domicilio, datos del cliente y método de pago.
   El pedido se registra localmente (demostración).
========================================================= */

const PAGOS = [
  {
    id: 'efectivo',
    titulo: 'Efectivo contra entrega',
    texto: 'Pagas cuando recibes el pedido.',
    deshabilitado: false,
  },
  {
    id: 'transferencia',
    titulo: 'Transferencia bancaria',
    texto: 'Se coordina por teléfono. No se cobra en línea.',
    deshabilitado: false,
  },
  {
    id: 'tarjeta',
    titulo: 'Tarjeta en línea',
    texto: 'No disponible en esta versión.',
    deshabilitado: true,
  },
];

export default function PantallaCheckout({
  carrito,
  promocion,
  confirmando,
  onConfirmar,
  onVolverCarrito,
}) {
  const [tipoEntrega, setTipoEntrega] = useState('recoger');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [notas, setNotas] = useState('');
  const [pago, setPago] = useState('efectivo');
  const [aviso, setAviso] = useState(null);

  const resumen = calcularResumen(carrito, promocion, tipoEntrega);
  const esDomicilio = tipoEntrega === 'domicilio';
  const cuponVencido = promocion && !promocionVigente(promocion);

  function validar() {
    if (carrito.length === 0) return 'Tu carrito está vacío.';

    if (nombre.trim().length < 3) {
      return 'Escribe tu nombre completo para el pedido.';
    }

    if (telefono.replace(/\D/g, '').length < 7) {
      return 'Escribe un teléfono de contacto válido.';
    }

    if (esDomicilio && direccion.trim().length < 8) {
      return 'Escribe la dirección donde entregamos el pedido.';
    }

    return '';
  }

  async function enviar() {
    const mensaje = validar();

    if (mensaje) {
      setAviso({ tipo: 'error', texto: mensaje });
      return;
    }

    setAviso(null);

    await onConfirmar({
      tipoEntrega,
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
      notas: notas.trim(),
      pago,
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({
        ios: 'padding',
        android: 'height',
        default: undefined,
      })}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={estilos.contenido}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Pressable
          onPress={onVolverCarrito}
          accessibilityRole="button"
          accessibilityLabel="Volver al carrito"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={estilos.volverFila}
        >
          <Text style={estilos.volverTexto}>← Volver al carrito</Text>
        </Pressable>

        <Text style={estilos.tituloPantalla}>Confirmar pedido</Text>
        <Text style={estilos.subtituloPantalla}>
          Revisa los productos y elige cómo quieres recibirlos.
        </Text>

        <View style={estilos.confirmacionCaja}>
          <Text style={estilos.campoEtiqueta}>Tu pedido</Text>

          {carrito.map((item) => (
            <View
              key={item.productoId}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 10,
                marginBottom: 6,
              }}
            >
              <Text style={estilos.pedidoLinea} numberOfLines={1}>
                {item.cantidad} × {item.nombre}
              </Text>
              <Text style={estilos.resumenValor}>
                {formatearCOP(item.precio * item.cantidad)}
              </Text>
            </View>
          ))}
        </View>

        <ResumenPrecios
          resumen={resumen}
          mostrarEnvio={esDomicilio}
          porcentajePromocion={promocion ? promocion.porcentaje : 0}
        />

        {cuponVencido && (
          <View style={[estilos.avisoInline, estilos.avisoError]}>
            <Text style={[estilos.avisoTexto, estilos.avisoTextoError]}>
              El cupón venció y no se aplicará al total.
            </Text>
          </View>
        )}

        <Text style={[estilos.campoEtiqueta, { marginTop: 18 }]}>
          ¿Cómo lo recibes?
        </Text>

        <Pressable
          onPress={() => setTipoEntrega('recoger')}
          accessibilityRole="radio"
          accessibilityState={{ checked: !esDomicilio }}
          accessibilityLabel="Recoger en tienda, sin costo"
          style={[estilos.opcion, !esDomicilio && estilos.opcionActiva]}
        >
          <View style={[estilos.radio, !esDomicilio && estilos.radioActivo]}>
            {!esDomicilio && <View style={estilos.radioPunto} />}
          </View>
          <View style={estilos.opcionInfo}>
            <Text style={estilos.opcionTitulo}>Recoger en tienda</Text>
            <Text style={estilos.opcionTexto}>
              Sin costo · listo en 30 min aproximadamente.
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => setTipoEntrega('domicilio')}
          accessibilityRole="radio"
          accessibilityState={{ checked: esDomicilio }}
          accessibilityLabel="Domicilio"
          style={[estilos.opcion, esDomicilio && estilos.opcionActiva]}
        >
          <View style={[estilos.radio, esDomicilio && estilos.radioActivo]}>
            {esDomicilio && <View style={estilos.radioPunto} />}
          </View>
          <View style={estilos.opcionInfo}>
            <Text style={estilos.opcionTitulo}>Domicilio</Text>
            <Text style={estilos.opcionTexto}>
              {formatearCOP(ENVIO_DOMICILIO)} · gratis desde{' '}
              {formatearCOP(ENVIO_GRATIS_DESDE)}.
            </Text>
          </View>
        </Pressable>

        <Text style={[estilos.campoEtiqueta, { marginTop: 12 }]}>
          Tus datos
        </Text>

        <View style={estilos.campo}>
          <Text style={estilos.campoEtiqueta}>Nombre completo *</Text>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej. Laura Torres"
            placeholderTextColor={colores.textoTenue}
            style={estilos.entrada}
            autoCapitalize="words"
            returnKeyType="next"
            accessibilityLabel="Nombre completo"
          />
        </View>

        <View style={estilos.campo}>
          <Text style={estilos.campoEtiqueta}>Teléfono *</Text>
          <TextInput
            value={telefono}
            onChangeText={setTelefono}
            placeholder="Ej. 300 123 4567"
            placeholderTextColor={colores.textoTenue}
            style={estilos.entrada}
            keyboardType="phone-pad"
            returnKeyType="next"
            accessibilityLabel="Teléfono de contacto"
          />
        </View>

        {esDomicilio && (
          <View style={estilos.campo}>
            <Text style={estilos.campoEtiqueta}>Dirección de entrega *</Text>
            <TextInput
              value={direccion}
              onChangeText={setDireccion}
              placeholder="Calle, número, barrio y ciudad"
              placeholderTextColor={colores.textoTenue}
              style={estilos.entrada}
              returnKeyType="next"
              accessibilityLabel="Dirección de entrega"
            />
          </View>
        )}

        <View style={estilos.campo}>
          <Text style={estilos.campoEtiqueta}>Notas (opcional)</Text>
          <TextInput
            value={notas}
            onChangeText={setNotas}
            placeholder="Dedicatoria, alergias, referencias…"
            placeholderTextColor={colores.textoTenue}
            style={[estilos.entrada, estilos.entradaMultilinea]}
            multiline
            accessibilityLabel="Notas del pedido"
          />
        </View>

        <Text style={[estilos.campoEtiqueta, { marginTop: 6 }]}>
          Método de pago
        </Text>

        {PAGOS.map((opcion) => {
          const activa = pago === opcion.id;

          return (
            <Pressable
              key={opcion.id}
              onPress={() => !opcion.deshabilitado && setPago(opcion.id)}
              disabled={opcion.deshabilitado}
              accessibilityRole="radio"
              accessibilityState={{
                checked: activa,
                disabled: opcion.deshabilitado,
              }}
              accessibilityLabel={opcion.titulo}
              style={[
                estilos.opcion,
                activa && estilos.opcionActiva,
                opcion.deshabilitado && estilos.opcionDeshabilitada,
              ]}
            >
              <View style={[estilos.radio, activa && estilos.radioActivo]}>
                {activa && <View style={estilos.radioPunto} />}
              </View>
              <View style={estilos.opcionInfo}>
                <Text style={estilos.opcionTitulo}>{opcion.titulo}</Text>
                <Text style={estilos.opcionTexto}>{opcion.texto}</Text>
              </View>
            </Pressable>
          );
        })}

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
          onPress={enviar}
          disabled={confirmando}
          accessibilityRole="button"
          accessibilityLabel="Confirmar pedido"
          accessibilityState={{ disabled: confirmando }}
          style={({ pressed }) => [
            estilos.botonAncho,
            (pressed || confirmando) && estilos.botonAnchoPresionado,
          ]}
        >
          {confirmando ? (
            <ActivityIndicator color={colores.darkInk} />
          ) : (
            <Text style={estilos.botonAnchoTexto}>
              Confirmar pedido · {formatearCOP(resumen.total)}
            </Text>
          )}
        </Pressable>

        <Text style={estilos.notaPie}>
          Demostración local: el pedido se guarda en este dispositivo. No se
          envía a la tienda ni se procesa un pago real.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
