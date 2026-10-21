import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import Navegacion from '../components/Navegacion';

/* =========================================================
   SESIÓN 9 · REGISTRO, VALIDACIÓN E INTERACCIÓN DE TAREAS

   Mejoras aplicadas:
   1) Teclado: KeyboardAvoidingView con behavior "height" en
      Android y "padding" en iOS (Platform.select).
   2) Feedback no bloqueante: mensaje en pantalla con
      accessibilityLiveRegion="polite" (sin Alert nativo).
   3) Enfoque: botón para limpiar el texto y envío con la
      tecla Enter/Done del teclado.
========================================================= */

const TAREAS_INICIALES = [
  { id: '1', titulo: 'Comprobar navegación', completada: false },
  { id: '2', titulo: 'Probar teclado y formulario', completada: false },
  { id: '3', titulo: 'Evaluar distintos tamaños', completada: true },
];

export default function PantallaTareas({ pestana, setPestana }) {
  const [tareas, setTareas] = useState(TAREAS_INICIALES);
  const [texto, setTexto] = useState('');
  const [mensaje, setMensaje] = useState(
    'Todavía no hay acciones registradas.'
  );
  const [tipoMensaje, setTipoMensaje] = useState('info'); // info | error | exito

  const inputRef = useRef(null);
  const { width } = useWindowDimensions();
  const esAmplia = width >= 700;

  const sistema =
    Platform.OS === 'ios'
      ? 'iOS'
      : Platform.OS === 'android'
        ? 'Android'
        : 'Web / otro';

  const total = tareas.filter((t) => t.completada).length;

  /* Feedback en pantalla: no abre diálogos ni cierra el teclado */
  function informar(m, tipo = 'info') {
    setMensaje(m);
    setTipoMensaje(tipo);
  }

  function agregar() {
    const titulo = texto.trim();
    if (!titulo) {
      informar('Escribe una tarea antes de agregarla.', 'error');
      return;
    }
    const item = { id: String(Date.now()), titulo, completada: false };
    setTareas((actual) => [item, ...actual]);
    setTexto('');
    informar(`Tarea agregada: "${titulo}"`, 'exito');
  }

  function limpiar() {
    setTexto('');
    informar('Campo de texto limpio.', 'info');
    inputRef.current?.focus();
  }

  function alternar(id) {
    const t = tareas.find((x) => x.id === id);
    setTareas((actual) =>
      actual.map((x) =>
        x.id === id ? { ...x, completada: !x.completada } : x
      )
    );
    if (t) {
      informar(
        t.completada
          ? 'Tarea marcada como pendiente.'
          : 'Tarea completada con éxito.',
        'info'
      );
    }
  }

  const info = [
    ['Plataforma', sistema],
    ['Ancho', `${Math.round(width)} px`],
    ['Diseño', esAmplia ? 'Dos paneles' : 'Una columna'],
    ['Completadas', `${total} de ${tareas.length}`],
  ];

  return (
    <View style={estilos.flex}>
      <KeyboardAvoidingView
        style={estilos.flex}
        behavior={Platform.select({
          ios: 'padding',
          android: 'height',
          default: undefined,
        })}
        // La app no tiene cabecera nativa, por eso el offset es 0
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={estilos.contenido}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Navegacion pestana={pestana} setPestana={setPestana} />

          <Text style={estilos.etiqueta}>
            UNIAJC · DISPOSITIVOS MÓVILES II · SESIÓN 9
          </Text>
          <Text style={estilos.titulo}>Una app, varias plataformas</Text>
          <Text style={estilos.descripcion}>
            La misma lógica de tareas se adapta al tamaño y al sistema operativo
            sin duplicar el proyecto.
          </Text>

          <View style={estilos.indicadores}>
            {info.map(([k, v]) => (
              <View key={k} style={estilos.indicador}>
                <Text style={estilos.indicadorTitulo}>{k}</Text>
                <Text style={estilos.indicadorValor}>{v}</Text>
              </View>
            ))}
          </View>

          <View style={[estilos.paneles, esAmplia && estilos.panelesAmplios]}>
            {/* PANEL 1: ENTRADA Y FORMULARIO */}
            <View style={[estilos.tarjeta, esAmplia && estilos.panelMitad]}>
              <Text style={estilos.subtitulo}>1. Registrar tarea</Text>
              <Text style={estilos.ayuda}>
                Escribe un texto y usa el botón o presiona "Enter" en el
                teclado.
              </Text>

              <View style={estilos.filaEntrada}>
                <TextInput
                  ref={inputRef}
                  value={texto}
                  onChangeText={setTexto}
                  placeholder="Ej. Probar en Android"
                  placeholderTextColor="#5A6678"
                  accessibilityLabel="Nombre de la nueva tarea"
                  style={estilos.entrada}
                  returnKeyType="done"
                  onSubmitEditing={agregar}
                  submitBehavior="submit"
                />

                {texto.length > 0 && (
                  <Pressable
                    onPress={limpiar}
                    accessibilityRole="button"
                    accessibilityLabel="Limpiar el campo de texto"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={({ pressed }) => [
                      estilos.botonLimpiar,
                      pressed && estilos.pulsado,
                    ]}
                  >
                    <Text style={estilos.botonLimpiarTexto}>✕</Text>
                  </Pressable>
                )}
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Agregar nueva tarea"
                accessibilityHint="Guarda la tarea en la lista actual"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={agregar}
                style={({ pressed }) => [
                  estilos.boton,
                  pressed && estilos.pulsado,
                ]}
              >
                <Text style={estilos.botonTexto}>Agregar tarea</Text>
              </Pressable>

              {/* Mensaje de estado dinámico, accesible y no bloqueante */}
              <View
                style={[
                  estilos.notificacionBox,
                  tipoMensaje === 'error' && estilos.notifError,
                  tipoMensaje === 'exito' && estilos.notifExito,
                ]}
              >
                <Text
                  style={[
                    estilos.notificacionTexto,
                    tipoMensaje === 'error' && estilos.textoError,
                    tipoMensaje === 'exito' && estilos.textoExito,
                  ]}
                  accessibilityLiveRegion="polite"
                >
                  {mensaje}
                </Text>
              </View>
            </View>

            {/* PANEL 2: LISTA DE TAREAS */}
            <View style={[estilos.tarjeta, esAmplia && estilos.panelMitad]}>
              <Text style={estilos.subtitulo}>2. Comprobar interacción</Text>
              <Text style={estilos.ayuda}>
                Toca una tarea para cambiar su estado y observa la respuesta.
              </Text>

              {tareas.length === 0 ? (
                <Text style={estilos.vacio}>No hay tareas registradas.</Text>
              ) : (
                tareas.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => alternar(item.id)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: item.completada }}
                    accessibilityLabel={`${item.titulo}, ${
                      item.completada ? 'completada' : 'pendiente'
                    }`}
                    hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                    style={({ pressed }) => [
                      estilos.tarea,
                      item.completada && estilos.tareaCompletada,
                      pressed && estilos.pulsado,
                    ]}
                  >
                    <Text style={estilos.check}>
                      {item.completada ? '✓' : '○'}
                    </Text>
                    <Text
                      style={[
                        estilos.tareaTexto,
                        item.completada && estilos.terminada,
                      ]}
                    >
                      {item.titulo}
                    </Text>
                  </Pressable>
                ))
              )}
            </View>
          </View>

          <View style={estilos.nota}>
            <Text style={estilos.notaTitulo}>¿Qué cambia entre plataformas?</Text>
            <Text style={estilos.notaTexto}>
              • Platform.OS identifica el sistema operativo en tiempo de
              ejecución.{'\n'}• KeyboardAvoidingView usa behavior="height" en
              Android y "padding" en iOS para que el teclado no tape los
              botones.{'\n'}• En web, el diseño aprovecha el ancho en dos
              columnas paralelas sin recortar texto.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* =========================================================
   ESTILOS (paleta oscura del proyecto)
