let token = null;
let usuario = null;
let renovando = null;
function guardar(data) {
    token = data?.accessToken ?? null;
    usuario = data?.usuario ?? null;
    // Eliminar las credenciales y banderas que utilizaba la fase 2.
    for (const key of ['pacientes', 'pacienteId', 'isAdmin']) {
        localStorage.removeItem(key);
    }
    window.dispatchEvent(new Event('nutrivida:actualizar'));
    return usuario;
}
export const actual = () => usuario;
export async function renovar() {
    if (!renovando) {
        renovando = fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
            .then(async (r) => (r.ok ? guardar(await r.json()) : guardar(null)))
            .finally(() => {
                renovando = null;
            });
    }
    return renovando;
}
export async function solicitar(path, { method = 'GET', body, reintentar = true } = {}) {
    const response = await fetch(path, {
        method,
        credentials: 'include',
        headers: {
            ...(body ? { 'Content-Type': 'application/json' } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (response.status === 401 && reintentar && !path.startsWith('/api/auth/')) {
        if (await renovar()) {
            return solicitar(path, { method, body, reintentar: false });
        }
    }
    if (response.status === 204) {
        return null;
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || `Solicitud rechazada (${response.status})`);
    }
    return data;
}
export async function ingresar(correo, password, rol) {
    const data = await solicitar('/api/auth/login', { method: 'POST', body: { correo, password } });
    if (data.usuario.rol !== rol) {
        await solicitar('/api/auth/logout', { method: 'POST' });
        guardar(null);
        throw new Error('Esta cuenta no tiene el rol requerido.');
    }
    return guardar(data);
}
export async function registrar(body) {
    return guardar(await solicitar('/api/auth/registro', { method: 'POST', body }));
}
export async function salir() {
    // Solo confirmar el cierre cuando el servidor haya revocado la sesión.
    await solicitar('/api/auth/logout', { method: 'POST' });
    guardar(null);
}
export async function editarPerfil(body) {
    usuario = await solicitar('/api/pacientes/me', { method: 'PUT', body });
    window.dispatchEvent(new Event('nutrivida:actualizar'));
    return usuario;
}
