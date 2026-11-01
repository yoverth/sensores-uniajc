/* =========================================================
   MODELO IA · CLASIFICADOR DIDÁCTICO 1-NN

   No usa servicios externos ni modelos descargados: aprende de
   ejemplos escritos a mano y clasifica cada pregunta comparándola
   con el ejemplo más parecido (1-NN, "vecino más cercano").

   Proceso:
   1. Normalizar el texto (minúsculas, sin tildes ni puntuación).
   2. Quitar palabras vacías (artículos, preposiciones, etc.).
   3. Convertir cada frase en un conjunto de tokens.
   4. Medir la similitud de coseno entre la consulta y cada ejemplo.
   5. Elegir la intención del ejemplo más parecido y exigir un
      umbral de confianza y un margen sobre la segunda intención.
========================================================= */

export const INTENCIONES = ['precio', 'nombre', 'descripcion'];

export const ETIQUETAS_INTENCION = {
  precio: 'Precio',
  nombre: 'Nombre',
  descripcion: 'Descripción',
};

/* Si la mejor coincidencia no llega a este valor, se considera
   una pregunta fuera de contexto. */
export const UMBRAL_CONFIANZA = 0.35;

/* Si la segunda intención queda demasiado cerca de la primera,
   la pregunta es ambigua y es mejor no responder. */
export const UMBRAL_DIFERENCIA = 0.1;

/* =========================================================
   PALABRAS VACÍAS
========================================================= */

export const PALABRAS_VACIAS = new Set([
  'a',
  'al',
  'algo',
  'ante',
  'bajo',
  'con',
  'contra',
  'cual',
  'de',
  'del',
  'desde',
  'donde',
  'el',
  'en',
  'entre',
  'es',
  'esta',
  'estas',
  'este',
  'estos',
  'favor',
  'hasta',
  'hay',
  'la',
  'las',
  'le',
  'les',
  'lo',
  'los',
  'mas',
  'me',
  'mi',
  'mis',
  'muy',
  'nos',
  'o',
  'para',
  'pero',
  'por',
  'porfavor',
  'que',
  'se',
  'sin',
  'sobre',
  'son',
  'su',
  'sus',
  'te',
  'tu',
  'tus',
  'u',
  'un',
  'una',
  'unas',
  'unos',
  'y',
]);

/* =========================================================
   EJEMPLOS DE ENTRENAMIENTO
   Cada frase se normaliza y tokeniza al cargar el módulo.
========================================================= */

export const EJEMPLOS_ENTRENAMIENTO = {
  precio: [
    '¿Cuánto cuesta este producto?',
    '¿Cuál es el precio?',
    '¿Qué precio tiene?',
    '¿Cuánto vale?',
    '¿Cuánto sale?',
    '¿Cuánto debo pagar?',
    'precio del producto',
    'costo total',
    'valor del artículo',
    'cuánto dinero cuesta',
    'dime el precio',
    'precio unitario',
  ],
  nombre: [
    '¿Cómo se llama este producto?',
    '¿Cuál es su nombre?',
    '¿Cómo se llama este artículo?',
    '¿Qué producto es?',
    'nombre del producto',
    'dime el nombre',
    'identifica el producto',
    'cómo se llama',
    'cuál es el nombre del artículo',
  ],
  descripcion: [
    '¿Qué características tiene?',
    '¿Para qué sirve este producto?',
    '¿De qué está hecho?',
    'Descríbeme el producto',
    'descripción del producto',
    'detalles del producto',
    'ingredientes del producto',
    '¿Qué contiene?',
    '¿Cómo es el producto?',
    'información del producto',
    'háblame de sus características',
    'cuéntame más del producto',
  ],
};

/* =========================================================
   NORMALIZACIÓN
========================================================= */

/* Se reemplazan las tildes a mano para que el resultado sea igual
   en Android, iOS y web (sin depender de String.normalize). */
function quitarTildes(texto) {
  return texto
    .replace(/[áàäâã]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/ç/g, 'c');
}

export function normalizarTexto(texto) {
  return quitarTildes(String(texto ?? '').toLowerCase())
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenizar(texto) {
  const normalizado = normalizarTexto(texto);
  if (!normalizado) return [];

  /* Se usa un Set porque la similitud se calcula sobre conjuntos:
     repetir una palabra no debe inflar la puntuación. */
  return Array.from(
    new Set(
      normalizado
        .split(' ')
        .filter((token) => token.length > 1 && !PALABRAS_VACIAS.has(token))
    )
  );
}

/* =========================================================
   SIMILITUD DE COSENO
   cos(A, B) = |A ∩ B| / sqrt(|A| · |B|)
========================================================= */

export function similitudCoseno(a, b) {
  const conjuntoA =
    a instanceof Set ? a : new Set(Array.isArray(a) ? a : tokenizar(a));
  const conjuntoB =
    b instanceof Set ? b : new Set(Array.isArray(b) ? b : tokenizar(b));

  if (conjuntoA.size === 0 || conjuntoB.size === 0) return 0;

  let interseccion = 0;
  conjuntoA.forEach((token) => {
    if (conjuntoB.has(token)) interseccion += 1;
  });

  return interseccion / Math.sqrt(conjuntoA.size * conjuntoB.size);
}

/* =========================================================
   ENTRENAMIENTO
========================================================= */

const EJEMPLOS_INDEXADOS = Object.entries(EJEMPLOS_ENTRENAMIENTO).flatMap(
  ([intencion, frases]) =>
    frases.map((texto) => ({
      intencion,
      texto,
      tokens: tokenizar(texto),
    }))
);

/* =========================================================
   CLASIFICACIÓN
========================================================= */

export function clasificarIntencion(texto) {
  const tokens = tokenizar(texto);

  const base = {
    valida: false,
    intencion: null,
    confianza: 0,
    segundaIntencion: null,
    segundaConfianza: 0,
    diferencia: 0,
    motivo: null,
    tokens,
  };

  if (!String(texto ?? '').trim()) {
    return { ...base, motivo: 'vacia' };
  }

  if (tokens.length === 0) {
    return { ...base, motivo: 'sin_contenido' };
  }

  /* 1-NN: se puntúa la consulta contra todos los ejemplos y se
     ordenan de mayor a menor similitud. */
  const puntuaciones = EJEMPLOS_INDEXADOS.map((ejemplo) => ({
    ...ejemplo,
    similitud: similitudCoseno(tokens, ejemplo.tokens),
  })).sort((x, y) => y.similitud - x.similitud);

  const mejor = puntuaciones[0] ?? null;

  /* La segunda puntuación debe ser de otra intención: dos ejemplos
     de la misma clase no compiten entre sí. */
  const segundo =
    puntuaciones.find(
      (candidato) => mejor && candidato.intencion !== mejor.intencion
    ) ?? null;

  const confianza = mejor ? mejor.similitud : 0;
  const segundaConfianza = segundo ? segundo.similitud : 0;
  const diferencia = confianza - segundaConfianza;

  const resultado = {
    ...base,
    intencion: mejor ? mejor.intencion : null,
    confianza,
    segundaIntencion: segundo ? segundo.intencion : null,
    segundaConfianza,
    diferencia,
  };

  if (confianza < UMBRAL_CONFIANZA) {
    return { ...resultado, motivo: 'baja_confianza' };
  }

  if (diferencia < UMBRAL_DIFERENCIA) {
    return { ...resultado, motivo: 'ambigua' };
  }

  return { ...resultado, valida: true, motivo: null };
}
