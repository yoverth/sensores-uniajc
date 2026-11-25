import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { useTema } from '../../theme/TemaContexto';
import LogoMarca from './LogoMarca';

/* =========================================================
   MÓDULO LEGAL Y PREFERENCIAS DE COOKIES · PASTELERÍA LA T
   Presenta en un modal accesible las cuatro políticas legales
   y el panel interactivo de consentimiento de cookies.
========================================================= */

const PESTANAS = [
  { id: 'privacidad', etiqueta: 'Privacidad' },
  { id: 'terminos', etiqueta: 'Términos' },
  { id: 'cookies', etiqueta: 'Cookies' },
  { id: 'reembolso', etiqueta: 'Reembolso' },
  { id: 'preferencias', etiqueta: 'Preferencias' },
];

const DOCUMENTOS = {
  privacidad: {
    titulo: 'Política de Privacidad',
    actualizado: 'Última actualización: noviembre de 2026',
    secciones: [
      {
        subtitulo: '1. Datos que recopilamos',
        cuerpo:
          'En Pastelería La T solicitamos únicamente los datos indispensables para gestionar tu pedido: nombre completo, número de teléfono de contacto, dirección de entrega (cuando eliges domicilio) y notas opcionales sobre dedicatorias o alergias.',
      },
      {
        subtitulo: '2. Finalidad del tratamiento',
        cuerpo:
          'Tu información se utiliza exclusivamente para preparar los productos solicitados, coordinar entregas o recogida en tienda, validar el método de pago elegido y atender novedades sobre tu orden.',
      },
      {
        subtitulo: '3. Almacenamiento y protección',
        cuerpo:
          'En esta versión de demostración local, los pedidos y tu carrito permanecen en la memoria de la sesión de tu dispositivo sin enviarse a servidores externos ni compartirse con terceros. Cuando se conecte un backend comercial, la transmisión se realizará cifrada bajo HTTPS.',
      },
      {
        subtitulo: '4. Tus derechos',
        cuerpo:
          'Puedes solicitar la actualización, corrección o eliminación de tus datos de contacto comunicándote por nuestros canales oficiales de atención en WhatsApp o en el punto de venta físico.',
      },
    ],
  },
  terminos: {
    titulo: 'Términos y Condiciones',
    actualizado: 'Última actualización: noviembre de 2026',
    secciones: [
      {
        subtitulo: '1. Catálogo, precios y disponibilidad',
        cuerpo:
          'Todos los precios publicados en la tienda están expresados en pesos colombianos (COP). Las existencias reflejan la disponibilidad artesanal diaria y pueden variar según la demanda.',
      },
      {
        subtitulo: '2. Pedidos, entregas y tiempos estimados',
        cuerpo:
          'Puedes seleccionar recogida en tienda sin costo adicional (tiempo estimado de preparación de 30 minutos) o entrega a domicilio por $6.000 COP, con envío gratuito en pedidos desde $80.000 COP calculados después de aplicar descuentos vigentes.',
      },
      {
        subtitulo: '3. Promociones «Agita y gana»',
        cuerpo:
          'Los cupones de 5%, 10% o 15% tienen una vigencia de 15 minutos desde su emisión, permiten 1 solo uso, no son acumulables entre sí y respetan el monto mínimo indicado para cada porcentaje.',
      },
      {
        subtitulo: '4. Medios de pago',
        cuerpo:
          'Actualmente aceptamos efectivo contra entrega y transferencia bancaria coordinada manualmente. El pago en línea con tarjeta permanece deshabilitado en esta versión.',
      },
    ],
  },
  cookies: {
    titulo: 'Política de Cookies',
    actualizado: 'Última actualización: noviembre de 2026',
    secciones: [
      {
        subtitulo: '1. Qué son las cookies y el almacenamiento local',
        cuerpo:
          'Utilizamos almacenamiento local del navegador (`localStorage`) y estado de sesión para recordar tu configuración básica y, solo si nos autorizas, medir interacciones agregadas dentro de la tienda.',
      },
      {
        subtitulo: '2. Cookies esenciales (siempre activas)',
        cuerpo:
          'Permiten conservar tu elección de consentimiento de privacidad y garantizar que la navegación básica de la aplicación web funcione de manera segura y estable.',
      },
      {
        subtitulo: '3. Cookies analíticas (opcionales)',
        cuerpo:
          'Si las aceptas, registramos métricas internas sin datos bancarios ni contraseñas (como vistas de pantalla, búsquedas, uso del zoom, intentos en «Agita y gana», consultas al asistente y pedidos completados) para mejorar el catálogo y la experiencia de compra.',
      },
      {
        subtitulo: '4. Gestión de tus preferencias',
        cuerpo:
          'Puedes aceptar, rechazar o modificar las cookies analíticas en cualquier momento desde el botón «Preferencias de cookies» ubicado en el pie de página o en la pestaña Preferencias de este visor.',
      },
    ],
  },
  reembolso: {
    titulo: 'Política de Reembolso y Devoluciones',
    actualizado: 'Última actualización: noviembre de 2026',
    secciones: [
      {
        subtitulo: '1. Naturaleza perecedera de nuestros productos',
        cuerpo:
          'Nuestras tortas, cheesecakes, cupcakes y postres son alimentos frescos elaborados artesanalmente. Por razones sanitarias y de inocuidad alimentaria, no aceptamos devoluciones de productos ya abiertos o manipulados fuera de nuestras instalaciones, salvo fallas de calidad o error en el despacho.',
      },
      {
        subtitulo: '2. Cuándo aplica cambio o reembolso',
        cuerpo:
          'Procederá reposición sin costo o reembolso total cuando: (a) recibas un producto distinto al confirmado, (b) el pedido presente daños evidentes causados durante el transporte a domicilio, o (c) exista un defecto de frescura comprobable.',
      },
      {
        subtitulo: '3. Plazo y procedimiento de reporte',
        cuerpo:
          'Debes reportar cualquier novedad dentro de las primeras 24 horas posteriores a la entrega adjuntando tu identificador de pedido (ej. LT-DDMM-0001) y una fotografía del estado del producto a través de nuestro canal oficial de WhatsApp.',
      },
      {
        subtitulo: '4. Cancelaciones anticipadas',
        cuerpo:
          'Puedes cancelar o ajustar un pedido antes de que entre en etapa de preparación o salga a reparto. Una vez despachado, el envío a domicilio no es reembolsable salvo incumplimiento atribuible a la pastelería.',
      },
    ],
  },
};

