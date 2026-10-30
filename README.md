# Pastelería La T 🍰

Tienda móvil de pastelería hecha con **Expo + React Native** (Android, iOS y web).
Incluye catálogo, carrito, checkout y el juego **«Agita y gana»**, que usa el
**acelerómetro real** del teléfono para desbloquear descuentos.

El antiguo laboratorio académico de sensores y rendimiento se conserva, pero ya
no es la pantalla inicial: vive dentro de **Herramientas internas**.

---

## 1. Qué incluye

### Tienda (pantalla inicial)
- Portada con marca «La T», buscador, categorías y promociones.
- Catálogo de **14 productos reales** de pastelería (tortas, cheesecakes,
  cupcakes, brownies, galletas, postres y bebidas) con precio en COP,
  descripción, imagen y disponibilidad.
- Cada tarjeta tiene **Agregar al carrito** y **Comprar ahora**.
- Los 120 productos de demostración del laboratorio **no** aparecen aquí.

### Carrito
- Aumentar/disminuir cantidades (sin pasar de 1 ni del stock), eliminar ítems.
- Precio unitario, subtotal por ítem, subtotal general, descuento y total.
- Mensaje cuando está vacío y estado conservado al cambiar de pantalla
  (el carrito vive en `App.js`).

### Checkout
- Resumen de productos, cantidades, subtotal, descuento y total.
- **Recoger en tienda** (sin costo) o **domicilio** ($6.000, gratis desde
  $80.000 sobre el valor después del descuento).
- Datos del cliente con validación en pantalla (sin `Alert` bloqueante).
- Métodos de pago implementados en el flujo local:
  - Efectivo contra entrega.
  - Transferencia bancaria (coordinación manual).
  - Tarjeta en línea: visible pero **deshabilitada** (no se simula el pago).
- Confirmación con identificador de pedido (`LT-AAAAMMDD-0001`) y listado en
  **Pedidos**.

> **Demostración local:** los pedidos se guardan solo en memoria de la sesión.
> No se envían a la tienda ni se procesa ningún pago real. `src/services/pedidos.js`
> ya tiene la forma de una llamada a API para conectar un backend después.

### Agita y gana
- Usa `Accelerometer` de `expo-sensors` en Android/iOS y el evento
  `devicemotion` del navegador en web (el acelerómetro de `expo-sensors` en web
  entrega orientación, no aceleración).
- Detecta sacudidas con lecturas reales: umbral configurable (Suave 1.8 g,
  Normal 2.2 g, Fuerte 2.8 g), 2 muestras consecutivas por encima del umbral y
  enfriamiento de 2,5 s para ignorar vibraciones pequeñas.
- Premios: **5%** sin mínimo, **10%** desde $40.000 y **15%** desde $80.000.
  Cuanto más fuerte la sacudida, mejor probabilidad dentro de la regla alcanzada.
- Vigencia de 15 minutos, **1 uso**, **no acumulables**: un cupón nuevo
  reemplaza al anterior.
- Espera de 8 segundos entre intentos, con cuenta regresiva visible.
- Maneja permisos, errores y dispositivos sin sensor.
- El cupón se guarda al ganarlo: si el carrito aún no llega al mínimo queda
  **pendiente** y se activa solo al alcanzarlo. El total se recalcula siempre.

### Herramientas internas → Laboratorio
Accesible desde el botón 🧪 del encabezado (y con «← Volver a la tienda»):
- **Original:** `ScrollView` con los 120 ítems.
- **Optimizada:** `FlatList` virtualizada.
- **Adaptativa:** 1 columna por debajo de 600 px, 2 entre 600 y 899 px, 3 desde
  900 px.
- **Sensores:** ejes X/Y/Z del acelerómetro, nivelación y captura con cámara.
- **Tareas:** sesión 9 (registro y validación adaptativa).

---

## 2. Instalación

Requisitos: Node.js 20+ y la app **Expo Go** en el teléfono (o un emulador).

```bash
npm install
```

Dependencias principales (ya en `package.json`):

```json
"expo": "~57.0.31",
"react-native": "0.86.3",
"expo-sensors": "~57.0.3",
"expo-camera": "~57.0.6",
"expo-media-library": "~57.0.5"
```

No hace falta añadir nada más para la tienda ni para el acelerómetro.

## 3. Ejecutar

