# La Pastelería La T 🍰

Aplicación móvil y web (**Expo + React Native + React Native Web / PWA**) para **La Pastelería La T**. Incluye catálogo comercial de **14 productos reales**, portada panorámica con carrusel de destacados, buscador con filtros avanzados, visor de producto con zoom libre (`1x–4x`), carrito de compras, checkout, historial de pedidos locales, el juego **«Agita y gana»** con acelerómetro real, un **Asistente IA local** (clasificador `1-NN`), sistema de temas **Claro / Oscuro** accesible (WCAG AA) y módulo legal con consentimiento de cookies.

---

## 1. Funcionalidades principales

### Identidad, arranque y PWA
- **Splash animado ([`PantallaSplash.jsx`](src/components/tienda/PantallaSplash.jsx)):** construido exclusivamente con `Animated` nativo de React Native mostrando el logotipo oficial (`assets/logo-la-t.png`, paleta crema `#FDF4D8` y café `#6B3A1E`) sin interfaz intermedia antes de abrir la tienda.
- **Emblema de marca ([`LogoMarca.jsx`](src/components/tienda/LogoMarca.jsx)):** logotipo circular reutilizable en splash, encabezado, portada, asistente y pie de página.
- **Configuración nativa y PWA ([`app.json`](app.json), [`public/manifest.json`](public/manifest.json), [`public/index.html`](public/index.html)):** íconos, favicon y metadatos configurados con `logo-la-t.png` para Expo Go (Android / iOS) y Web instalable.

### Tienda, portada y buscador con filtros
- **Portada panorámica ([`BannerPortada.jsx`](src/components/tienda/BannerPortada.jsx)):** tarjeta de dos zonas (adaptable a celular, tablet y escritorio) con accesos a «Agita y gana» y carrusel horizontal deslizable cada 4 s con productos destacados de [`catalogo.js`](src/data/catalogo.js).
- **Catálogo de 14 productos ([`catalogo.js`](src/data/catalogo.js)):** tortas, cheesecakes, cupcakes, brownies, galletas, postres y bebidas con precios en pesos colombianos (COP), existencias y etiquetas.
- **Buscador con filtro avanzado ([`PantallaTienda.jsx`](src/screens/tienda/PantallaTienda.jsx)):**
  - Búsqueda de texto normalizada sin tildes y multipalabra (`normalizarTexto`) sobre nombre, descripción, categoría y etiqueta.
  - Panel desplegable de **Filtros**: rango de precio (*Cualquier precio*, *Hasta $10.000*, *$10.000 – $55.000*, *Más de $55.000*), ordenamiento (*Destacados*, *Menor precio*, *Mayor precio*, *Nombre A–Z*), *Solo disponibles* y *Destacados / Nuevos*.
  - Chips por categoría, resumen removible de filtros activos y **skeleton loader** ([`EsqueletoCatalogo.jsx`](src/components/tienda/EsqueletoCatalogo.jsx)) durante cambios de filtro o búsqueda.
- **Visor de producto con zoom libre ([`ModalProducto.jsx`](src/components/tienda/ModalProducto.jsx)):** acercamiento continuo de `1x` a `4x` mediante pellizco con dos dedos en móvil (`PanResponder`), rueda del ratón / trackpad en web, desplazamiento de la imagen ampliada y doble toque / doble clic para restablecer.

### Asistente IA local ([`AsistenteIA.jsx`](src/screens/AsistenteIA.jsx))
- Clasificador **1-NN** (`src/logic/modeloIA.js`) **100 % local** mediante similitud de coseno (`UMBRAL_CONFIANZA = 0.35`, `UMBRAL_DIFERENCIA = 0.1`), sin envío de datos ni APIs externas.
- Responde sobre los **14 productos** del catálogo real en tres intenciones (**precio**, **nombre** y **descripción**) e incluye desambiguación manual (`Ver Nombre`, `Ver Precio`, `Ver Descripción`) ante preguntas ambiguas.
- Accesible en modal desde el botón flotante ([`BotonAsistenteFlotante.jsx`](src/components/tienda/BotonAsistenteFlotante.jsx)) o desde cualquier tarjeta/detalle de producto.

