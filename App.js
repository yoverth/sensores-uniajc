import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

/* ---------- TIENDA ---------- */
import EncabezadoTienda from './src/components/tienda/EncabezadoTienda';
import BarraTienda from './src/components/tienda/BarraTienda';
import AvisoFlotante from './src/components/tienda/AvisoFlotante';
import BotonAsistenteFlotante from './src/components/tienda/BotonAsistenteFlotante';
import PantallaSplash from './src/components/tienda/PantallaSplash';
import BannerCookies from './src/components/tienda/BannerCookies';
import ModalLegal from './src/components/tienda/ModalLegal';
import PantallaTienda from './src/screens/tienda/PantallaTienda';
import PantallaCarrito from './src/screens/tienda/PantallaCarrito';
import PantallaCheckout from './src/screens/tienda/PantallaCheckout';
import PantallaConfirmacion from './src/screens/tienda/PantallaConfirmacion';
import PantallaAgitaYGana from './src/screens/tienda/PantallaAgitaYGana';
import PantallaPedidos from './src/screens/tienda/PantallaPedidos';
import AsistenteIA from './src/screens/AsistenteIA';

/* ---------- DATOS ---------- */
import { PRODUCTOS } from './src/data/catalogo';

/* ---------- LÓGICA ---------- */
import {
  agregarAlCarrito,
  calcularResumen,
  cambiarCantidad,
  contarUnidades,
  eliminarDelCarrito,
} from './src/logic/carrito';
import { crearPedido } from './src/services/pedidos';
import {
  EVENTOS_ANALITICA,
  guardarConsentimientoCookies,
  obtenerConsentimientoCookies,
  registrarEvento,
  suscribirConsentimiento,
} from './src/services/analitica';
import { promocionVigente } from './src/logic/promociones';

/* ---------- TEMA ---------- */
import { TemaProvider, useTema } from './src/theme/TemaContexto';

/* =========================================================
   APP · PASTELERÍA LA T
   Experiencia comercial completa: catálogo, carrito,
   checkout, pedidos, «Agita y gana» y Asistente IA local.
   El carrito y los cupones viven aquí para conservarse al
   cambiar de pantalla.
========================================================= */

const VISTAS_CON_ASISTENTE = [
  'inicio',
  'buscar',
  'carrito',
  'agita',
  'pedidos',
];

export default function App() {
  return (
    <TemaProvider modoInicial="claro">
      <AppTienda />
    </TemaProvider>
  );
}

