import React from 'react';
import { Pressable, Text } from 'react-native';

import { useTema } from '../../theme/TemaContexto';

/* =========================================================
   BOTÓN FLOTANTE DEL ASISTENTE IA
   Fijo sobre la barra inferior, disponible en toda la tienda.
========================================================= */

export default function BotonAsistenteFlotante({ onPress }) {
  const { estilos } = useTema();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Abrir el asistente de IA"
      accessibilityHint="Consulta el catálogo sin salir de la tienda"
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      style={({ pressed }) => [
        estilos.fab,
        pressed && estilos.fabPresionado,
      ]}
    >
      <Text style={estilos.fabIcono}>🤖</Text>
      <Text style={estilos.fabTexto}>IA</Text>
    </Pressable>
  );
}
