import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { actual, renovar } from '../api/usuarios';
import { Contexto, useSesion } from '../context/sesion';
export function Sesion({ children }) {
    const [estado, setEstado] = useState({ usuario: actual(), cargando: true });
    useEffect(() => {
        const actualizar = () => setEstado((s) => ({ ...s, usuario: actual() }));
        window.addEventListener('nutrivida:actualizar', actualizar);
        renovar().finally(() => setEstado({ usuario: actual(), cargando: false }));
        return () => window.removeEventListener('nutrivida:actualizar', actualizar);
    }, []);
    return <Contexto.Provider value={estado}>{children}</Contexto.Provider>;
}
export function Protegida({ rol, children }) {
    const { usuario, cargando } = useSesion();
    const location = useLocation();
    if (cargando) {
        return <p role="status">Comprobando sesión…</p>;
    }
    if (!usuario || usuario.rol !== rol) {
        return (
            <Navigate
                to={
                    rol === 'ADMIN'
                        ? '/login-admin'
                        : rol === 'PROFESIONAL'
                          ? '/login-profesional'
                          : '/login'
                }
                state={{ next: location.pathname }}
                replace
            />
        );
    }
    return children;
}
