import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { crearEstilos } from '../estilosTienda';
import { obtenerTokensTema } from './tokens';

/* =========================================================
   CONTEXTO DE TEMA · CLARO / OSCURO
   El modo claro es el inicial. `crearEstilos` resuelve la paleta
   completa, los tokens y los estilos una sola vez por cambio de
   tema; todos los componentes consumen `useTema()`.
========================================================= */

const TemaContexto = createContext(null);

export function TemaProvider({ children, modoInicial = 'claro' }) {
  const [modo, setModo] = useState(modoInicial);

  const alternarTema = useCallback(() => {
    setModo((actual) => (actual === 'claro' ? 'oscuro' : 'claro'));
  }, []);

  const valor = useMemo(() => {
    const tokens = obtenerTokensTema(modo);
    const { colores, estilos } = crearEstilos(modo);

    return {
      modo,
      colores,
      estilos,
      tokens,
      alternarTema,
      definirTema: setModo,
    };
  }, [modo, alternarTema]);

  return (
    <TemaContexto.Provider value={valor}>{children}</TemaContexto.Provider>
  );
}

export function useTema() {
  const contexto = useContext(TemaContexto);

  if (!contexto) {
    throw new Error('useTema debe usarse dentro de <TemaProvider>.');
  }

  return contexto;
}

export default TemaContexto;
