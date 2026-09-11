function ocultarReservaHora() {
    horario.classList.add("d-none");
    enviar.value = "Continuar";
}

function ocultarDatosContacto() {
    datosContacto.classList.add("d-none");
}

// ======================================
// OPCIONES DE SELECT PLANES-SERVICIOS
// ======================================

const tipoAtencion = document.getElementById("tipo-atencion-select");
const planesServicios = document.getElementById("plan-servicio-select");
const profesionales = document.getElementById("profesional-select");
const horario = document.getElementById("reserva-hora");
const datosContacto = document.getElementById("datos-contacto");
const enviar = document.getElementById("enviar");

let campoDiaSeleccionado = null;

const opcionesPlanesServicios = planesServicios.options;

tipoAtencion.onchange = function() {

    opcionesPlanesServicios.selectedIndex = 0;
    profesionales.value = "";
    campoDiaSeleccionado = null;

    ocultarReservaHora();
    ocultarDatosContacto();

    planesServicios.disabled = false;

    const opcionSeleccionada = tipoAtencion.selectedOptions[0];
    
    for (const opc of opcionesPlanesServicios) {

        if(opc.value == "") {
            opc.hidden = false;
            continue
        }

        if (opc.classList.contains(opcionSeleccionada.value)) {
            opc.hidden = false;
        } else {
            opc.hidden = true;
        }
    }
}

// ======================================
// OPCIONES DE SELECT PROFESIONAL
// ======================================

planesServicios.onchange = function() {

    ocultarReservaHora();
    ocultarDatosContacto();

    profesionales.disabled = false;

    profesionales.value = "";
    campoDiaSeleccionado = null;

    const opcionSeleccionada = planesServicios.selectedOptions[0].dataset.profesional.split(",");

    for (const profesional of profesionales.options) {

        if (profesional.value === "") {
            profesional.hidden = false;
            continue;
        }

        if (opcionSeleccionada.includes(profesional.className)) {
            profesional.hidden = false;
        } else {
            profesional.hidden = true;
        }
    }

}

// ======================================
// SELECCIONAR HORARIO
// ======================================

const fechaActual = new Date();
let mesActual =  fechaActual.getMonth();
let anioActual = fechaActual.getFullYear();

const cuerpoCalendario = document.getElementById("calendar-body");
const campoMesActual = document.getElementById("current-month");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

profesionales.onchange = function() {
    horario.classList.remove("d-none");
    renderCalendar();
}

prevBtn.onclick = function(event) {
    event.preventDefault();

    mesActual--;

    if (mesActual < 0) {
        mesActual = 11;
        anioActual--;
    }

    renderCalendar();
}

nextBtn.onclick = function(event) {
    event.preventDefault();

    mesActual++;

    if (mesActual > 11) {
        mesActual = 0;
        anioActual++;
    }

    renderCalendar();
}

function renderCalendar() {

    enviar.value = "Enviar";

    ocultarDatosContacto();

    const diasMes = new Date(anioActual, mesActual + 1, 0).getDate();
    const primerDia = new Date(anioActual, mesActual, 1).getDay();

    const posicionPrimerDia = (primerDia + 6) % 7;

    if (datosContacto.classList.contains("d-none")) {
        datosContacto.classList.remove("d-none");
    }

    const nombreMes = new Date(anioActual, mesActual).toLocaleDateString('es-CL', {month: "long", year: "numeric"});
    campoMesActual.textContent = nombreMes[0].toUpperCase() + nombreMes.slice(1);

    let dias = `<div class="week-day"><p><b>L</b></p></div>
                <div class="week-day"><p><b>M</b></p></div>
                <div class="week-day"><p><b>Mi</b></p></div>
                <div class="week-day"><p><b>J</b></p></div>
                <div class="week-day"><p><b>V</b></p></div>
                <div class="week-day"><p><b>S</b></p></div>
                <div class="week-day"><p><b>D</b></p></div>`;

    for (let i = 0; i < posicionPrimerDia; i++) {
        dias += `<div class="calendar-day empty"></div>`;
    }

    for(let i = 1; i <= diasMes; i++) {

        dias += `
                <div 
                    class="calendar-day" 
                    onclick="seleccionarDia(${i}, this)">
                    ${i}
                </div>
            `;
    }

    cuerpoCalendario.innerHTML = dias;
}