```bash
npx expo start          # QR para Expo Go
npx expo start --android
npx expo start --ios
npx expo start --web
```

Si el sensor o la cámara no cargan en Expo Go después de cambiar dependencias:

```bash
npx expo install --fix
npx expo-doctor
```

---

## 4. Cómo probar

### Carrito
1. En **Inicio**, toca **Agregar al carrito** en dos productos distintos.
2. Abre 🛍️ (arriba o en la barra inferior): verifica precio unitario, subtotal
   por ítem y subtotal general.
3. Usa **+ / −** y 🗑️: los totales se recalculan al instante.
4. Cambia a **Buscar** o **Pedidos** y vuelve: el carrito se conserva.
5. Vacíalo del todo para ver el mensaje de carrito vacío.

### Comprar ahora
Toca **Comprar ahora** en una tarjeta: el producto se agrega y te lleva
directo al carrito.

### Checkout y pedido
1. **Continuar con el pedido** con el carrito lleno.
2. Elige **Recoger en tienda** (no aparece fila de envío) y luego **Domicilio**
   (aparece envío de $6.000; gratis desde $80.000 después del descuento).
3. Intenta confirmar sin datos: verás el aviso en pantalla junto al campo.
4. Completa nombre y teléfono (y dirección si es domicilio), elige el pago y
   confirma.
5. Revisa el **identificador** en la confirmación y el pedido en **Pedidos**.
   El carrito queda vacío.

### Agita y gana
1. Entra por 🎁 (barra inferior) o desde el carrito.
2. Toca **Comenzar** y acepta el permiso de movimiento.
3. Agita el teléfono con energía: la barra y el pico en g suben.
4. Al superar el umbral aparece el cupón; el botón **Usar X% en mi carrito**
   te lleva al carrito con el descuento ya aplicado (o pendiente si no llegas
   al mínimo).
5. Intenta de nuevo: hay una espera de 8 s. Si ganas otro cupón, reemplaza al
   anterior (no se acumulan).
6. **En el navegador** el sensor solo funciona en equipos con acelerómetro y
   contexto seguro (`https` o `localhost`); en escritorio sin sensor verás el
   aviso de permiso/disponibilidad. La experiencia completa es en el teléfono.

### Laboratorio
1. Toca 🧪 **Herramientas internas**.
2. Recorre **Original**, **Optimizada** y **Adaptativa** (cambia el ancho de la
   ventana para ver 1, 2 o 3 columnas).
3. **Sensores**: mueve el teléfono y observa X/Y/Z; usa **Nivelar** y la captura
   con cámara.
4. **Tareas**: agrega, completa y elimina tareas.
5. Vuelve con **← Volver a la tienda**.

---

## 5. Estructura

```
App.js                        orquesta tienda/laboratorio, carrito, cupón y pedidos
index.js                      registro de la app (registerRootComponent)
src/  data/
    catalogo.js               14 productos, categorías y filtros
    promociones.js            reglas, umbrales, vigencia y esperas
  logic/
    carrito.js                agregar, cantidades, resumen y envío
    formato.js                precios en COP
    promociones.js            vigencia, mínimos y premio por sacudida
    sacudida.js               detección pura de sacudidas
  hooks/
    useAgitar.js              acelerómetro real (nativo y web)
    useDispositivo.js         breakpoints 600/900
  services/
    pedidos.js                creación de pedido (listo para API)
  components/tienda/          encabezado, barra, tarjeta, resumen, selector, aviso
  screens/tienda/             tienda, carrito, checkout, confirmación, agita, pedidos
  screens/                    pantallas del laboratorio
  estilosTienda.js            paleta crema/rosa/chocolate
  styles.js                   tema oscuro del laboratorio
assets/productos/             fotografías y CREDITOS.md
```

### Cambiar precios o productos
Edita `src/data/catalogo.js`: cada producto tiene `id`, `nombre`, `descripcion`,
`categoria`, `precio` (COP), `imagen`, `disponible` y `stock`.

### Cambiar reglas de «Agita y gana»
Edita `src/data/promociones.js` (premios, mínimos, vigencia, espera) y los
umbrales de fuerza. La detección física está en `src/logic/sacudida.js`.

---

## 6. Créditos de imágenes

Las fotografías de los productos provienen de Wikimedia Commons y están
documentadas, con su licencia y autoría, en
[`assets/productos/CREDITOS.md`](assets/productos/CREDITOS.md).