function AppTienda() {
  const { modo, estilos } = useTema();

  const [vista, setVista] = useState('inicio');

  const [carrito, setCarrito] = useState([]);
  const [promocion, setPromocion] = useState(null);
  /* Cupón retirado del carrito: se conserva para poder restaurarlo
     sin volver a jugar, hasta que venza o se use en un pedido. */
  const [promocionRetirada, setPromocionRetirada] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);
  const [confirmando, setConfirmando] = useState(false);

  const [asistenteVisible, setAsistenteVisible] = useState(false);
  const [productoIA, setProductoIA] = useState(null);
  const [mostrandoSplash, setMostrandoSplash] = useState(true);
  const [consentimiento, setConsentimiento] = useState(() =>
    obtenerConsentimientoCookies()
  );
  const [legalVisible, setLegalVisible] = useState(false);
  const [documentoLegal, setDocumentoLegal] = useState('privacidad');

  const [aviso, setAviso] = useState(null);
  const temporizador = useRef(null);

  useEffect(() => {
    const desuscribir = suscribirConsentimiento(setConsentimiento);
    return () => {
      desuscribir();
      if (temporizador.current) clearTimeout(temporizador.current);
    };
  }, []);

  useEffect(() => {
    if (consentimiento.decidido && consentimiento.analiticas) {
      registrarEvento(EVENTOS_ANALITICA.VISTA_PANTALLA, { vista });
    }
  }, [vista, consentimiento.decidido, consentimiento.analiticas]);

  const mostrarAviso = useCallback((texto, tipo = 'ok') => {
    if (temporizador.current) clearTimeout(temporizador.current);

    setAviso({ texto, tipo });
    temporizador.current = setTimeout(() => setAviso(null), 3000);
  }, []);

  const unidades = contarUnidades(carrito);

  /* ---------------- ASISTENTE IA ---------------- */

  function abrirAsistente(producto = null) {
    setProductoIA(producto ? producto.id : null);
    setAsistenteVisible(true);
  }

  function cerrarAsistente() {
    setAsistenteVisible(false);
  }

  function abrirLegal(documento = 'privacidad') {
    setDocumentoLegal(documento);
    setLegalVisible(true);
  }

  function actualizarPreferenciasCookies(preferencia) {
    const guardado = guardarConsentimientoCookies(preferencia);
    setConsentimiento(guardado);
  }

  /* ---------------- CARRITO ---------------- */

  function agregar(producto, irAlCarrito = false) {
    const resultado = agregarAlCarrito(carrito, producto, 1);

    if (resultado.error) {
      mostrarAviso(resultado.error, 'error');
      return;
    }

    setCarrito(resultado.items);

    registrarEvento(EVENTOS_ANALITICA.AGREGAR_CARRITO, {
      productoId: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
      origen: irAlCarrito ? 'comprar_ahora' : 'agregar',
    });

    if (irAlCarrito) {
      setVista('carrito');
    } else {
      mostrarAviso(`${producto.nombre} agregado al carrito`);
    }
  }

  function comprarAhora(producto) {
    agregar(producto, true);
  }

  function cambiar(productoId, delta) {
    setCarrito((actual) => cambiarCantidad(actual, productoId, delta));
  }

  function eliminar(productoId) {
    setCarrito((actual) => eliminarDelCarrito(actual, productoId));
    mostrarAviso('Producto eliminado del carrito');
  }

  /* Quitar el cupón no lo borra: queda guardado para restaurarlo
     desde el carrito mientras siga vigente. */
  function quitarPromocion() {
    if (promocion) {
      setPromocionRetirada(promocion);
    }

    setPromocion(null);
    mostrarAviso('Cupón retirado · puedes restaurarlo desde tu carrito');
  }

  function restaurarPromocion() {
    if (!promocionRetirada) return;

    if (!promocionVigente(promocionRetirada)) {
      mostrarAviso(
        'El cupón venció. Agita de nuevo para conseguir otro.',
        'error'
      );
      return;
    }

    setPromocion(promocionRetirada);
    setPromocionRetirada(null);
    mostrarAviso(
      `Cupón del ${promocionRetirada.porcentaje}% restaurado en tu carrito`
    );
  }

  /* El cupón se guarda apenas se gana. Si el carrito todavía no llega
     al mínimo, queda pendiente y se activa solo al alcanzarlo. */
  function registrarCupon(cupon) {
    setPromocion(cupon);
    setPromocionRetirada(null);
    mostrarAviso(`Cupón del ${cupon.porcentaje}% guardado · revisa tu carrito`);
  }

  /* ---------------- PEDIDO ---------------- */

  async function confirmarPedido(datos) {
    if (carrito.length === 0) {
      mostrarAviso('El carrito está vacío.', 'error');
      return null;
    }

    setConfirmando(true);

    try {
      /* Se recalcula aquí (no se confía en lo que envía la pantalla),
         igual que haría el backend. */
      const resumen = calcularResumen(carrito, promocion, datos.tipoEntrega);
      const pedido = await crearPedido({
        items: carrito,
        resumen,
        datos,
        promocion,
      });

      setPedidos((actual) => [pedido, ...actual]);
      setPedidoConfirmado(pedido);
      setCarrito([]);

      registrarEvento(EVENTOS_ANALITICA.COMPLETAR_PEDIDO, {
        pedidoId: pedido.id,
        total: pedido.resumen.total,
        unidades: resumen.unidades,
        tipoEntrega: datos.tipoEntrega,
        pago: datos.pago,
        conCupon: Boolean(resumen.promoAplicada),
      });

      if (resumen.promoAplicada) {
        /* El cupón se gastó en este pedido: «Agita y gana» se libera. */
        setPromocion(null);
        setPromocionRetirada(null);
      } else if (promocion) {
        /* No se usó (faltó el mínimo): queda guardado por si lo restaura. */
        setPromocionRetirada(promocion);
        setPromocion(null);
      }

      setVista('confirmacion');

      return pedido;
    } catch (error) {
      mostrarAviso('No se pudo registrar el pedido. Intenta de nuevo.', 'error');
      return null;
    } finally {
      setConfirmando(false);
    }
  }

  /* ---------------- RENDER ---------------- */

  if (mostrandoSplash) {
    return (
      <View style={estilos.app}>
        <StatusBar style="dark" />
        <PantallaSplash alTerminar={() => setMostrandoSplash(false)} />
      </View>
    );
  }

  const mostrarAsistente = VISTAS_CON_ASISTENTE.includes(vista);

  return (
    <View style={estilos.app}>
      <StatusBar style={modo === 'claro' ? 'dark' : 'light'} />

      <EncabezadoTienda
        cantidadCarrito={unidades}
        onAbrirCarrito={() => setVista('carrito')}
      />

      <View style={{ flex: 1 }}>
        {vista === 'inicio' && (
          <PantallaTienda
            modo="inicio"
            promocion={promocion}
            onAgregar={agregar}
            onComprarAhora={comprarAhora}
            onAbrirAgita={() => setVista('agita')}
            onAbrirCarrito={() => setVista('carrito')}
            onAbrirAsistente={abrirAsistente}
            onAbrirLegal={abrirLegal}
            onMostrarError={(texto) => mostrarAviso(texto, 'error')}
          />
        )}

        {vista === 'buscar' && (
          <PantallaTienda
            modo="buscar"
            promocion={promocion}
            onAgregar={agregar}
            onComprarAhora={comprarAhora}
            onAbrirAgita={() => setVista('agita')}
            onAbrirCarrito={() => setVista('carrito')}
            onAbrirAsistente={abrirAsistente}
            onAbrirLegal={abrirLegal}
            onMostrarError={(texto) => mostrarAviso(texto, 'error')}
          />
        )}

        {vista === 'carrito' && (
          <PantallaCarrito
            carrito={carrito}
            promocion={promocion}
            promocionRetirada={promocionRetirada}
            onCambiarCantidad={cambiar}
            onEliminar={eliminar}
            onQuitarPromocion={quitarPromocion}
            onRestaurarPromocion={restaurarPromocion}
            onAbrirAgita={() => setVista('agita')}
            onIrCheckout={() => setVista('checkout')}
            onIrTienda={() => setVista('inicio')}
          />
        )}

        {vista === 'checkout' && (
          <PantallaCheckout
            carrito={carrito}
            promocion={promocion}
            confirmando={confirmando}
            onConfirmar={confirmarPedido}
            onVolverCarrito={() => setVista('carrito')}
          />
        )}

        {vista === 'confirmacion' && (
          <PantallaConfirmacion
            pedido={pedidoConfirmado}
            onSeguirComprando={() => setVista('inicio')}
            onVerPedidos={() => setVista('pedidos')}
          />
        )}

        {vista === 'agita' && (
          <PantallaAgitaYGana
            carrito={carrito}
            promocion={promocion}
            promocionRetirada={promocionRetirada}
            pausado={asistenteVisible}
            onGanarPromocion={registrarCupon}
            onIrCarrito={() => setVista('carrito')}
            onIrTienda={() => setVista('inicio')}
          />
        )}

        {vista === 'pedidos' && (
          <PantallaPedidos
            pedidos={pedidos}
            onIrTienda={() => setVista('inicio')}
          />
        )}
      </View>

      <BarraTienda
        vista={vista}
        cantidadCarrito={unidades}
        onNavegar={setVista}
      />

      {mostrarAsistente && (
        <BotonAsistenteFlotante onPress={() => abrirAsistente()} />
      )}

      {aviso && <AvisoFlotante aviso={aviso} />}

      <BannerCookies
        visible={!mostrandoSplash && !consentimiento.decidido}
        onAceptarTodas={() => {
          actualizarPreferenciasCookies({ analiticas: true });
          mostrarAviso('Preferencias guardadas: cookies analíticas activadas');
        }}
        onSoloEsenciales={() => {
          actualizarPreferenciasCookies({ analiticas: false });
          mostrarAviso('Preferencias guardadas: solo cookies esenciales');
        }}
        onConfigurar={() => abrirLegal('preferencias')}
      />

      <Modal
        visible={asistenteVisible}
        animationType="slide"
        onRequestClose={cerrarAsistente}
      >
        <AsistenteIA
          productos={PRODUCTOS}
          productoInicialId={productoIA}
          onSalir={cerrarAsistente}
        />
      </Modal>

      <ModalLegal
        visible={legalVisible}
        documentoInicial={documentoLegal}
        consentimiento={consentimiento}
        onGuardarCookies={actualizarPreferenciasCookies}
        onCerrar={() => setLegalVisible(false)}
      />
    </View>
  );
}
