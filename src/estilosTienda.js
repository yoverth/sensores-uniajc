import { Platform, StyleSheet } from 'react-native';

/* =========================================================
   ESTILOS DE LA TIENDA · PASTELERÍA LA T
   Sistema visual «Neo Kinpaku» (DESIGN.md): laca negra cálida,
   oro kinpaku como acento primario y pátina verdigris para el
   estado. Tokens convertidos de los valores OKLCH de DESIGN.md.
   (El laboratorio conserva su tema en `styles.js`.)
========================================================= */

/* ---------- PALETA (tokens OKLCH -> hex) ---------- */
export const colores = {
  /* Superficies */
  laca: '#010101', // lacquer-black · fondo de página
  lacaProfunda: '#000000', // lacquer-deep · el inset más hondo
  panel: '#050403', // raised-lacquer · tarjetas y paneles
  grafito: '#0C0B08', // graphite · campos y superficies inactivas
  grafito2: '#151410', // graphite-2 · píldoras y cromo inactivo

  /* Acentos */
  oro: '#FFBA00', // kinpaku-gold · acento primario (CTA, estado activo)
  oroSuave: '#E7CE9D', // kinpaku-pale · elevación al presionar
  oroRico: '#DDAB46', // kinpaku-rich
  oroHondo: '#9F7D45', // kinpaku-deep
  patina: '#0EB6AC', // verdigris-patina · estado vivo, contraste
  patinaTexto: '#68C3BD', // patina-text · texto pequeño legible
  patinaPálida: '#8ED3CC', // patina-pale
  patinaHonda: '#146F69', // patina-deep

  /* Texto */
  champán: '#E1E1E1', // champagne · titulares
  texto: '#D7D7D7', // text-warm · cuerpo
  textoSuave: '#A4A4A4', // text-muted · metadatos
  textoTenue: '#868686', // text-faint · contenido apagado
  textoApagado: '#696969', // text-mute-deep · deshabilitado

  /* Estado */
  error: '#C25237', // vermilion-warning
  errorTexto: '#ED896A', // vermilion legible sobre laca (8.2:1)
  exito: '#7BC27E', // success legible sobre laca (9.6:1)
  exitoTexto: '#62BB78', // success sobre su propia superficie tintada
  darkInk: '#0B0903', // dark-ink · texto sobre oro (11.6:1)
  tintaSobreOro: '#3A2B0D', // cuerpo secundario sobre oro (8:1)
  tintaSobreOroTenue: '#5B4315', // detalle sobre oro (5.4:1)

  /* Reglas y tintes */
  hairline: 'rgba(183,183,183,0.16)', // gold-hairline (neutral) · borde por defecto
  hairlineFuerte: 'rgba(199,166,103,0.6)', // gold-hairline-strong · foco y activo
  oroTinte: 'rgba(255,186,0,0.08)', // relleno de oro suave
  oroActivo: 'rgba(255,186,0,0.18)', // relleno activo
  oroBorde: 'rgba(255,186,0,0.30)', // borde de oro suave
  patinaTinte: 'rgba(58,179,173,0.10)',
  patinaBorde: 'rgba(58,179,173,0.45)',
  errorTinte: 'rgba(194,82,55,0.16)',
  errorBorde: 'rgba(194,82,55,0.50)',
  errorTinteFuerte: 'rgba(194,82,55,0.22)',
  exitoTinte: 'rgba(98,187,120,0.14)',
};

/* ---------- TIPOGRAFÍA ----------
   Sin fuentes nuevas (restricción del proyecto): el display usa
   el corte fino instalado en cada plataforma y el cuerpo, la sans
   del sistema. La escala respeta los pasos de DESIGN.md. */
export const fuentes = {
  display: Platform.select({
    ios: 'Helvetica Neue',
    android: 'sans-serif-thin',
    default: undefined,
  }),
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
};

/* Sombra neutra con desplazamiento y desenfoque suave
   (Panel Setback / CTA Lift de DESIGN.md). */
const sombraSuave = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  android: { elevation: 6 },
  default: { boxShadow: '0 12px 28px rgba(0,0,0,0.5)' },
});