========================================================= */

const estilos = StyleSheet.create({
  flex: { flex: 1 },
  contenido: {
    padding: 14,
    paddingTop: Platform.OS === 'android' ? 34 : 20,
    paddingBottom: 40,
    maxWidth: 1120,
    width: '100%',
    alignSelf: 'center',
  },
  etiqueta: {
    color: '#00E5FF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  titulo: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  descripcion: {
    color: '#7D8799',
    fontSize: 12,
    marginTop: 6,
    marginBottom: 14,
    lineHeight: 18,
  },
  indicadores: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  indicador: {
    flexGrow: 1,
    minWidth: 120,
    backgroundColor: '#0C111D',
    borderWidth: 1,
    borderColor: '#202938',
    padding: 10,
    borderRadius: 10,
  },
  indicadorTitulo: {
    color: '#617089',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  indicadorValor: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
  paneles: { gap: 12 },
  panelesAmplios: { flexDirection: 'row', alignItems: 'flex-start' },
  panelMitad: { flex: 1, minWidth: 0 },
  tarjeta: {
    backgroundColor: '#0C111D',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#202938',
    padding: 14,
  },
  subtitulo: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  ayuda: {
    color: '#617089',
    fontSize: 11,
    marginTop: 4,
    marginBottom: 10,
    lineHeight: 16,
  },
  filaEntrada: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  entrada: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#131A27',
    borderWidth: 1,
    borderColor: '#2A3547',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 46,
    color: '#FFFFFF',
    fontSize: 14,
  },
  botonLimpiar: {
    width: 40,
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131A27',
    borderWidth: 1,
    borderColor: '#2A3547',
  },
  botonLimpiarTexto: { color: '#AAB4C5', fontSize: 15, fontWeight: '900' },
  boton: {
    backgroundColor: '#00E5FF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  pulsado: { opacity: 0.75 },
  botonTexto: { color: '#04121A', fontSize: 14, fontWeight: '900' },
  notificacionBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#0F1724',
    borderWidth: 1,
    borderColor: '#202938',
  },
  notifError: { backgroundColor: '#2A1316', borderColor: '#5A2A2A' },
  notifExito: { backgroundColor: '#0E2320', borderColor: '#1E4A3F' },
  notificacionTexto: { color: '#AAB4C5', fontSize: 11, fontWeight: '600' },
  textoError: { color: '#FF8A8A' },
  textoExito: { color: '#00D9A6' },
  vacio: {
    color: '#617089',
    fontSize: 12,
    fontStyle: 'italic',
    marginVertical: 10,
  },
  tarea: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#101A2B',
    borderWidth: 1,
    borderColor: '#202938',
    borderRadius: 10,
    minHeight: 48,
  },
  tareaCompletada: { backgroundColor: '#0B1119', borderColor: '#1B2434' },
  check: { color: '#00E5FF', fontSize: 18, fontWeight: '900' },
  tareaTexto: {
    color: '#DCE3EE',
    fontWeight: '600',
    flexShrink: 1,
    fontSize: 13,
  },
  terminada: { textDecorationLine: 'line-through', color: '#5A6678' },
  nota: {
    backgroundColor: '#0E1A28',
    borderWidth: 1,
    borderColor: '#1B2C40',
    padding: 14,
    borderRadius: 12,
    marginTop: 14,
  },
  notaTitulo: {
    color: '#00E5FF',
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 6,
  },
  notaTexto: { color: '#8CA0B8', fontSize: 11, lineHeight: 18 },
});
