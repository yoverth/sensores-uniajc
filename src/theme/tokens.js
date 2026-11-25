import { Platform } from 'react-native';

/* =========================================================
   TOKENS DE DISEÑO · PASTELERÍA LA T
   Fuente centralizada de tipografía, espaciados, radios,
   sombras, áreas táctiles WCAG AA y colores semánticos.
========================================================= */

export const AREA_TACTIL_MIN = 44;

export const FUENTES = {
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

export const ESCALA_TIPOGRAFICA = {
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
  },
  bodyStrong: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  caption: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  micro: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 0.7,
  },
};

export const ESPACIADO = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIOS = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  pill: 999,
};

export function crearSombras(modo = 'claro') {
  const claro = modo === 'claro';

  const suave = Platform.select({
    ios: {
      shadowColor: claro ? '#3B2417' : '#000000',
      shadowOpacity: claro ? 0.14 : 0.5,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
    },
    android: { elevation: 6 },
    default: {
      boxShadow: claro
        ? '0 12px 28px rgba(59,36,23,0.12)'
        : '0 12px 28px rgba(0,0,0,0.5)',
    },
  });

  const tarjeta = Platform.select({
    ios: {
      shadowColor: claro ? '#3B2417' : '#000000',
      shadowOpacity: claro ? 0.08 : 0.34,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
    },
    android: { elevation: 2 },
    default: {
      boxShadow: claro
        ? '0 4px 14px rgba(59,36,23,0.08)'
        : '0 4px 14px rgba(0,0,0,0.34)',
    },
  });

  const elevada = Platform.select({
    ios: {
      shadowColor: claro ? '#3B2417' : '#000000',
      shadowOpacity: claro ? 0.2 : 0.6,
      shadowRadius: 28,
      shadowOffset: { width: 0, height: 14 },
    },
    android: { elevation: 10 },
    default: {
      boxShadow: claro
        ? '0 14px 34px rgba(59,36,23,0.18)'
        : '0 14px 34px rgba(0,0,0,0.62)',
    },
  });

  return { suave, tarjeta, elevada };
}

/* Paletas verificadas para contraste WCAG AA (>= 4.5:1 en textos). */
export const COLORES_SEMANTICOS = {
  claro: {
    /* Superficies */
    laca: '#FAF6F0',
    lacaProfunda: '#F3EBE1',
    panel: '#FFFFFF',
    panelPresionado: '#FFF7EF',
    grafito: '#F6EFE6',
    grafito2: '#EFE3D5',

    /* Acentos caramelo / cacao (WCAG AA sobre superficies claras y con tinta blanca) */
    oro: '#954F28',
    oroSuave: '#7A3F22',
    oroRico: '#834321',
    oroHondo: '#6E391F',
    patina: '#246D5F',
    patinaTexto: '#1F6D5F',
    patinaPálida: '#7FBDB1',
    patinaHonda: '#1A5A4F',

    /* Texto */
    champán: '#3B2417',
    texto: '#3B2417',
    textoSuave: '#654C3E',
    textoTenue: '#6F5749',
    textoApagado: '#755C4D',

    /* Estado */
    error: '#B23A2A',
    errorTexto: '#9E2F21',
    exito: '#266B43',
    exitoTexto: '#266B43',
    darkInk: '#FFFFFF',
    tintaSobreOro: '#FFF5EE',
    tintaSobreOroTenue: '#FCE8DA',

    /* Reglas y tintes */
    hairline: '#EADFD3',
    hairlineFuerte: 'rgba(149,79,40,0.58)',
    oroTinte: 'rgba(149,79,40,0.08)',
    oroActivo: 'rgba(149,79,40,0.16)',
    oroBorde: 'rgba(149,79,40,0.34)',
    patinaTinte: 'rgba(36,109,95,0.10)',
    patinaBorde: 'rgba(36,109,95,0.44)',
    errorTinte: 'rgba(178,58,42,0.10)',
    errorBorde: 'rgba(178,58,42,0.38)',
    errorTinteFuerte: 'rgba(178,58,42,0.18)',
    exitoTinte: 'rgba(38,107,67,0.12)',
    radioBorde: 'rgba(101,76,62,0.52)',

    /* Aliases semánticos y esqueleto */
    fondo: '#FAF6F0',
    superficie: '#FFFFFF',
    superficieSecundaria: '#F6EFE6',
    primario: '#954F28',
    primarioTexto: '#FFFFFF',
    secundario: '#246D5F',
    textoPrincipal: '#3B2417',
    textoSecundario: '#654C3E',
    borde: '#EADFD3',
    esqueletoBase: '#ECE1D4',
    esqueletoBrillo: '#F6EFE6',
    overlay: 'rgba(20,12,8,0.68)',
  },
  oscuro: {
    /* Superficies */
    laca: '#12100E',
    lacaProfunda: '#0C0B09',
    panel: '#1E1A17',
    panelPresionado: '#26211C',
    grafito: '#26211B',
    grafito2: '#2F2921',

    /* Acentos */
    oro: '#FFBA00',
    oroSuave: '#E7CE9D',
    oroRico: '#DDAB46',
    oroHondo: '#9F7D45',
    patina: '#0EB6AC',
    patinaTexto: '#68C3BD',
    patinaPálida: '#8ED3CC',
    patinaHonda: '#146F69',

    /* Texto */
    champán: '#F8F4F0',
    texto: '#EDE7E0',
    textoSuave: '#C8BEB5',
    textoTenue: '#B3A89E',
    textoApagado: '#A4998F',

    /* Estado */
    error: '#C25237',
    errorTexto: '#ED896A',
    exito: '#7BC27E',
    exitoTexto: '#62BB78',
    darkInk: '#0B0903',
    tintaSobreOro: '#2B1F06',
    tintaSobreOroTenue: '#3A2B0D',

    /* Reglas y tintes */
    hairline: 'rgba(200,190,181,0.18)',
    hairlineFuerte: 'rgba(255,186,0,0.58)',
    oroTinte: 'rgba(255,186,0,0.09)',
    oroActivo: 'rgba(255,186,0,0.18)',
    oroBorde: 'rgba(255,186,0,0.34)',
    patinaTinte: 'rgba(58,179,173,0.12)',
    patinaBorde: 'rgba(58,179,173,0.48)',
    errorTinte: 'rgba(194,82,55,0.16)',
    errorBorde: 'rgba(194,82,55,0.52)',
    errorTinteFuerte: 'rgba(194,82,55,0.22)',
    exitoTinte: 'rgba(98,187,120,0.15)',
    radioBorde: 'rgba(200,190,181,0.50)',

    /* Aliases semánticos y esqueleto */
    fondo: '#12100E',
    superficie: '#1E1A17',
    superficieSecundaria: '#26211B',
    primario: '#FFBA00',
    primarioTexto: '#0B0903',
    secundario: '#0EB6AC',
    textoPrincipal: '#F8F4F0',
    textoSecundario: '#C8BEB5',
    borde: 'rgba(200,190,181,0.18)',
    esqueletoBase: '#26211B',
    esqueletoBrillo: '#342D25',
    overlay: 'rgba(8,7,5,0.78)',
  },
};

export function obtenerTokensTema(modo = 'claro') {
  const tema = COLORES_SEMANTICOS[modo] ? modo : 'claro';

  return {
    modo: tema,
    colores: COLORES_SEMANTICOS[tema],
    tipografia: ESCALA_TIPOGRAFICA,
    espaciado: ESPACIADO,
    radios: RADIOS,
    areaTactilMin: AREA_TACTIL_MIN,
    fuentes: FUENTES,
    sombras: crearSombras(tema),
  };
}