### Carrito, Checkout y Pedidos
- **Carrito ([`PantallaCarrito.jsx`](src/screens/tienda/PantallaCarrito.jsx)):** ajuste de cantidades dentro del stock, eliminación de productos, cálculo de subtotales/descuentos y opción de retirar o restaurar el cupón mientras siga vigente.
- **Checkout y confirmación ([`PantallaCheckout.jsx`](src/screens/tienda/PantallaCheckout.jsx), [`PantallaConfirmacion.jsx`](src/screens/tienda/PantallaConfirmacion.jsx)):** recogida en tienda (sin costo) o domicilio (`$6.000`, gratis desde `$80.000`), validación en pantalla, generación de identificador `LT-DDMM-0001` en [`pedidos.js`](src/services/pedidos.js) y registro en **Pedidos** ([`PantallaPedidos.jsx`](src/screens/tienda/PantallaPedidos.jsx)).
  > **Nota:** Los pedidos se registran de forma local en la sesión actual; `src/services/pedidos.js` deja preparada la estructura para conectar un backend real.

### Juego «Agita y gana» ([`PantallaAgitaYGana.jsx`](src/screens/tienda/PantallaAgitaYGana.jsx))
- Usa el acelerómetro real mediante `Accelerometer` de `expo-sensors` en Android/iOS y `devicemotion` en navegadores web ([`useAgitar.js`](src/hooks/useAgitar.js), [`sacudida.js`](src/logic/sacudida.js)).
- Umbrales configurables en [`promociones.js`](src/data/promociones.js): *Suave* (`1.8 g`), *Normal* (`2.2 g`), *Fuerte* (`2.8 g`), enfriamiento de `2500 ms` y espera de `8 s` entre intentos.
- Premios no acumulables de **5 %** (sin mínimo), **10 %** (desde `$40.000`) y **15 %** (desde `$80.000`), con vigencia de `15` minutos, bloqueo de nuevos giros mientras el cupón siga activo y limpieza automática de la suscripción del sensor al salir o pausar.

### Sistema de diseño, accesibilidad, legal y analítica
- **Temas Claro / Oscuro y WCAG AA ([`tokens.js`](src/theme/tokens.js), [`TemaContexto.jsx`](src/theme/TemaContexto.jsx), [`estilosTienda.js`](src/estilosTienda.js)):** escala tipográfica, espaciados, sombras, contraste `>= 4.5:1` y áreas táctiles mínimas de `44 px` (`AREA_TACTIL_MIN`).
- **Módulo legal y cookies ([`ModalLegal.jsx`](src/components/tienda/ModalLegal.jsx), [`BannerCookies.jsx`](src/components/tienda/BannerCookies.jsx), [`FooterTienda.jsx`](src/components/tienda/FooterTienda.jsx)):** Política de Privacidad, Términos y Condiciones, Política de Cookies, Política de Reembolso y Devoluciones, configuración granular de consentimiento (`localStorage` en web / memoria en nativo) y enlaces sociales oficiales.
- **Analítica local ([`analitica.js`](src/services/analitica.js)):** registra eventos de navegación, búsquedas, filtros, zoom, carrito, «Agita y gana», consultas IA y pedidos **únicamente** cuando el usuario autoriza cookies analíticas.

---

## 2. Requisitos e instalación

Requisitos: **Node.js 20+** y **Expo Go** en Android/iOS (o navegador web).

```bash
npm install
```

Dependencias principales (`package.json`):

```json
"expo": "~58.0.26",
"react": "19.3.0",
"react-dom": "19.3.0",
"react-native": "0.88.1",
"react-native-web": "^0.21.2",
"expo-sensors": "~58.0.5",
"expo-camera": "~58.0.14",
"expo-media-library": "~58.0.14",
"expo-screen-orientation": "~58.0.4",
"expo-status-bar": "~58.0.5"
```

---

## 3. Ejecución y exportación

