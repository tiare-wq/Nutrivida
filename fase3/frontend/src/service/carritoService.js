import { solicitar } from './usuarioService.js';

// Obtener todos los planes del carrito de un usuario
export async function obtenerDetallesCarrito(idUsuario) {
    return await solicitar(`/api/v1/carrito/${idUsuario}/planes`);
}

// Agregar un plan al carrito
export async function agregarPlan(idUsuario, body) {
    return await solicitar(`/api/v1/carrito/${idUsuario}/planes`, {
        method: 'POST',
        body
    });
}

// Modificar la cantidad de un plan
export async function modificarCantidad(idUsuario, idPlan, body) {
    return await solicitar(`/api/v1/carrito/${idUsuario}/planes/${idPlan}`, {
        method: 'PUT',
        body
    });
}

// Eliminar un plan del carrito
export async function eliminarPlan(idUsuario, idPlan) {
    return await solicitar(`/api/v1/carrito/${idUsuario}/planes/${idPlan}`, {
        method: 'DELETE'
    });
}