const estilosTienda = StyleSheet.create({
  /* ---------- ESTRUCTURA ---------- */
  app: { flex: 1, backgroundColor: colores.laca },
  contenido: {
    paddingHorizontal: 16,
    paddingBottom: 130,
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
  },
  filaProductos: { gap: 16 },
  seccionFila: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 8,
  },
  seccionTitulo: {
    color: colores.champán,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  seccionCuenta: { color: colores.textoSuave, fontSize: 13, fontWeight: '500' },

  /* ---------- ENCABEZADO ---------- */
  header: {
    backgroundColor: colores.laca,
    borderBottomWidth: 1,
    borderBottomColor: colores.hairline,
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: Platform.select({ android: 38, ios: 22, default: 14 }),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  marca: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: colores.oro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTexto: {
    color: colores.darkInk,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  marcaNombre: {
    color: colores.champán,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  marcaSubtitulo: {
    color: colores.textoSuave,
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2,
  },
  accionesHeader: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  iconoBoton: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: colores.grafito,
    borderWidth: 1,
    borderColor: colores.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconoBotonPresionado: {
    backgroundColor: colores.grafito2,
    borderColor: colores.hairlineFuerte,
  },
  iconoBotonTexto: { fontSize: 18 },
  badgeCarrito: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colores.oro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCarritoTexto: {
    color: colores.darkInk,
    fontSize: 11,
    fontWeight: '700',
  },

  /* ---------- HERO ---------- */
  hero: {
    marginTop: 16,
    backgroundColor: colores.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colores.hairline,
    padding: 24,
    overflow: 'hidden',
    ...sombraSuave,
  },
  heroCirculo: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,186,0,0.07)',
  },
  heroTitulo: {
    fontFamily: fuentes.display,
    color: colores.champán,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '300',
    letterSpacing: -0.5,
    maxWidth: 460,
  },
  heroTexto: {
    color: colores.texto,
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '400',
    marginTop: 12,
    maxWidth: 460,
  },
  heroBoton: {
    marginTop: 24,
    alignSelf: 'flex-start',
    backgroundColor: colores.oro,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 2,
    minHeight: 48,
    justifyContent: 'center',
    ...sombraSuave,
  },
  heroBotonPresionado: { backgroundColor: colores.oroSuave },
  heroBotonTexto: {
    color: colores.darkInk,
    fontSize: 14,
    fontWeight: '600',
  },

  /* ---------- PROMOCIONES ---------- */
  promosFila: { flexDirection: 'row', gap: 8, marginTop: 16, flexWrap: 'wrap' },
  promoMini: {
    flex: 1,
    minWidth: 150,
    backgroundColor: colores.panel,
    borderWidth: 1,
    borderColor: colores.hairline,
    borderRadius: 4,
    padding: 16,
  },
  promoMiniIcono: { fontSize: 18 },
  promoMiniTitulo: {
    color: colores.champán,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  promoMiniTexto: {
    color: colores.textoSuave,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },

  /* ---------- BUSCADOR ---------- */
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colores.grafito,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colores.hairline,
    paddingHorizontal: 16,
    minHeight: 48,
    marginTop: 16,
  },
  buscadorFoco: { borderColor: colores.hairlineFuerte },
  buscadorIcono: { fontSize: 15, opacity: 0.8 },
  buscadorInput: {
    flex: 1,
    minWidth: 0,
    color: colores.champán,
    fontSize: 14,
    paddingVertical: 12,
  },
  buscadorLimpiar: { paddingHorizontal: 8, paddingVertical: 6 },
  buscadorLimpiarTexto: { color: colores.textoSuave, fontSize: 14 },

  /* ---------- CATEGORÍAS ---------- */
  categoriasScroll: { marginTop: 16 },
  categoriasFila: { gap: 8, paddingVertical: 2, paddingRight: 12 },
  categoriaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 999,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colores.hairline,
  },
  categoriaChipPresionado: { backgroundColor: colores.grafito2 },
  categoriaChipActivo: {
    backgroundColor: colores.oro,
    borderColor: colores.oro,
  },
  categoriaTexto: {
    color: colores.textoSuave,
    fontSize: 13,
    fontWeight: '600',
  },
  categoriaTextoActivo: { color: colores.darkInk },

  /* ---------- TARJETA DE PRODUCTO ---------- */
  tarjeta: {
    flex: 1,
    backgroundColor: colores.panel,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tarjetaZona: {
    borderWidth: 1,
    borderColor: colores.hairline,
  },
  tarjetaPresionada: {
    borderColor: colores.hairlineFuerte,
    backgroundColor: '#0A0908',
  },
  tarjetaImagen: {
    width: '100%',
    height: 150,
    backgroundColor: colores.grafito,
  },
  tarjetaImagenAlta: { height: 200 },
  tarjetaBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colores.oro,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
  },
  tarjetaBadgeAgotado: { backgroundColor: colores.grafito2 },
  tarjetaBadgeTexto: {
    color: colores.darkInk,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  tarjetaBadgeTextoAgotado: { color: colores.errorTexto },
  tarjetaCuerpo: { padding: 16 },
  tarjetaCategoria: {
    color: colores.textoSuave,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  tarjetaNombre: {
    color: colores.champán,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
  },
  tarjetaDescripcion: {
    color: colores.textoSuave,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  tarjetaPrecio: {
    color: colores.champán,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
    letterSpacing: -0.2,
  },
  tarjetaStock: {
    color: colores.textoTenue,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  tarjetaStockBajo: { color: colores.errorTexto },
  tarjetaBotones: { flexDirection: 'row', gap: 8, marginTop: 16 },
  botonSecundario: {
    flex: 1,
    minHeight: 44,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colores.hairlineFuerte,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  botonSecundarioPresionado: {
    backgroundColor: colores.oroActivo,
    borderColor: colores.oro,
  },
  botonSecundarioTexto: {
    color: colores.oro,
    fontSize: 13,
    fontWeight: '600',
  },
  botonPrimario: {
    flex: 1,
    minHeight: 44,
    borderRadius: 2,
    backgroundColor: colores.oro,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  botonPrimarioPresionado: { backgroundColor: colores.oroSuave },
  botonPrimarioTexto: {
    color: colores.darkInk,
    fontSize: 13,
    fontWeight: '600',
  },
  botonDeshabilitado: { opacity: 0.45 },

  /* ---------- CARRITO ---------- */
  carritoItem: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colores.panel,
    borderWidth: 1,
    borderColor: colores.hairline,
    borderRadius: 4,
    padding: 16,
    marginBottom: 8,
  },
  carritoImagen: {
    width: 72,
    height: 72,
    borderRadius: 4,
    backgroundColor: colores.grafito,
  },
  carritoInfo: { flex: 1, minWidth: 0 },
  carritoNombre: {
    color: colores.champán,
    fontSize: 14,
    fontWeight: '600',
  },
  carritoUnitario: {
    color: colores.textoSuave,
    fontSize: 12,
    marginTop: 2,
  },
  carritoSubtotal: {
    color: colores.champán,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  cantidadFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  cantidadBoton: {
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: colores.grafito,
    borderWidth: 1,
    borderColor: colores.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cantidadBotonPresionado: {
    backgroundColor: colores.grafito2,
    borderColor: colores.hairlineFuerte,
  },
  cantidadBotonTexto: {
    color: colores.champán,
    fontSize: 16,
    fontWeight: '600',
  },
  cantidadValor: {
    minWidth: 28,
    textAlign: 'center',
    color: colores.champán,
    fontSize: 14,
    fontWeight: '600',
  },
  eliminarBoton: { alignSelf: 'flex-start', padding: 6, marginTop: 2 },
  eliminarTexto: { fontSize: 14 },

  /* ---------- RESUMEN DE PRECIOS ---------- */
  resumen: {
    backgroundColor: colores.panel,
    borderWidth: 1,
    borderColor: colores.hairline,
    borderRadius: 4,
    padding: 16,
    marginTop: 8,
  },
  resumenFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resumenClave: { color: colores.textoSuave, fontSize: 13 },
  resumenValor: {
    color: colores.champán,
    fontSize: 13,
    fontWeight: '600',
  },
  descuentoValor: { color: colores.exito },
  resumenAviso: {
    color: colores.errorTexto,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 8,
  },
  resumenTotalFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colores.hairline,
    paddingTop: 12,
    marginTop: 4,
  },
  resumenTotalTexto: {
    color: colores.champán,
    fontSize: 15,
    fontWeight: '600',
  },
  resumenTotalValor: {
    color: colores.champán,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
  },

  /* ---------- PROMOCIÓN EN EL CARRITO ---------- */
  promoBox: {
    backgroundColor: colores.oroTinte,
    borderWidth: 1,
    borderColor: colores.oroBorde,
    borderRadius: 4,
    padding: 16,
    marginTop: 8,
  },
  promoBoxTitulo: {
    color: colores.oro,
    fontSize: 13,
    fontWeight: '700',
  },
  promoBoxTexto: {
    color: colores.oroSuave,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  promoBoxEstado: {
    color: colores.exito,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  promoAcciones: { flexDirection: 'row', gap: 8, marginTop: 12 },
  promoQuitar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colores.hairlineFuerte,
    backgroundColor: 'transparent',
  },
  promoQuitarPresionado: { backgroundColor: colores.oroActivo },
  promoQuitarTexto: {
    color: colores.oro,
    fontSize: 12,
    fontWeight: '600',
  },

  /* ---------- VACÍO ---------- */
  vacio: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  vacioIcono: { fontSize: 40 },
  vacioTitulo: {
    color: colores.champán,
    fontSize: 18,
    fontWeight: '600',
  },
  vacioTexto: {
    color: colores.textoSuave,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 22,
  },

  /* ---------- BARRA INFERIOR ---------- */
  barra: {
    flexDirection: 'row',
    backgroundColor: colores.lacaProfunda,
    borderTopWidth: 1,
    borderTopColor: colores.hairline,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 18 : 8,
  },
  barraItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minHeight: 48,
  },
  barraItemPresionado: { opacity: 0.7 },
  barraIconoWrap: { position: 'relative' },
  barraIcono: { fontSize: 18, opacity: 0.55 },
  barraIconoActivo: { opacity: 1 },
  barraTexto: {
    color: colores.textoTenue,
    fontSize: 11,
    fontWeight: '600',
  },
  barraTextoActivo: { color: colores.oro, fontWeight: '700' },
  barraBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: colores.oro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barraBadgeTexto: {
    color: colores.darkInk,
    fontSize: 11,
    fontWeight: '700',
  },
  barraPunto: {
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: colores.oro,
    marginTop: 2,
  },
  barraPuntoVacio: { height: 3, marginTop: 2, backgroundColor: 'transparent' },

  /* ---------- BOTONES GENERALES ---------- */
  botonAncho: {
    minHeight: 52,
    borderRadius: 2,
    backgroundColor: colores.oro,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    ...sombraSuave,
  },
  botonAnchoPresionado: { backgroundColor: colores.oroSuave },
  botonAnchoTexto: {
    color: colores.darkInk,
    fontSize: 15,
    fontWeight: '600',
  },
  botonClaro: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colores.hairlineFuerte,
    minHeight: 48,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
  },
  botonClaroPresionado: { backgroundColor: colores.oroActivo },
  botonClaroTexto: {
    color: colores.oro,
    fontSize: 14,
    fontWeight: '600',
  },

  /* ---------- CHECKOUT ---------- */
  volverFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  volverTexto: {
    color: colores.oro,
    fontSize: 13,
    fontWeight: '600',
  },
  tituloPantalla: {
    fontFamily: fuentes.display,
    color: colores.champán,
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: -0.3,
    marginTop: 8,
  },
  subtituloPantalla: {
    color: colores.textoSuave,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
    marginBottom: 16,
  },
  campo: { marginBottom: 16 },
  campoEtiqueta: {
    color: colores.texto,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  entrada: {
    backgroundColor: colores.grafito,
    borderWidth: 1,
    borderColor: colores.hairline,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 48,
    color: colores.champán,
    fontSize: 14,
  },
  entradaMultilinea: { minHeight: 84, paddingTop: 12, textAlignVertical: 'top' },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colores.panel,
    borderWidth: 1,
    borderColor: colores.hairline,
    borderRadius: 4,
    padding: 16,
    marginBottom: 8,
  },
  opcionActiva: {
    borderColor: colores.hairlineFuerte,
    backgroundColor: colores.oroTinte,
  },
  opcionDeshabilitada: { opacity: 0.5 },
  opcionInfo: { flex: 1, minWidth: 0 },
  opcionTitulo: {
    color: colores.champán,
    fontSize: 13,
    fontWeight: '600',
  },
  opcionTexto: {
    color: colores.textoSuave,
    fontSize: 12,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(183,183,183,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActivo: { borderColor: colores.oro },
  radioPunto: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colores.oro,
  },
  avisoInline: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 4,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
  },
  avisoError: {
    backgroundColor: colores.errorTinte,
    borderColor: colores.errorBorde,
  },
  avisoExito: {
    backgroundColor: colores.exitoTinte,
    borderColor: colores.patinaBorde,
  },
  avisoTexto: { fontSize: 13, lineHeight: 20, flex: 1 },
  avisoTextoError: { color: colores.errorTexto },
  avisoTextoExito: { color: colores.exito },

  /* ---------- CONFIRMACIÓN ---------- */
  exitoCirculo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colores.exitoTinte,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 16,
  },
  exitoIcono: { fontSize: 32 },
  pedidoId: {
    fontFamily: fuentes.mono,
    color: colores.champán,
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 16,
  },
  pedidoNota: {
    color: colores.textoSuave,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 420,
    alignSelf: 'center',
  },
  confirmacionCaja: {
    backgroundColor: colores.panel,
    borderWidth: 1,
    borderColor: colores.hairline,
    borderRadius: 4,
    padding: 16,
    marginTop: 16,
  },

  /* ---------- AGITA Y GANA ---------- */
  sensorCaja: {
    backgroundColor: colores.panel,
    borderWidth: 1,
    borderColor: colores.hairline,
    borderRadius: 4,
    padding: 16,
    marginTop: 16,
  },
  sensorFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sensorClave: { color: colores.textoSuave, fontSize: 12 },
  sensorValor: {
    fontFamily: fuentes.mono,
    color: colores.champán,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  barraSensor: {
    height: 10,
    borderRadius: 999,
    backgroundColor: colores.grafito2,
    overflow: 'hidden',
    marginTop: 8,
  },
  barraSensorRelleno: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colores.patina,
  },
  barraSensorCerca: { backgroundColor: colores.oro },
  circuloAgitar: {
    width: 196,
    height: 196,
    borderRadius: 98,
    alignSelf: 'center',
    backgroundColor: colores.grafito,
    borderWidth: 2,
    borderColor: colores.oro,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  circuloEscuchando: {
    borderColor: colores.patina,
    backgroundColor: colores.patinaTinte,
  },
  circuloPresionado: { backgroundColor: colores.grafito2 },
  circuloAgitarIcono: { fontSize: 32 },
  circuloAgitarTexto: {
    color: colores.champán,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 6,
  },
  circuloAgitarSub: {
    color: colores.textoSuave,
    fontSize: 12,
    marginTop: 4,
  },
  premioCaja: {
    backgroundColor: colores.oro,
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
    ...sombraSuave,
  },
  premioPorcentaje: {
    fontFamily: fuentes.display,
    color: colores.darkInk,
    fontSize: 48,
    fontWeight: '200',
    letterSpacing: -1,
  },
  premioTitulo: {
    color: colores.darkInk,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  premioTexto: {
    color: colores.tintaSobreOro,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },
  premioCondiciones: {
    color: colores.tintaSobreOroTenue,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 12,
  },
  umbralFila: { flexDirection: 'row', gap: 8, marginTop: 16, flexWrap: 'wrap' },
  umbralChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colores.hairline,
    backgroundColor: 'transparent',
  },
  umbralChipPresionado: { backgroundColor: colores.grafito2 },
  umbralChipActivo: {
    backgroundColor: colores.oro,
    borderColor: colores.oro,
  },
  umbralTexto: {
    color: colores.textoSuave,
    fontSize: 13,
    fontWeight: '600',
  },
  umbralTextoActivo: { color: colores.darkInk },

  /* ---------- PEDIDOS ---------- */
  pedidoCard: {
    backgroundColor: colores.panel,
    borderWidth: 1,
    borderColor: colores.hairline,
    borderRadius: 4,
    padding: 16,
    marginBottom: 8,
  },
  pedidoFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  pedidoIdTexto: {
    color: colores.champán,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  pedidoEstado: {
    color: colores.exitoTexto,
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: colores.exitoTinte,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
    overflow: 'hidden',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pedidoFecha: {
    color: colores.textoSuave,
    fontSize: 12,
    marginTop: 4,
  },
  pedidoLinea: {
    color: colores.textoSuave,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  pedidoTotal: {
    color: colores.champán,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },

  /* ---------- PIE / HERRAMIENTAS ---------- */
  pieHerramientas: {
    marginTop: 24,
    backgroundColor: colores.panel,
    borderWidth: 1,
    borderColor: colores.hairline,
    borderRadius: 4,
    padding: 16,
  },
  pieTitulo: {
    color: colores.champán,
    fontSize: 16,
    fontWeight: '700',
  },
  pieTexto: {
    color: colores.textoSuave,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 4,
  },

  /* ---------- NOTAS AL PIE ---------- */
  notaPie: {
    color: colores.textoTenue,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 16,
  },

  /* ---------- AVISO FLOTANTE ---------- */
  avisoFlotante: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 84,
    backgroundColor: colores.grafito2,
    borderWidth: 1,
    borderColor: colores.hairline,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    ...sombraSuave,
  },
  avisoFlotanteError: {
    backgroundColor: colores.errorTinteFuerte,
    borderColor: colores.errorBorde,
  },
  avisoFlotanteTexto: {
    color: colores.champán,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    textAlign: 'center',
  },
});

export default estilosTienda;
