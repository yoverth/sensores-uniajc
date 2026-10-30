import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

/* ---------- TIENDA ---------- */
import EncabezadoTienda from './src/components/tienda/EncabezadoTienda';
import BarraTienda from './src/components/tienda/BarraTienda';
import AvisoFlotante from './src/components/tienda/AvisoFlotante';
import PantallaTienda from './src/screens/tienda/PantallaTienda';
import PantallaCarrito from './src/screens/tienda/PantallaCarrito';
import PantallaCheckout from './src/screens/tienda/PantallaCheckout';
import PantallaConfirmacion from './src/screens/tienda/PantallaConfirmacion';
import PantallaAgitaYGana from './src/screens/tienda/PantallaAgitaYGana';
import PantallaPedidos from './src/screens/tienda/PantallaPedidos';

/* ---------- LABORATORIO (se conserva) ---------- */
import PantallaOriginal from './src/screens/PantallaOriginal';
import PantallaOptimizada from './src/screens/PantallaOptimizada';
import PantallaAdaptativa from './src/screens/PantallaAdaptativa';
import PantallaSensores from './src/screens/PantallaSensores';
import PantallaTareas from './src/screens/PantallaTareas';

/* ---------- LÓGICA ---------- */
import {
  agregarAlCarrito,
  calcularResumen,
  cambiarCantidad,
  contarUnidades,
  eliminarDelCarrito,
} from './src/logic/carrito';
import { crearPedido } from './src/services/pedidos';

/* ---------- ESTILOS ---------- */
import estilosTienda from './src/estilosTienda';
import styles from './src/styles';

/* =========================================================
   APP · PASTELERÍA LA T

   `seccion` separa la experiencia comercial (tienda) de las
   herramientas académicas (laboratorio). El carrito vive aquí,
   así que se conserva al cambiar de pantalla o de sección.
========================================================= */

export default function App() {
  const [seccion, setSeccion] = useState('tienda');
  const [vista, setVista] = useState('inicio');
  const [pestanaLab, setPestanaLab] = useState('original');

  const [carrito, setCarrito] = useState([]);
  const [promocion, setPromocion] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);
  const [confirmando, setConfirmando] = useState(false);

  const [aviso, setAviso] = useState(null);
  const temporizador = useRef(null);

  useEffect(() => {
    return () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    };
  }, []);

  const mostrarAviso = useCallback((texto, tipo = 'ok') => {
    if (temporizador.current) clearTimeout(temporizador.current);

    setAviso({ texto, tipo });
    temporizador.current = setTimeout(() => setAviso(null), 3000);
  }, []);

  const unidades = contarUnidades(carrito);

  /* ---------------- CARRITO ---------------- */

  function agregar(producto, irAlCarrito = false) {
    const resultado = agregarAlCarrito(carrito, producto, 1);

    if (resultado.error) {
      mostrarAviso(resultado.error, 'error');
      return;
    }

    setCarrito(resultado.items);

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

  function quitarPromocion() {
    setPromocion(null);
    mostrarAviso('Cupón retirado del carrito');
  }

  /* El cupón se guarda apenas se gana. Si el carrito todavía no llega
     al mínimo, queda pendiente y se activa solo al alcanzarlo. */
  function registrarCupon(cupon) {
    setPromocion(cupon);
    mostrarAviso(
      `Cupón del ${cupon.porcentaje}% guardado · revisa tu carrito`
    );
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
      setPromocion(null);
      setVista('confirmacion');

      return pedido;
    } catch (error) {
      mostrarAviso('No se pudo registrar el pedido. Intenta de nuevo.', 'error');
      return null;
    } finally {
      setConfirmando(false);
    }
  }

  /* ---------------- LABORATORIO ---------------- */

  const propsLaboratorio = {
    pestana: pestanaLab,
    setPestana: setPestanaLab,
    onSalir: () => setSeccion('tienda'),
  };

  function renderLaboratorio() {
    if (pestanaLab === 'original') {
      return <PantallaOriginal {...propsLaboratorio} />;
    }

    if (pestanaLab === 'optimizada') {
      return <PantallaOptimizada {...propsLaboratorio} />;
    }

    if (pestanaLab === 'adaptativa') {
      return <PantallaAdaptativa {...propsLaboratorio} />;
    }

    if (pestanaLab === 'sensores') {
      return <PantallaSensores {...propsLaboratorio} />;
    }

    return <PantallaTareas {...propsLaboratorio} />;
  }

  /* ---------------- RENDER ---------------- */

  const enTienda = seccion === 'tienda';

  return (
    <View style={enTienda ? estilosTienda.app : styles.app}>
      <StatusBar style={enTienda ? 'dark' : 'light'} />

      {!enTienda && renderLaboratorio()}

      {enTienda && (
        <>
          <EncabezadoTienda
            cantidadCarrito={unidades}
            onAbrirCarrito={() => setVista('carrito')}
            onAbrirLaboratorio={() => setSeccion('laboratorio')}
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
                onAbrirLaboratorio={() => setSeccion('laboratorio')}
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
                onAbrirLaboratorio={() => setSeccion('laboratorio')}
              />
            )}

            {vista === 'carrito' && (
              <PantallaCarrito
                carrito={carrito}
                promocion={promocion}
                onCambiarCantidad={cambiar}
                onEliminar={eliminar}
                onQuitarPromocion={quitarPromocion}
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

          {aviso && <AvisoFlotante aviso={aviso} />}
        </>
      )}
    </View>
  );
}
