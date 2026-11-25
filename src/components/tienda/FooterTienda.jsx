import React, { useMemo } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTema } from '../../theme/TemaContexto';
import { EVENTOS_ANALITICA, registrarEvento } from '../../services/analitica';
import LogoMarca from './LogoMarca';

/* =========================================================
   PIE DE PÁGINA DE LA TIENDA · REDES SOCIALES Y LEGALES
   URLs centralizadas y configurables para canales oficiales
   y accesos directos al Centro Legal y Preferencias de cookies.
========================================================= */

export const REDES_SOCIALES = [
  {
    id: 'whatsapp',
    nombre: 'WhatsApp',
    icono: '💬',
    url: 'https://wa.me/573001234567',
    etiqueta: 'Escríbenos por WhatsApp',
  },
  {
    id: 'tiktok',
    nombre: 'TikTok',
    icono: '🎵',
    url: 'https://www.tiktok.com/@lapastelerialat',
    etiqueta: 'Síguenos en TikTok',
  },
  {
    id: 'instagram',
    nombre: 'Instagram',
    icono: '📸',
    url: 'https://www.instagram.com/lapastelerialat',
    etiqueta: 'Síguenos en Instagram',
  },
  {
    id: 'facebook',
    nombre: 'Facebook',
    icono: '📘',
    url: 'https://www.facebook.com/lapastelerialat',
    etiqueta: 'Visítanos en Facebook',
  },
];

const ENLACES_LEGALES = [
  { id: 'privacidad', etiqueta: 'Privacidad' },
  { id: 'terminos', etiqueta: 'Términos' },
  { id: 'cookies', etiqueta: 'Cookies' },
  { id: 'reembolso', etiqueta: 'Reembolso' },
  { id: 'preferencias', etiqueta: 'Preferencias de cookies' },
];

export default function FooterTienda({ onAbrirLegal, onErrorEnlace }) {
  const { colores, tokens } = useTema();
  const styles = useMemo(
    () => crearEstilos(colores, tokens),
    [colores, tokens]
  );

  async function abrirRedSocial(red) {
    registrarEvento(EVENTOS_ANALITICA.CLIC_RED_SOCIAL, {
      red: red.id,
      url: red.url,
    });

    try {
      const soportado = await Linking.canOpenURL(red.url);
      if (!soportado) {
        if (onErrorEnlace) {
          onErrorEnlace(`No se pudo abrir ${red.nombre} en este dispositivo.`);
        }
        return;
      }

      await Linking.openURL(red.url);
    } catch (error) {
      if (onErrorEnlace) {
        onErrorEnlace(`No se pudo abrir ${red.nombre} en este dispositivo.`);
      }
    }
  }

  return (
    <View style={styles.footer} accessibilityLabel="Pie de página de la tienda">
      <View style={styles.marcaBloque}>
        <LogoMarca tamano={36} subtitulo="Repostería artesanal & café" />
      </View>

      <Text style={styles.seccionEtiqueta}>CONECTA CON NOSOTROS</Text>

      <View style={styles.redesFila}>
        {REDES_SOCIALES.map((red) => (
          <Pressable
            key={red.id}
            onPress={() => abrirRedSocial(red)}
            accessibilityRole="link"
            accessibilityLabel={red.etiqueta}
            accessibilityHint={`Abre el perfil oficial de ${red.nombre} en una ventana externa`}
            style={({ pressed }) => [
              styles.redBoton,
              pressed && styles.redBotonPresionado,
            ]}
          >
            <Text style={styles.redIcono}>{red.icono}</Text>
            <Text style={styles.redTexto}>{red.nombre}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.divisor} />

      <Text style={styles.seccionEtiqueta}>INFORMACIÓN LEGAL</Text>

      <View style={styles.legalesFila}>
        {ENLACES_LEGALES.map((enlace) => (
          <Pressable
            key={enlace.id}
            onPress={() => onAbrirLegal && onAbrirLegal(enlace.id)}
            accessibilityRole="button"
            accessibilityLabel={`Abrir ${enlace.etiqueta}`}
            accessibilityHint="Muestra el documento legal correspondiente"
            style={({ pressed }) => [
              styles.legalBoton,
              pressed && styles.legalBotonPresionado,
            ]}
          >
            <Text style={styles.legalTexto}>{enlace.etiqueta}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.derechos}>
        © 2026 La Pastelería La T · Todos los derechos reservados
      </Text>
    </View>
  );
}

function crearEstilos(colores, tokens) {
  return StyleSheet.create({
    footer: {
      marginTop: tokens.espaciado.lg,
      backgroundColor: colores.panel,
      borderWidth: 1,
      borderColor: colores.hairline,
      borderRadius: tokens.radios.md,
      padding: tokens.espaciado.md,
      ...tokens.sombras.tarjeta,
    },
    marcaBloque: {
      marginBottom: tokens.espaciado.md,
    },
    seccionEtiqueta: {
      ...tokens.tipografia.micro,
      color: colores.oroRico,
      marginBottom: tokens.espaciado.sm,
    },
    redesFila: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tokens.espaciado.sm,
    },
    redBoton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      minHeight: tokens.areaTactilMin,
      minWidth: tokens.areaTactilMin,
      paddingHorizontal: 14,
      borderRadius: tokens.radios.pill,
      backgroundColor: colores.grafito,
      borderWidth: 1,
      borderColor: colores.hairline,
    },
    redBotonPresionado: {
      backgroundColor: colores.oroActivo,
      borderColor: colores.hairlineFuerte,
    },
    redIcono: {
      fontSize: 15,
    },
    redTexto: {
      color: colores.champán,
      fontSize: 13,
      fontWeight: '600',
    },
    divisor: {
      height: 1,
      backgroundColor: colores.hairline,
      marginVertical: tokens.espaciado.md,
    },
    legalesFila: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tokens.espaciado.sm,
    },
    legalBoton: {
      minHeight: tokens.areaTactilMin,
      paddingHorizontal: 12,
      borderRadius: tokens.radios.sm,
      borderWidth: 1,
      borderColor: colores.hairline,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },
    legalBotonPresionado: {
      backgroundColor: colores.oroTinte,
      borderColor: colores.hairlineFuerte,
    },
    legalTexto: {
      color: colores.textoSuave,
      fontSize: 12,
      fontWeight: '600',
    },
    derechos: {
      ...tokens.tipografia.caption,
      color: colores.textoTenue,
      marginTop: tokens.espaciado.md,
      textAlign: 'center',
    },
  });
}
