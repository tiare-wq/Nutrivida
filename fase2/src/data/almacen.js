import pacientes from './pacientes.js';
import planes from './planes.js';

const LIMITE_ANUAL = 10;
const horas = ['10:00', '11:00', '12:00'];

function avisarCambio() {
    window.dispatchEvent(new Event('nutrivida:actualizar'));
}

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
    avisarCambio();
}

export function pacienteActual() {
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
    localStorage.removeItem('isAdmin');
    avisarCambio();
}

function claveCarrito(id) {
    return `carrito-${id}`;
}

export function leerCarrito(id) {
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
}

function guardarCarrito(id, carrito) {
    localStorage.setItem(claveCarrito(id), JSON.stringify(carrito));
    avisarCambio();
}

export function compradosEsteAnio(paciente, anio = new Date().getFullYear()) {
    return (paciente?.historial ?? [])
        .filter(compra => compra.fecha?.startsWith(String(anio)))
        .flatMap(compra => compra.planes ?? [])
        .reduce((total, plan) => total + (Number(plan.cantidad) || 0), 0);
}

export function agregarPlan(id) {
    const paciente = pacienteActual();
    const plan = planes.find(item => item.id === id);
    if (!paciente || !plan) return 'Inicia sesión para agregar un plan.';

    const carrito = leerCarrito(paciente.id);
    const unidades = carrito.reduce((total, item) => total + item.cantidad, 0);
    if (compradosEsteAnio(paciente) + unidades >= LIMITE_ANUAL) {
        return 'El máximo es de 10 planes por año por paciente.';
    }

    const existente = carrito.find(item => item.id === id);
    if (existente) existente.cantidad += 1;
    else carrito.push({ id, cantidad: 1 });
    guardarCarrito(paciente.id, carrito);
    return '';
}

export function cambiarCantidad(id, cantidad) {
    const paciente = pacienteActual();
    if (!paciente || !Number.isInteger(cantidad) || cantidad < 1) return false;

    const carrito = leerCarrito(paciente.id);
    const item = carrito.find(plan => plan.id === id);
    if (!item) return false;
    const otras = carrito.reduce((total, plan) => total + (plan.id === id ? 0 : plan.cantidad), 0);
    if (compradosEsteAnio(paciente) + otras + cantidad > LIMITE_ANUAL) return false;

    item.cantidad = cantidad;
    guardarCarrito(paciente.id, carrito);
    return true;
}

export function quitarPlan(id) {
    const paciente = pacienteActual();
    if (paciente) guardarCarrito(paciente.id, leerCarrito(paciente.id).filter(plan => plan.id !== id));
}

export function registrarPedido() {
    const paciente = pacienteActual();
    if (!paciente) return null;
    const carrito = leerCarrito(paciente.id);
    const unidades = carrito.reduce((total, item) => total + item.cantidad, 0);
    if (!unidades || compradosEsteAnio(paciente) + unidades > LIMITE_ANUAL) return null;

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
    guardarCarrito(paciente.id, []);
    return compra;
}

export function planActivo(paciente) {
    const compras = [...(paciente?.historial ?? [])].reverse();
    for (const compra of compras) {
        for (const plan of compra.planes ?? []) {
            const inicio = new Date(compra.fecha);
            if (Number.isNaN(inicio.getTime())) continue;
            const fin = new Date(inicio);
            fin.setMonth(fin.getMonth() + (parseInt(planes.find(item => item.id === plan.id)?.duracion, 10) || 1));
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
    return leerPacientes().some(persona => (persona.reservas ?? []).some(reserva =>
        reserva.profesional === profesional && fechaClave(reserva.fecha) === fechaClave(fecha) && reserva.hora === hora
    ));
}

export function guardarReserva(reserva) {
    const paciente = pacienteActual();
    if (!paciente || !horas.includes(reserva.hora) || horaOcupada(reserva.profesional, reserva.fecha, reserva.hora)) return null;
    const nueva = { ...reserva, id: Date.now(), pacienteId: paciente.id };
    guardarPacientes(leerPacientes().map(persona => persona.id === paciente.id
        ? { ...persona, reservas: [...(persona.reservas ?? []), nueva] }
        : persona
    ));
    return nueva;
}
