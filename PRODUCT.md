# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

Clientes de una pastelería real: personas usando el teléfono en el momento de
decidir qué comprar —ver fotos, precios, descripciones— y completar un pedido
local de demostración. Es un prototipo para una pastelería real: el éxito es
que la tienda se vea creíble para un cliente externo (fotos, precios y flujo de
compra reales), no solo que sirva como demostración académica.

## Product Purpose

Tienda móvil «Pastelería La T»: catálogo con fotos reales, carrito, checkout
con recogida o domicilio, el juego «Agita y gana» que desbloquea cupones con el
acelerómetro real del teléfono, y un asistente IA local que responde precio,
nombre y descripción de los productos. Éxito: una demo impecable y sin errores
en teléfono y web, donde el cliente entiende la oferta y completa la compra.

## Positioning

Mecanismos que un vecino no copia de un catálogo estático: (1) el descuento
sale de la sacudida física real del teléfono —acelerómetro, no azar—, y (2) un
asistente de producto 100% local —sin APIs ni red— con clasificador 1-NN que
explica su confianza y ofrece opciones manuales ante preguntas ambiguas.

## Operating Context

- Expo SDK 58 + React Native; el teléfono es el uso principal y el export web
  sirve para demostración y verificación.
- Interfaz en español, precios en COP, pedidos locales sin backend (los
  servicios están listos para conectarse a una API).
- El laboratorio académico de sensores y rendimiento vive detrás de
  «Herramientas internas» y no forma parte de la tienda.
- Origen académico: proyecto del curso de sensores; convive con su función de
  prototipo comercial.

## Capabilities and Constraints

- Catálogo: 14 productos reales con fotos locales; los 120 productos de
  demostración solo los consume el asistente (134 en total ahí).
- El asistente recibe el catálogo por props desde `App.js`; umbrales
  0.35 (confianza) y 0.10 (ambigüedad) en `src/logic/modeloIA.js`; opciones
  manuales cuando no puede decidir.
- «Agita y gana» usa el acelerómetro real (expo-sensors); cupones de 5/10/15%
  con mínimo y vigencia; no se acumulan.
- Carrito y checkout viven en `App.js` (estado en sesión); sin persistencia.
- Restricción dura acordada: respetar toda la lógica actual (catálogo,
  asistente, sensores) y **no añadir dependencias nuevas** —animación y
  feedback con las primitivas de React Native (`Animated`, `Pressable`).
- Alcance visual acordado: la tienda, el asistente y «Agita y gana» (los
  archivos de UI listados); el laboratorio queda fuera de esta pasada.

## Evidence on Hand

- `README.md`: funcionalidades y pasos de prueba.
- Fotos reales de producto en `assets/productos/` (14 imágenes).
- Catálogo en `src/data/catalogo.js`, promociones en `src/data/promociones.js`.
- `DESIGN.md`: sistema visual Neo Kinpaku (autoridad de diseño).
- Ausencias que no se deben inventar: no hay backend, ni clientes, ni
  testimonios, ni logo gráfico propio (la marca «La T» es tipográfica).

## Product Principles

1. La lógica y los datos son intocables; el cambio es visual y de interacción.
2. Cero dependencias nuevas: feedback y animación con primitivas nativas.
3. Demo creíble: contenido real en español con precios COP; nada de relleno.
4. Se conservan accesibilidad (roles, labels, live regions) y responsividad
   (1/2/3 columnas, targets táctiles amplios).

## Accessibility & Inclusion

- Roles y labels de accesibilidad presentes en todos los controles; respuestas
  y avisos anuncian con `accessibilityLiveRegion`.
- Targets táctiles ≥ 48 px; tema oscuro (laca) con altos niveles de contraste
  en texto.
- Ningún requisito estándar formal adicional confirmado.