```bash
npx expo start -c        # Inicia Metro limpiando caché (QR para Expo Go)
npx expo start --android # Abre en emulador o dispositivo Android
npx expo start --ios     # Abre en simulador iOS
npx expo start --web     # Inicia la versión web / PWA
```

Para exportar compilaciones estáticas:

```bash
npx expo export -p web -c
npx expo export -p android -c
```

---

## 4. Estructura del proyecto

```text
App.js                                 Orquestación general, splash, vistas, carrito, cupones y modales
app.json                               Configuración de Expo, íconos, splash y PWA
index.js                               Punto de entrada (registerRootComponent)
assets/
  logo-la-t.png                        Logotipo oficial de La Pastelería La T
  productos/                           Fotografías del catálogo y CREDITOS.md
public/
  index.html                           Plantilla HTML web con enlaces PWA
  manifest.json                        Manifiesto Web App (PWA)
  logo-la-t.png                        Copia pública del logotipo para web/PWA
src/
  estilosTienda.js                     Hoja de estilos temática basada en tokens
  data/
    catalogo.js                        14 productos, categorías, rangos, ordenamientos y filtros puros
    promociones.js                     Reglas, premios, vigencia y umbrales de «Agita y gana»
  hooks/
    useAcelerometro.js                 Suscripción base al acelerómetro
    useAgitar.js                       Detector de sacudidas (nativo y devicemotion en web)
    useDispositivo.js                  Breakpoints adaptativos (600 / 900 px)
  logic/
    carrito.js                         Cálculo de carrito, subtotales, envíos y totales
    formato.js                         Formato de moneda COP y fechas
    modeloIA.js                        Clasificador local 1-NN por similitud de coseno
    promociones.js                     Validación de vigencia y premios por sacudida
    sacudida.js                        Lógica pura de detección de picos en g
  services/
    analitica.js                       Consentimiento de cookies y registro local de eventos
    pedidos.js                         Creación local de pedidos (LT-DDMM-0001)
  theme/
    tokens.js                          Tokens tipográficos, radios, sombras y paletas WCAG AA
    TemaContexto.jsx                   Proveedor de tema Claro / Oscuro (`useTema`)
  components/tienda/
    AvisoFlotante.jsx                  Notificaciones breves de estado
    BannerCookies.jsx                  Banner de consentimiento de cookies
    BannerPortada.jsx                  Portada panorámica y carrusel de destacados
    BarraTienda.jsx                    Barra inferior de navegación
    BotonAsistenteFlotante.jsx         Acceso flotante al Asistente IA
    EncabezadoTienda.jsx               Encabezado con logo, cambio de tema y carrito
    EsqueletoCatalogo.jsx              Skeleton loader al filtrar o buscar
    FooterTienda.jsx                   Redes sociales y enlaces legales
    LogoMarca.jsx                      Logotipo circular reutilizable
    ModalLegal.jsx                     Centro legal y preferencias de cookies
    ModalProducto.jsx                  Detalle de producto con zoom táctil/web (1x–4x)
    PantallaSplash.jsx                 Splash animado inicial
    ResumenPrecios.jsx                 Desglose de subtotal, descuento, envío y total
    SelectorCantidad.jsx               Controles + / − de unidades
    TarjetaProducto.jsx                Tarjeta de producto del catálogo
  screens/
    AsistenteIA.jsx                    Asistente IA local sobre el catálogo
    tienda/
      PantallaTienda.jsx               Catálogo, buscador, filtros avanzados y portada
      PantallaCarrito.jsx              Gestión del carrito y cupones
      PantallaCheckout.jsx             Formulario de entrega y método de pago
      PantallaConfirmacion.jsx         Comprobante local de pedido confirmado
      PantallaAgitaYGana.jsx           Juego con acelerómetro y vigencias
      PantallaPedidos.jsx              Historial de pedidos de la sesión
```

---

## 5. Créditos de imágenes

Las fotografías de los productos provienen de Wikimedia Commons y están documentadas, con su licencia y autoría, en [`assets/productos/CREDITOS.md`](assets/productos/CREDITOS.md).
