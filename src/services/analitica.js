/* =========================================================
   SERVICIO DE ANALÍTICA Y CONSENTIMIENTO DE COOKIES
   - Ligero, local y extensible mediante `configurarTransporteAnalitica`.
   - Respeta estrictamente el consentimiento: no registra eventos
     analíticos si el usuario no aceptó cookies analíticas.
   - Guarda la preferencia de cookies en `localStorage` en web y
     en memoria de sesión en dispositivos nativos.
========================================================= */

const CLAVE_CONSENTIMIENTO = 'la_t_preferencias_cookies_v1';
const CLAVE_EVENTOS = 'la_t_eventos_analitica_v1';
const MAX_EVENTOS = 100;

export const EVENTOS_ANALITICA = {
  VISTA_PANTALLA: 'vista_pantalla',
  BUSQUEDA_PRODUCTO: 'busqueda_producto',
  VER_ZOOM_PRODUCTO: 'ver_zoom_producto',
  AGREGAR_CARRITO: 'agregar_carrito',
  AGITA_Y_GANA: 'agita_y_gana',
  CONSULTA_IA: 'consulta_ia',
  COMPLETAR_PEDIDO: 'completar_pedido',
  CLIC_RED_SOCIAL: 'clic_red_social',
};

const CONSENTIMIENTO_INICIAL = {
  esenciales: true,
  analiticas: false,
  decidido: false,
  actualizadoEn: null,
};

let consentimientoMemoria = null;
let eventosMemoria = [];
let transporteExterno = null;
const suscriptores = new Set();

function obtenerAlmacenWeb() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch (error) {
    return null;
  }
  return null;
}

export function obtenerConsentimientoCookies() {
  if (consentimientoMemoria) {
    return { ...consentimientoMemoria };
  }

  const almacen = obtenerAlmacenWeb();
  if (almacen) {
    try {
      const crudo = almacen.getItem(CLAVE_CONSENTIMIENTO);
      if (crudo) {
        const parsed = JSON.parse(crudo);
        if (parsed && typeof parsed === 'object') {
          consentimientoMemoria = {
            esenciales: true,
            analiticas: Boolean(parsed.analiticas),
            decidido: Boolean(parsed.decidido),
            actualizadoEn: parsed.actualizadoEn || null,
          };
          return { ...consentimientoMemoria };
        }
      }
    } catch (error) {
      /* Si el JSON guardado falla, se solicita de nuevo el consentimiento. */
    }
  }

  return { ...CONSENTIMIENTO_INICIAL };
}

export function guardarConsentimientoCookies({ analiticas = false } = {}) {
  const nuevo = {
    esenciales: true,
    analiticas: Boolean(analiticas),
    decidido: true,
    actualizadoEn: new Date().toISOString(),
  };

  consentimientoMemoria = nuevo;

  const almacen = obtenerAlmacenWeb();
  if (almacen) {
    try {
      almacen.setItem(CLAVE_CONSENTIMIENTO, JSON.stringify(nuevo));
      if (!nuevo.analiticas) {
        almacen.removeItem(CLAVE_EVENTOS);
      }
    } catch (error) {
      /* Ignora cuotas o bloqueo de almacenamiento en modo privado. */
    }
  }

  if (!nuevo.analiticas) {
    eventosMemoria = [];
  }

  suscriptores.forEach((cb) => {
    try {
      cb({ ...nuevo });
    } catch (error) {
      /* Evita que un suscriptor interrumpa a los demás. */
    }
  });

  return { ...nuevo };
}

export function suscribirConsentimiento(callback) {
  if (typeof callback !== 'function') return () => {};
  suscriptores.add(callback);
  return () => suscriptores.delete(callback);
}

export function tieneConsentimientoAnalitico() {
  const actual = obtenerConsentimientoCookies();
  return Boolean(actual.decidido && actual.analiticas);
}

export function configurarTransporteAnalitica(fn) {
  transporteExterno = typeof fn === 'function' ? fn : null;
}

export function registrarEvento(nombre, payload = {}) {
  if (!nombre || !tieneConsentimientoAnalitico()) {
    return { registrado: false, motivo: 'sin_consentimiento' };
  }

  const evento = {
    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    nombre: String(nombre),
    payload: payload && typeof payload === 'object' ? { ...payload } : {},
    fecha: new Date().toISOString(),
  };

  eventosMemoria = [evento, ...eventosMemoria].slice(0, MAX_EVENTOS);

  const almacen = obtenerAlmacenWeb();
  if (almacen) {
    try {
      almacen.setItem(CLAVE_EVENTOS, JSON.stringify(eventosMemoria));
    } catch (error) {
      /* Ignora errores de escritura en almacenamiento web. */
    }
  }

  if (transporteExterno) {
    try {
      transporteExterno(evento);
    } catch (error) {
      /* El transporte externo nunca debe romper la experiencia de compra. */
    }
  }

  return { registrado: true, evento };
}

export function obtenerEventosRegistrados() {
  if (eventosMemoria.length > 0) {
    return [...eventosMemoria];
  }

  const almacen = obtenerAlmacenWeb();
  if (almacen) {
    try {
      const crudo = almacen.getItem(CLAVE_EVENTOS);
      if (crudo) {
        const lista = JSON.parse(crudo);
        if (Array.isArray(lista)) {
          eventosMemoria = lista.slice(0, MAX_EVENTOS);
          return [...eventosMemoria];
        }
      }
    } catch (error) {
      return [];
    }
  }

  return [];
}

export function limpiarEventosAnalitica() {
  eventosMemoria = [];
  const almacen = obtenerAlmacenWeb();
  if (almacen) {
    try {
      almacen.removeItem(CLAVE_EVENTOS);
    } catch (error) {
      /* Sin efecto si el almacenamiento no está disponible. */
    }
  }
}
