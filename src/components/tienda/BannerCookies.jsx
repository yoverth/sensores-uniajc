import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTema } from '../../theme/TemaContexto';

/* =========================================================
   BANNER DE CONSENTIMIENTO DE COOKIES
   Tarjeta flotante no intrusiva sobre la barra inferior que
   aparece al primer ingreso hasta que el usuario decide.
========================================================= */

export default function BannerCookies({
  visible,
  onAceptarTodas,
  onSoloEsenciales,
  onConfigurar,
}) {
  const { colores, tokens } = useTema();
  const styles = useMemo(
    () => crearEstilos(colores, tokens),
    [colores, tokens]
  );

  if (!visible) return null;

  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityLabel="Aviso de consentimiento de cookies"
      style={styles.envoltura}
    >
      <View style={styles.tarjeta}>
        <Text style={styles.titulo}>Tu privacidad en Pastelería La T</Text>
        <Text style={styles.texto}>
          Usamos almacenamiento esencial para el funcionamiento de la tienda y
          analítica opcional para mejorar tu experiencia.
        </Text>

        <View style={styles.acciones}>
          <Pressable
            onPress={onAceptarTodas}
            accessibilityRole="button"
            accessibilityLabel="Aceptar todas las cookies"
            accessibilityHint="Activa cookies esenciales y analíticas"
            style={({ pressed }) => [
              styles.botonPrimario,
              pressed && { opacity: 0.86 },
            ]}
          >
            <Text style={styles.botonPrimarioTexto}>Aceptar todas</Text>
          </Pressable>

          <Pressable
            onPress={onSoloEsenciales}
            accessibilityRole="button"
            accessibilityLabel="Aceptar solo cookies esenciales"
            accessibilityHint="Desactiva la analítica opcional"
            style={({ pressed }) => [
              styles.botonSecundario,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.botonSecundarioTexto}>Solo esenciales</Text>
          </Pressable>

          <Pressable
            onPress={onConfigurar}
            accessibilityRole="button"
            accessibilityLabel="Configurar cookies"
            accessibilityHint="Abre el panel de preferencias legales y de cookies"
            style={({ pressed }) => [
              styles.botonConfig,
              pressed && { opacity: 0.75 },
            ]}
          >
            <Text style={styles.botonConfigTexto}>Configurar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function crearEstilos(colores, tokens) {
  return StyleSheet.create({
    envoltura: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 76,
      zIndex: 60,
      alignItems: 'center',
    },
    tarjeta: {
      width: '100%',
      maxWidth: 680,
      backgroundColor: colores.panel,
      borderWidth: 1,
      borderColor: colores.hairlineFuerte,
      borderRadius: tokens.radios.md,
      padding: 14,
      ...tokens.sombras.elevada,
    },
    titulo: {
      ...tokens.tipografia.bodyStrong,
      color: colores.champán,
    },
    texto: {
      ...tokens.tipografia.caption,
      color: colores.textoSuave,
      marginTop: 4,
      lineHeight: 18,
    },
    acciones: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 12,
    },
    botonPrimario: {
      minHeight: tokens.areaTactilMin,
      paddingHorizontal: 14,
      borderRadius: tokens.radios.sm,
      backgroundColor: colores.oro,
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1,
    },
    botonPrimarioTexto: {
      color: colores.darkInk,
      fontSize: 13,
      fontWeight: '700',
    },
    botonSecundario: {
      minHeight: tokens.areaTactilMin,
      paddingHorizontal: 14,
      borderRadius: tokens.radios.sm,
      borderWidth: 1,
      borderColor: colores.hairlineFuerte,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1,
    },
    botonSecundarioTexto: {
      color: colores.oro,
      fontSize: 13,
      fontWeight: '700',
    },
    botonConfig: {
      minHeight: tokens.areaTactilMin,
      paddingHorizontal: 12,
      borderRadius: tokens.radios.sm,
      backgroundColor: colores.grafito,
      borderWidth: 1,
      borderColor: colores.hairline,
      alignItems: 'center',
      justifyContent: 'center',
    },
    botonConfigTexto: {
      color: colores.champán,
      fontSize: 13,
      fontWeight: '600',
    },
  });
}
