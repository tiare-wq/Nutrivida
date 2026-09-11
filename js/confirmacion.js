// =============================
// OBTENER URL Y PARÁMETROS
// =============================

const queryParam = window.location.search;
const urlParam = new URLSearchParams(queryParam);

const fecha = urlParam.get('fecha');
const hora = urlParam.get('hora');
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

const sectFechaHora = document.getElementById("fecha-hora");
const sectPrecio = document.getElementById("precio");

sectFechaHora.textContent = `Se agendó su cita para el día ${fecha} a las ${hora} horas.`;
sectPrecio.textContent = `Valor de la atención: $${precio}.`;
