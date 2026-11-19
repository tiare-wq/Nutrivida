
let token = null;
let usuario = null;
let renovando = null;

function guardar(data) {
    token = data?.accessToken ?? null;
    usuario = data?.usuario ?? null;

    for (const key of ['pacientes', 'pacienteId', 'isAdmin']) {
        localStorage.removeItem(key);
    }

    window.dispatchEvent(new Event('nutrivida:actualizar'));
    return usuario;
}

export const actual = () => usuario;

export async function renovar() {
    if (!renovando) {
        renovando = fetch('/api/v1/auth/refresh', {
            method: 'POST',
            credentials: 'include'
        })
        .then(async (r) => {
            // 1. Si el backend dice 401, significa simplemente que es un INVITADO (sin sesión activa)
            if (r.status === 401) {
                guardar(null); 
                return false; // Retorna false pacíficamente sin lanzar errores catastróficos
            }

            // 2. Evaluamos el resto de estados no exitosos o respuestas vacías
            if (r.status === 204 || !r.ok) {
                guardar(null);
                return false;
            }
            guardar(await r.json());
            return true;
        })
        .catch((error) => {
            console.error('Error al renovar la sesión:', error);
            guardar(null);
            return false;
        })
        .finally(() => {
            renovando = null;
        });
    }
    return renovando;
}

export async function solicitar(
    path,
    { method = 'GET', body, reintentar = true } = {}
) {
    const response = await fetch(path, {
        method,
        credentials: 'include',
        headers: {
            ...(body !== undefined
                ? { 'Content-Type': 'application/json' }
                : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(body !== undefined
            ? { body: JSON.stringify(body) }
            : {}),
    });

    if (
        response.status === 401 &&
        reintentar &&
        !path.startsWith('/api/v1/auth/')
    ) {
        const seRenovo = await renovar();

        if (seRenovo) {
            return solicitar(path, {
                method,
                body,
                reintentar: false
            });
        }
    }

    if (response.status === 204) return null;

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(
            data.mensaje ?? `Error HTTP ${response.status}`
        );

        error.nombre = data.nombre;
        error.codigo = data.codigo ?? response.status;
        error.data = data;

        throw error;
    }

    return data;
}

export async function ingresar(correo, password, rol) {
    const data = await solicitar('/api/v1/auth/login', {
        method: 'POST',
        body: { correo, password }
    });

    if (data.usuario.rol !== rol) {
        await solicitar('/api/v1/auth/logout', { method: 'POST' });
        guardar(null);
        throw new Error('Esta cuenta no tiene el rol requerido.');
    }

    return guardar(data);
}

export async function registrar(body) {
    return guardar(await solicitar('/api/v1/auth/registro', {
        method: 'POST',
        body
    }));
}

export async function salir() {
    await solicitar('/api/v1/auth/logout', { method: 'POST' });
    guardar(null);
}

export async function editarPerfil(body) {
    usuario = await solicitar('/api/v1/pacientes/me', {
        method: 'PUT',
        body
    });

    window.dispatchEvent(new Event('nutrivida:actualizar'));
    return usuario;
}