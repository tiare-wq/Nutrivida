import { createContext, useContext } from 'react';
export const Contexto = createContext({ usuario: null, cargando: true });
export const useSesion = () => useContext(Contexto);