function seleccionarDia(dia, elemento) {

    document.querySelectorAll(".calendar-day")
        .forEach(dia => dia.classList.remove("seleccionado"));

    elemento.classList.add("seleccionado");
    
    campoDiaSeleccionado = new Date(anioActual, mesActual, dia);
}

// ======================================
// VALIDACIÓN DE DATOS FORMULARIO
// ======================================

const mensajeForm = document.getElementById("mensaje-form-invalido");

const campoNombre = document.getElementById("nombre");
const campoRun = document.getElementById("run");
const campoCorreo = document.getElementById("correo");

// Patrones Regex
const runPattern = /^\d{7,8}-[0-9kK]$/;
const mailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/

enviar.onclick = function(event) {

    event.preventDefault();

    const nombre = campoNombre.value.trim() === "";
    const run = !runPattern.test(campoRun.value.trim());
    const correo = !mailPattern.test(campoCorreo.value.trim());
    const campoHora = document.querySelector("input[name='hora']:checked");
    const hora = campoHora === null;
    const atencion = tipoAtencion.selectedOptions[0].value === "";
    const planServ = planesServicios.selectedOptions[0].value === "";
    const profesional = profesionales.selectedOptions[0].value === "";
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaAnterior = campoDiaSeleccionado !== null &&
                campoDiaSeleccionado < hoy;
    const fecha = campoDiaSeleccionado === null;

    const errorNombre = document.getElementById("error-nombre");
    const errorCorreo = document.getElementById("error-correo");
    const errorRun = document.getElementById("error-run");
    const errorAtencion = document.getElementById("error-atencion");
    const errorPlanServ = document.getElementById("error-servicio");
    const errorFecha = document.getElementById("error-fecha");
    const errorHora = document.getElementById("error-hora");
    const errorProfesional = document.getElementById("error-profesional");

    errorNombre.textContent = "";
    errorCorreo.textContent = "";
    errorRun.textContent = "";
    errorAtencion.textContent = "";
    errorPlanServ.textContent = "";
    errorFecha.textContent = "";
    errorHora.textContent = "";
    errorProfesional.textContent = "";

    let formularioValido = true;

    if (atencion) {
        errorAtencion.textContent = "Seleccione una atención.";
        formularioValido = false;
    }

    if (planServ) {
        errorPlanServ.textContent = "Seleccione un plan o servicio.";
        formularioValido = false;
    }

    if (profesional) {
        errorProfesional.textContent = "Seleccione un profesional";
        formularioValido = false;
    }

    if (horario.classList.contains("d-none")) {
        return;
    }
    if (nombre) {
        errorNombre.textContent = "Introduzca su nombre";
        formularioValido = false;
    }

    if (run) {
        errorRun.textContent = "El formato del RUN no es válido. Por favor, introduzca su RUN sin puntos y con guión.";
        formularioValido = false;
    }

    if (correo) {
        errorCorreo.textContent = "El formato del correo no es válido.";
        formularioValido = false;
    }

    if (fechaAnterior) {
        errorFecha.textContent = "La fecha no puede ser anterior a la actual";
        formularioValido = false;
    }

    if (fecha) {
        errorFecha.textContent = "Seleccione una fecha";
        formularioValido = false;
    }

    if (hora) {
        errorHora.textContent = "Seleccione un hora";
        formularioValido = false;
    }

    if (formularioValido) {

        errorNombre.textContent = "";
        errorCorreo.textContent = "";
        errorRun.textContent = "";
        errorAtencion.textContent = "";
        errorPlanServ.textContent = "";
        errorHora.textContent = "";
        errorProfesional.textContent = "";

        //   1. Entregamos parámetros
        const parametros = new URLSearchParams();
        parametros.append("nombre", campoNombre.value.trim());
        parametros.append("run", campoRun.value.trim())
        parametros.append("fecha", campoDiaSeleccionado.toISOString());
        parametros.append("hora", campoHora.value);
        parametros.append("atencion", tipoAtencion.selectedOptions[0].value);
        parametros.append("planServ", planesServicios.selectedOptions[0].value);
        parametros.append("precio", planesServicios.selectedOptions[0].dataset.precio);

        // 💡 2. Definimos la página de destino
        const paginaDestino = "confirmacion.html";

        window.location.href = `${paginaDestino}?${parametros.toString()}`;
    }
}
