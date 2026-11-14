<<<<<<< HEAD:fase3/frontend/src/data/almacen.js
import { salir, actual } from '../api/usuarios';
import { leerPlanes } from './servicios';

const LIMITE_ANUAL = 10;
const HORAS = ['10:00', '11:00', '12:00'];
const CLAVE_RESERVAS = 'nutrivida-reservas';

export const TipoPaciente = Object.freeze({
    INVITADO: 'INVITADO',
    SESION_INICIADA: 'SESION_INICIADA',
});
=======
import pacientes from './pacientes.js';
import planes from './planes.js';

const LIMITE_ANUAL = 10;
const horas = ['10:00', '11:00', '12:00'];
>>>>>>> f7f2dd95bcca7c96e827981119a58f23a37c22b2:fase2/src/data/almacen.js

function avisarCambio() {
    window.dispatchEvent(new Event('nutrivida:actualizar'));
}

<<<<<<< HEAD:fase3/frontend/src/data/almacen.js
function leerJson(clave, alternativa) {
    try {
        const valor = JSON.parse(localStorage.getItem(clave));
        return valor ?? alternativa;
    } catch {
        return alternativa;
    }
}

function clavePaciente(id) {
    return `nutrivida-paciente-${id}`;
}

function leerDatosPaciente(id) {
    const datos = leerJson(clavePaciente(id), {});
    return {
        reservas: Array.isArray(datos.reservas) ? datos.reservas : [],
        historial: Array.isArray(datos.historial) ? datos.historial : [],
    };
}

