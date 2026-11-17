import { solicitar } from './usuarioService.js';

export async function obtenerReservas() {
    return await solicitar('/api/v1/reservas');
}

export async function obtenerReservasPaciente() {
    return await solicitar(`/api/v1/reservas/me`);
}

export async function obtenerReservaPorId(id) {
    return await solicitar(`/api/v1/reservas/${id}`);
}

export async function crearReserva(body) {
    return await solicitar(
        `/api/v1/reservas`,
        {
            method: 'POST',
            body
        }
    ); 
}

export async function actualizarReserva(id, body) {
    return await solicitar(`/api/v1/reservas/${id}`, {
        method: 'PUT',
        body,
    });
}

export async function eliminarReserva(id) {
    return await solicitar(`/api/v1/reservas/${id}`, {
        method: 'DELETE',
    });
}