export default function ModalLegal({
  visible,
  documentoInicial = 'privacidad',
  consentimiento,
  onGuardarCookies,
  onCerrar,
}) {
  const { colores, tokens } = useTema();
  const [activo, setActivo] = useState(documentoInicial || 'privacidad');
  const [analiticas, setAnaliticas] = useState(
    Boolean(consentimiento?.analiticas)
  );
  const [confirmacion, setConfirmacion] = useState('');

  useEffect(() => {
    if (visible) {
      setActivo(documentoInicial || 'privacidad');
      setAnaliticas(Boolean(consentimiento?.analiticas));
      setConfirmacion('');
    }
  }, [visible, documentoInicial, consentimiento?.analiticas]);

  const styles = useMemo(
    () => crearEstilos(colores, tokens),
    [colores, tokens]
  );

  const documentoActual = DOCUMENTOS[activo] || null;

  function guardar(aceptarAnaliticas) {
    setAnaliticas(aceptarAnaliticas);
    if (onGuardarCookies) {
      onGuardarCookies({ analiticas: aceptarAnaliticas });
    }
    setConfirmacion(
      aceptarAnaliticas
        ? 'Preferencias guardadas: cookies esenciales y analíticas activas.'
        : 'Preferencias guardadas: solo cookies esenciales activas.'
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCerrar}
    >
      <View style={styles.fondo} accessibilityViewIsModal>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onCerrar}
          accessibilityRole="button"
          accessibilityLabel="Cerrar ventana legal"
          accessibilityHint="Cierra el aviso legal y vuelve a la tienda"
        />

        <View style={styles.hoja}>
          <View style={styles.cabecera}>
            <View style={styles.cabeceraMarca}>
              <LogoMarca tamano={32} mostrarTexto={false} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.cabeceraTitulo} numberOfLines={1}>
                  Centro Legal y Privacidad
                </Text>
                <Text style={styles.cabeceraSub} numberOfLines={1}>
                  La Pastelería La T
                </Text>
              </View>
            </View>

            <Pressable
              onPress={onCerrar}
              accessibilityRole="button"
              accessibilityLabel="Cerrar centro legal"
              accessibilityHint="Vuelve a la tienda"
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              style={({ pressed }) => [
                styles.cerrar,
                pressed && { opacity: 0.72 },
              ]}
            >
              <Text style={styles.cerrarTexto}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsFila}
            style={styles.tabsScroll}
          >
            {PESTANAS.map((tab) => {
              const seleccionada = activo === tab.id;

              return (
                <Pressable
                  key={tab.id}
                  onPress={() => {
                    setActivo(tab.id);
                    setConfirmacion('');
                  }}
                  accessibilityRole="tab"
                  accessibilityLabel={`Ver ${tab.etiqueta}`}
                  accessibilityState={{ selected: seleccionada }}
                  style={({ pressed }) => [
                    styles.tab,
                    seleccionada && styles.tabActiva,
                    pressed && !seleccionada && styles.tabPresionada,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabTexto,
                      seleccionada && styles.tabTextoActiva,
                    ]}
                  >
                    {tab.etiqueta}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <ScrollView
            contentContainerStyle={styles.cuerpo}
            showsVerticalScrollIndicator={false}
          >
            {activo === 'preferencias' ? (
              <View>
                <Text style={styles.docTitulo}>Preferencias de cookies</Text>
                <Text style={styles.docFecha}>
                  Elige qué categorías permites mientras navegas por Pastelería
                  La T. Puedes cambiar esta decisión en cualquier momento.
                </Text>

                <View style={styles.tarjetaPref}>
                  <View style={styles.prefFila}>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={styles.prefTitulo}>Cookies esenciales</Text>
                      <Text style={styles.prefDesc}>
                        Necesarias para recordar tu consentimiento de privacidad y
                        el funcionamiento básico de la tienda.
                      </Text>
                    </View>
                    <View style={styles.badgeFijo}>
                      <Text style={styles.badgeFijoTexto}>SIEMPRE ACTIVAS</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.tarjetaPref}>
                  <View style={styles.prefFila}>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={styles.prefTitulo}>Cookies analíticas</Text>
                      <Text style={styles.prefDesc}>
                        Permiten registrar eventos de uso (búsquedas, zoom,
                        consultas al asistente y pedidos) para mejorar nuestra
                        experiencia de compra.
                      </Text>
                    </View>

                    <Switch
                      value={analiticas}
                      onValueChange={(valor) => {
                        setAnaliticas(valor);
                        setConfirmacion('');
                      }}
                      trackColor={{
                        false: colores.grafito2,
                        true: colores.patina,
                      }}
                      thumbColor={colores.panel}
                      accessibilityRole="switch"
                      accessibilityLabel="Activar o desactivar cookies analíticas"
                      accessibilityState={{ checked: analiticas }}
                    />
                  </View>
                </View>

                {Boolean(confirmacion) && (
                  <View
                    style={styles.avisoExito}
                    accessibilityLiveRegion="polite"
                  >
                    <Text style={styles.avisoExitoTexto}>{confirmacion}</Text>
                  </View>
                )}

                <Pressable
                  onPress={() => guardar(analiticas)}
                  accessibilityRole="button"
                  accessibilityLabel="Guardar preferencias de cookies"
                  accessibilityHint="Aplica la configuración seleccionada"
                  style={({ pressed }) => [
                    styles.botonPrimario,
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <Text style={styles.botonPrimarioTexto}>
                    Guardar preferencias
                  </Text>
                </Pressable>

                <View style={styles.botonesDobles}>
                  <Pressable
                    onPress={() => guardar(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Aceptar todas las cookies"
                    style={({ pressed }) => [
                      styles.botonSecundario,
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Text style={styles.botonSecundarioTexto}>
                      Aceptar todas
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => guardar(false)}
                    accessibilityRole="button"
                    accessibilityLabel="Usar solo cookies esenciales"
                    style={({ pressed }) => [
                      styles.botonSecundario,
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Text style={styles.botonSecundarioTexto}>
                      Solo esenciales
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              documentoActual && (
                <View>
                  <Text style={styles.docTitulo}>{documentoActual.titulo}</Text>
                  <Text style={styles.docFecha}>
                    {documentoActual.actualizado}
                  </Text>

                  {documentoActual.secciones.map((sec) => (
                    <View key={sec.subtitulo} style={styles.seccion}>
                      <Text style={styles.seccionSub}>{sec.subtitulo}</Text>
                      <Text style={styles.seccionCuerpo}>{sec.cuerpo}</Text>
                    </View>
                  ))}

                  {activo === 'cookies' && (
                    <Pressable
                      onPress={() => setActivo('preferencias')}
                      accessibilityRole="button"
                      accessibilityLabel="Ir a Preferencias de cookies"
                      accessibilityHint="Abre los controles para activar o desactivar cookies analíticas"
                      style={({ pressed }) => [
                        styles.botonSecundario,
                        { marginTop: 12 },
                        pressed && { opacity: 0.8 },
                      ]}
                    >
                      <Text style={styles.botonSecundarioTexto}>
                        Configurar preferencias de cookies
                      </Text>
                    </Pressable>
                  )}
                </View>
              )
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function crearEstilos(colores, tokens) {
  return StyleSheet.create({
    fondo: {
      flex: 1,
      backgroundColor: colores.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      padding: tokens.espaciado.md,
    },
    hoja: {
      width: '100%',
      maxWidth: 680,
      maxHeight: '90%',
      backgroundColor: colores.panel,
      borderRadius: tokens.radios.md,
      borderWidth: 1,
      borderColor: colores.hairline,
      overflow: 'hidden',
      ...tokens.sombras.elevada,
    },
    cabecera: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: tokens.espaciado.sm,
      paddingHorizontal: tokens.espaciado.md,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colores.hairline,
    },
    cabeceraMarca: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
      minWidth: 0,
    },
    cabeceraTitulo: {
      ...tokens.tipografia.h3,
      fontSize: 16,
      lineHeight: 21,
      color: colores.champán,
    },
    cabeceraSub: {
      ...tokens.tipografia.caption,
      color: colores.textoSuave,
    },
    cerrar: {
      minWidth: tokens.areaTactilMin,
      minHeight: tokens.areaTactilMin,
      borderRadius: tokens.areaTactilMin / 2,
      backgroundColor: colores.grafito,
      borderWidth: 1,
      borderColor: colores.hairline,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cerrarTexto: {
      color: colores.champán,
      fontSize: 16,
      fontWeight: '700',
    },
    tabsScroll: {
      flexGrow: 0,
      borderBottomWidth: 1,
      borderBottomColor: colores.hairline,
      backgroundColor: colores.grafito,
    },
    tabsFila: {
      paddingHorizontal: tokens.espaciado.md,
      paddingVertical: 8,
      gap: 8,
    },
    tab: {
      minHeight: tokens.areaTactilMin,
      paddingHorizontal: 14,
      borderRadius: tokens.radios.pill,
      borderWidth: 1,
      borderColor: colores.hairline,
      backgroundColor: colores.panel,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabPresionada: {
      backgroundColor: colores.grafito2,
    },
    tabActiva: {
      backgroundColor: colores.oro,
      borderColor: colores.oro,
    },
    tabTexto: {
      color: colores.textoSuave,
      fontSize: 13,
      fontWeight: '600',
    },
    tabTextoActiva: {
      color: colores.darkInk,
      fontWeight: '700',
    },
    cuerpo: {
      padding: tokens.espaciado.md,
      paddingBottom: tokens.espaciado.lg,
    },
    docTitulo: {
      ...tokens.tipografia.h2,
      color: colores.champán,
    },
    docFecha: {
      ...tokens.tipografia.caption,
      color: colores.textoSuave,
      marginTop: 4,
      marginBottom: 16,
      lineHeight: 19,
    },
    seccion: {
      backgroundColor: colores.grafito,
      borderWidth: 1,
      borderColor: colores.hairline,
      borderRadius: tokens.radios.sm,
      padding: 14,
      marginBottom: 10,
    },
    seccionSub: {
      ...tokens.tipografia.bodyStrong,
      color: colores.champán,
      marginBottom: 4,
    },
    seccionCuerpo: {
      ...tokens.tipografia.body,
      fontSize: 13,
      lineHeight: 20,
      color: colores.textoSuave,
    },
    tarjetaPref: {
      backgroundColor: colores.grafito,
      borderWidth: 1,
      borderColor: colores.hairline,
      borderRadius: tokens.radios.sm,
      padding: 14,
      marginBottom: 12,
    },
    prefFila: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    prefTitulo: {
      ...tokens.tipografia.bodyStrong,
      color: colores.champán,
    },
    prefDesc: {
      ...tokens.tipografia.caption,
      color: colores.textoSuave,
      marginTop: 4,
      lineHeight: 18,
    },
    badgeFijo: {
      backgroundColor: colores.exitoTinte,
      borderWidth: 1,
      borderColor: colores.patinaBorde,
      borderRadius: tokens.radios.xs,
      paddingHorizontal: 8,
      paddingVertical: 5,
    },
    badgeFijoTexto: {
      color: colores.exitoTexto,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.6,
    },
    avisoExito: {
      backgroundColor: colores.exitoTinte,
      borderWidth: 1,
      borderColor: colores.patinaBorde,
      borderRadius: tokens.radios.sm,
      padding: 12,
      marginBottom: 12,
    },
    avisoExitoTexto: {
      color: colores.exitoTexto,
      fontSize: 13,
      fontWeight: '600',
      lineHeight: 19,
    },
    botonPrimario: {
      minHeight: 48,
      borderRadius: tokens.radios.sm,
      backgroundColor: colores.oro,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
      marginTop: 4,
    },
    botonPrimarioTexto: {
      color: colores.darkInk,
      fontSize: 14,
      fontWeight: '700',
    },
    botonesDobles: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 10,
    },
    botonSecundario: {
      flex: 1,
      minWidth: 140,
      minHeight: tokens.areaTactilMin,
      borderRadius: tokens.radios.sm,
      borderWidth: 1,
      borderColor: colores.hairlineFuerte,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 12,
    },
    botonSecundarioTexto: {
      color: colores.oro,
      fontSize: 13,
      fontWeight: '700',
    },
  });
}
