import React from 'react';
import { Text, View } from 'react-native';

import estilos from '../../estilosTienda';
import { formatearCOP } from '../../logic/formato';

/* =========================================================
   RESUMEN DE PRECIOS
   Subtotal, descuento, envío y total final.
========================================================= */

function Fila({ clave, valor, estiloValor }) {
  return (
    <View style={estilos.resumenFila}>
      <Text style={estilos.resumenClave}>{clave}</Text>
      <Text style={[estilos.resumenValor, estiloValor]}>{valor}</Text>
    </View>
  );
}

export default function ResumenPrecios({
  resumen,
  mostrarEnvio = false,
  porcentajePromocion = 0,
}) {
  const { subtotal, descuento, envio, total, promoPendiente } = resumen;

  return (
    <View style={estilos.resumen} accessibilityLabel="Resumen de precios">
      <Fila clave="Subtotal" valor={formatearCOP(subtotal)} />

      {descuento > 0 && (
        <Fila
          clave={
            porcentajePromocion ? `Descuento (${porcentajePromocion}%)` : 'Descuento'
          }
          valor={`- ${formatearCOP(descuento)}`}
          estiloValor={estilos.descuentoValor}
        />
      )}

      {mostrarEnvio && (
        <Fila
          clave="Envío a domicilio"
          valor={envio === 0 ? 'Gratis' : formatearCOP(envio)}
          estiloValor={envio === 0 ? estilos.descuentoValor : undefined}
        />
      )}

      {promoPendiente != null && (
        <Text style={estilos.resumenAviso}>
          Te faltan {formatearCOP(promoPendiente)} para activar el descuento.
        </Text>
      )}

      <View style={estilos.resumenTotalFila}>
        <Text style={estilos.resumenTotalTexto}>Total</Text>
        <Text style={estilos.resumenTotalValor}>{formatearCOP(total)}</Text>
      </View>
    </View>
  );
}
