// =============================
// OBTENER URL Y PARÁMETROS
// =============================

const queryParam = window.location.search;
const urlParam = new URLSearchParams(queryParam);

const nombre = urlParam.get('nombre');
const run = urlParam.get('run')
const fecha = urlParam.get('fecha');
const horario = urlParam.get('horario');
const atencion = urlParam.get('atencion');
const planServ = urlParam.get('planServ');
const precio = urlParam.get('precio');

// =============================
// OBTENER CÓDIGO DE LA RESERVA
// =============================

function obtenerCodigoReserva() {
    return Math.random(0, 1) * 10**16;
}

const codReserva = document.getElementById("codigo-reserva");
codReserva.textContent = obtenerCodigoReserva();

// ==============================
// MOSTRAR DATOS DE CONFIRMACIÓN
// ==============================

const sectNombre = document.getElementById("nombre");
const sectFechaHora = document.getElementById("fecha-hora");
const sectPrecio = document.getElementById("precio");

sectNombre.textContent = `Nombre del paciente: ${nombre}`;
sectFechaHora.textContent = `Paciente citado para el día ${fecha} en la ${horario}`;
sectPrecio.textContent = `Valor de la atención: $${precio}`;
