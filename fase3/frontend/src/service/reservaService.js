import { solicitar } from '../api/usuarios.js';

export async function obtenerReservas() {
    return await solicitar('/api/reservas');
}

export async function obtenerReservasPaciente(id) {
    return await solicitar(`/api/reservas/paciente/${id}`);
}

export async function obtenerReservaPorId(id) {
    return await solicitar(`/api/reservas/${id}`);
}

export async function crearReserva(body) {
    return await solicitar('/api/reservas', {
        method: 'POST',
        body,
    });
}

export async function actualizarReserva(id, body) {
    return await solicitar(`/api/reservas/${id}`, {
        method: 'PUT',
        body,
    });
}

export async function eliminarReserva(id) {
    return await solicitar(`/api/reservas/${id}`, {
        method: 'DELETE',
    });
}
