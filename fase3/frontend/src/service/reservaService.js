import { solicitar } from '../api/usuarios.js';

export async function obtenerReservas() {
    return await solicitar('/api/reservas');
}

export async function obtenerReservasPaciente(id) {
    return await solicitar(`/api/v1/reservas/paciente/${id}`);
}

export async function obtenerReservaPorId(id) {
    return await solicitar(`/api/v1/reservas/${id}`);
}

export async function crearReserva(body, email) {
    return await solicitar(
        `/api/v1/reservas/${encodeURIComponent(email)}`,
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