function guardarDatosPaciente(id, datos) {
    localStorage.setItem(clavePaciente(id), JSON.stringify(datos));
=======
export function agregarPaciente(nuevoPaciente) {
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    pacientes.push(nuevoPaciente);
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
}

export function leerPacientes() {
    try {
        const guardados = JSON.parse(localStorage.getItem('pacientes'));
        return Array.isArray(guardados) ? guardados : pacientes;
    } catch {
        return pacientes;
    }
}

export function guardarPacientes(lista) {
    localStorage.setItem('pacientes', JSON.stringify(lista));
>>>>>>> f7f2dd95bcca7c96e827981119a58f23a37c22b2:fase2/src/data/almacen.js
    avisarCambio();
}

export function pacienteActual() {
<<<<<<< HEAD:fase3/frontend/src/data/almacen.js
    const usuario = actual();
    if (!usuario || usuario.rol !== 'PACIENTE' || usuario.id == null) return null;
    return { ...usuario, ...leerDatosPaciente(usuario.id) };
}

export async function cerrarSesion() {
    await salir();
=======
    const id = Number(localStorage.getItem('pacienteId'));
    return leerPacientes().find(paciente => paciente.id === id) ?? null;
}

export function iniciarSesion(correo, password) {
    const paciente = leerPacientes().find(persona =>
        persona.correo.toLowerCase() === correo.trim().toLowerCase() && persona.password === password
    );
    if (paciente) {
        localStorage.setItem('pacienteId', String(paciente.id));
        avisarCambio();
    }
    return paciente;
}

export function iniciarSesionAdmin(correo, password) {
    const valido = correo.trim().toLowerCase() === "admin@nutrivida.cl" && password === "Admin123.";
    if (valido) {
        localStorage.setItem('isAdmin', true);
        avisarCambio();
    }
    
    return valido;
}

export function registrarSesion(paciente) {
    if (paciente) {
        localStorage.setItem('pacienteId', String(paciente.id));
        avisarCambio();
    }
}

export function cerrarSesion() {
    localStorage.removeItem('pacienteId');
    localStorage.removeItem('isAdmin');
    avisarCambio();
>>>>>>> f7f2dd95bcca7c96e827981119a58f23a37c22b2:fase2/src/data/almacen.js
}

function claveCarrito(id) {
    return `carrito-${id}`;
}

export function leerCarrito(id) {
<<<<<<< HEAD:fase3/frontend/src/data/almacen.js
    if (id == null) return [];
    const guardado = leerJson(claveCarrito(id), []);
    if (!Array.isArray(guardado)) return [];
    const planes = leerPlanes();
    return guardado.filter((item) =>
        planes.some((plan) => plan.id === item.id) &&
        Number.isInteger(item.cantidad) &&
        item.cantidad > 0 &&
        item.cantidad <= LIMITE_ANUAL,
    );
=======
    if (!id) return [];
    try {
        const guardado = JSON.parse(localStorage.getItem(claveCarrito(id)));
        if (!Array.isArray(guardado)) return [];
        return guardado.filter(item =>
            planes.some(plan => plan.id === item.id) &&
            Number.isInteger(item.cantidad) && item.cantidad > 0 && item.cantidad <= LIMITE_ANUAL
        );
    } catch {
        return [];
    }
>>>>>>> f7f2dd95bcca7c96e827981119a58f23a37c22b2:fase2/src/data/almacen.js
}

function guardarCarrito(id, carrito) {
    localStorage.setItem(claveCarrito(id), JSON.stringify(carrito));
    avisarCambio();
}

export function compradosEsteAnio(paciente, anio = new Date().getFullYear()) {
    return (paciente?.historial ?? [])
<<<<<<< HEAD:fase3/frontend/src/data/almacen.js
        .filter((compra) => compra.fecha?.startsWith(String(anio)))
        .flatMap((compra) => compra.planes ?? [])
=======
        .filter(compra => compra.fecha?.startsWith(String(anio)))
        .flatMap(compra => compra.planes ?? [])
>>>>>>> f7f2dd95bcca7c96e827981119a58f23a37c22b2:fase2/src/data/almacen.js
        .reduce((total, plan) => total + (Number(plan.cantidad) || 0), 0);
}

export function agregarPlan(id) {
    const paciente = pacienteActual();
<<<<<<< HEAD:fase3/frontend/src/data/almacen.js
    const plan = leerPlanes().find((item) => item.id === id);
=======
    const plan = planes.find(item => item.id === id);
>>>>>>> f7f2dd95bcca7c96e827981119a58f23a37c22b2:fase2/src/data/almacen.js
    if (!paciente || !plan) return 'Inicia sesión para agregar un plan.';

    const carrito = leerCarrito(paciente.id);
    const unidades = carrito.reduce((total, item) => total + item.cantidad, 0);
    if (compradosEsteAnio(paciente) + unidades >= LIMITE_ANUAL) {
        return 'El máximo es de 10 planes por año por paciente.';
    }

<<<<<<< HEAD:fase3/frontend/src/data/almacen.js
    const existente = carrito.find((item) => item.id === id);
=======
    const existente = carrito.find(item => item.id === id);
>>>>>>> f7f2dd95bcca7c96e827981119a58f23a37c22b2:fase2/src/data/almacen.js
    if (existente) existente.cantidad += 1;
    else carrito.push({ id, cantidad: 1 });
    guardarCarrito(paciente.id, carrito);
    return '';
}

export function cambiarCantidad(id, cantidad) {
    const paciente = pacienteActual();
    if (!paciente || !Number.isInteger(cantidad) || cantidad < 1) return false;

    const carrito = leerCarrito(paciente.id);
<<<<<<< HEAD:fase3/frontend/src/data/almacen.js
    const item = carrito.find((plan) => plan.id === id);
    if (!item) return false;
    const otras = carrito.reduce(
        (total, plan) => total + (plan.id === id ? 0 : plan.cantidad),
        0,
    );
=======
    const item = carrito.find(plan => plan.id === id);
    if (!item) return false;
    const otras = carrito.reduce((total, plan) => total + (plan.id === id ? 0 : plan.cantidad), 0);
>>>>>>> f7f2dd95bcca7c96e827981119a58f23a37c22b2:fase2/src/data/almacen.js
    if (compradosEsteAnio(paciente) + otras + cantidad > LIMITE_ANUAL) return false;

    item.cantidad = cantidad;
    guardarCarrito(paciente.id, carrito);
    return true;
}

export function quitarPlan(id) {
    const paciente = pacienteActual();
<<<<<<< HEAD:fase3/frontend/src/data/almacen.js
    if (paciente) {
        guardarCarrito(
            paciente.id,
            leerCarrito(paciente.id).filter((plan) => plan.id !== id),
        );
    }
=======
    if (paciente) guardarCarrito(paciente.id, leerCarrito(paciente.id).filter(plan => plan.id !== id));
>>>>>>> f7f2dd95bcca7c96e827981119a58f23a37c22b2:fase2/src/data/almacen.js
}

export function registrarPedido() {
    const paciente = pacienteActual();
    if (!paciente) return null;
    const carrito = leerCarrito(paciente.id);
    const unidades = carrito.reduce((total, item) => total + item.cantidad, 0);
    if (!unidades || compradosEsteAnio(paciente) + unidades > LIMITE_ANUAL) return null;

<<<<<<< HEAD:fase3/frontend/src/data/almacen.js
    const planes = leerPlanes();
    const compra = {
        id: Date.now(),
        fecha: new Date().toISOString(),
        planes: carrito.map((item) => {
            const plan = planes.find((opcion) => opcion.id === item.id);
            return {
                id: item.id,
                nombre: plan.nombre,
                precio: plan.precio,
                cantidad: item.cantidad,
            };
        }),
    };
    guardarDatosPaciente(paciente.id, {
        ...leerDatosPaciente(paciente.id),
        historial: [...paciente.historial, compra],
    });
=======
    const compra = {
        id: Date.now(),
        fecha: new Date().toISOString(),
        planes: carrito.map(item => {
            const plan = planes.find(opcion => opcion.id === item.id);
            return { id: item.id, nombre: plan.nombre, precio: plan.precio, cantidad: item.cantidad };
        })
    };
    const lista = leerPacientes().map(persona => persona.id === paciente.id
        ? { ...persona, historial: [...(persona.historial ?? []), compra] }
        : persona
    );
    guardarPacientes(lista);
>>>>>>> f7f2dd95bcca7c96e827981119a58f23a37c22b2:fase2/src/data/almacen.js
    guardarCarrito(paciente.id, []);
    return compra;
}

export function planActivo(paciente) {
<<<<<<< HEAD:fase3/frontend/src/data/almacen.js
    const planes = leerPlanes();
=======
>>>>>>> f7f2dd95bcca7c96e827981119a58f23a37c22b2:fase2/src/data/almacen.js
    const compras = [...(paciente?.historial ?? [])].reverse();
    for (const compra of compras) {
        for (const plan of compra.planes ?? []) {
            const inicio = new Date(compra.fecha);
            if (Number.isNaN(inicio.getTime())) continue;
<<<<<<< HEAD:fase3/frontend/src/data/almacen.js
            const meses =
                Number.parseInt(
                    planes.find((item) => item.id === plan.id)?.duracion,
                    10,
                ) || 1;
            const fin = new Date(inicio);
            fin.setMonth(fin.getMonth() + meses);
=======
            const fin = new Date(inicio);
            fin.setMonth(fin.getMonth() + (parseInt(planes.find(item => item.id === plan.id)?.duracion, 10) || 1));
>>>>>>> f7f2dd95bcca7c96e827981119a58f23a37c22b2:fase2/src/data/almacen.js
            if (fin > new Date()) return plan.nombre;
        }
    }
    return '';
}

export function fechaClave(fecha) {
    if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
    const valor = new Date(fecha);
    return `${valor.getFullYear()}-${String(valor.getMonth() + 1).padStart(2, '0')}-${String(valor.getDate()).padStart(2, '0')}`;
}

export function horaOcupada(profesional, fecha, hora) {
<<<<<<< HEAD:fase3/frontend/src/data/almacen.js
    const reservas = leerJson(CLAVE_RESERVAS, []);
    return (
        Array.isArray(reservas) &&
        reservas.some(
            (reserva) =>
                reserva.profesional === profesional &&
                fechaClave(reserva.fecha) === fechaClave(fecha) &&
                reserva.hora === hora,
        )
    );
=======
    return leerPacientes().some(persona => (persona.reservas ?? []).some(reserva =>
        reserva.profesional === profesional && fechaClave(reserva.fecha) === fechaClave(fecha) && reserva.hora === hora
    ));
>>>>>>> f7f2dd95bcca7c96e827981119a58f23a37c22b2:fase2/src/data/almacen.js
}

export function guardarReserva(reserva) {
    const paciente = pacienteActual();
<<<<<<< HEAD:fase3/frontend/src/data/almacen.js
    if (
        !paciente ||
        !HORAS.includes(reserva.hora) ||
        horaOcupada(reserva.profesional, reserva.fecha, reserva.hora)
    ) {
        return null;
    }
    const nueva = {
        ...reserva,
        id: Date.now(),
        pacienteId: paciente.id,
        tipoPaciente: TipoPaciente.SESION_INICIADA,
    };
    const reservas = leerJson(CLAVE_RESERVAS, []);
    localStorage.setItem(
        CLAVE_RESERVAS,
        JSON.stringify([...(Array.isArray(reservas) ? reservas : []), nueva]),
    );
    guardarDatosPaciente(paciente.id, {
        ...leerDatosPaciente(paciente.id),
        reservas: [...paciente.reservas, nueva],
    });
    return nueva;
}

export function guardarReservaInvitado(reserva) {
    if (
        !HORAS.includes(reserva.hora) ||
        horaOcupada(reserva.profesional, reserva.fecha, reserva.hora)
    ) {
        return null;
    }
    const nueva = {
        ...reserva,
        id: Date.now(),
        tipoPaciente: TipoPaciente.INVITADO
    };
    const reservas = leerJson(CLAVE_RESERVAS, []);
    localStorage.setItem(
        CLAVE_RESERVAS,
        JSON.stringify([...(Array.isArray(reservas) ? reservas : []), nueva]),
    );
=======
    if (!paciente || !horas.includes(reserva.hora) || horaOcupada(reserva.profesional, reserva.fecha, reserva.hora)) return null;
    const nueva = { ...reserva, id: Date.now(), pacienteId: paciente.id };
    guardarPacientes(leerPacientes().map(persona => persona.id === paciente.id
        ? { ...persona, reservas: [...(persona.reservas ?? []), nueva] }
        : persona
    ));
>>>>>>> f7f2dd95bcca7c96e827981119a58f23a37c22b2:fase2/src/data/almacen.js
    return nueva;
}
