
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

export async function solicitar(path, { method = 'GET', body, reintentar = true } = {}) {
    try {
        const response = await fetch(path, {
            method,
            credentials: 'include',
            headers: {
                ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        });

        // 1. Manejo del 401 (Token expirado o no existe)
        if (response.status === 401 && reintentar && !path.startsWith('/api/v1/auth/')) {
            const seRenovo = await renovar();
            if (seRenovo) {
                return await solicitar(path, { method, body, reintentar: false });
            }
            
            // SI FALLÓ LA RENOVACIÓN: El usuario es un invitado.
            // Si la ruta NO es privada, devolvemos un objeto vacío seguro para que el Home no rompa.
            if (!path.includes('/me') && !path.includes('/privado')) {
                return {}; 
            }
        }

        if (response.status === 204) {
            return null;
        }

        // Intentamos leer el JSON si la respuesta fue exitosa
        if (response.ok) {
            return await response.json().catch(() => ({}));
        }

        // 2. Si la respuesta no es OK y no es un 401 recuperable, procesamos el error del backend
        const data = await response.json().catch(() => ({}));
        throw new Error(data.mensaje ?? data.message ?? `Solicitud rechazada (${response.status})`);

    } catch (error) {
        // 3. AQUÍ ATRAPAMOS CUALQUIER FALLO DE RED O INFRAESTRUCTURA (Ej: si el servidor se cae)
        // Si el fallo ocurre en una ruta pública del Home, devolvemos un objeto seguro para proteger la app
        if (!path.includes('/me') && !path.includes('/privado')) {
            console.warn(`Aviso: No se pudo conectar a ${path} (Modo invitado activo)`);
            return {}; 
        }
        // Si es una ruta protegida, relanzamos el error para que la interfaz sepa que debe bloquear el acceso
        throw error;
    }
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