// ======================================
// OPCIONES DE SELECT PLANES-SERVICIOS
// ======================================

const tipoAtencion = document.getElementById("tipo-atencion-select");
const planesServicios = document.getElementById("plan-servicio-select");
const profesionales = document.getElementById("profesional-select");

const opcionesPlanesServicios = planesServicios.options;

tipoAtencion.onchange = function() {

    opcionesPlanesServicios.selectedIndex = 0;
    profesionales.value = "";


    if (tipoAtencion.value === "") {
        planesServicios.disabled = true;
        profesionales.disabled = true;
        return;
    }

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

    if (planesServicios.value === "") {
        profesionales.disabled = true;
        return
    }

    profesionales.disabled = false;

    profesionales.value = "";

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
// VALIDACIÓN DE DATOS FORMULARIO
// ======================================

const submit = document.getElementById("enviar")
const mensajeForm = document.getElementById("mensaje-form-invalido")

const campoNombre = document.getElementById("nombre");
const campoRun = document.getElementById("run");
const campoCorreo = document.getElementById("correo");
const campoFecha = document.getElementById("fecha");
const campoHorario = document.getElementById("horario");

// Patrones Regex
const runPattern = /^\d{7,8}-[0-9kK]$/;
const mailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/

submit.onclick = function(event) {

    event.preventDefault()

    const nombre = campoNombre.value.trim() === "";
    const run = !runPattern.test(campoRun.value.trim());
    const correo = !mailPattern.test(campoCorreo.value.trim());
    const fecha = campoFecha.value.trim() === "";
    const horario = campoHorario.value === "";
    const atencion = tipoAtencion.selectedOptions[0].value === "";
    const planServ = planesServicios.selectedOptions[0].value === "";
    const profesional = profesionales.selectedOptions[0].value === "";

    const errorNombre = document.getElementById("error-nombre");
    const errorCorreo = document.getElementById("error-correo");
    const errorRun = document.getElementById("error-run");
    const errorAtencion = document.getElementById("error-atencion");
    const errorPlanServ = document.getElementById("error-plan-serv");
    const errorFecha = document.getElementById("error-fecha");
    const errorHorario = document.getElementById("error-horario");
    const errorProfesional = document.getElementById("error-profesional");

    errorNombre.textContent = "";
    errorCorreo.textContent = "";
    errorRun.textContent = "";
    errorAtencion.textContent = "";
    errorPlanServ.textContent = "";
    errorFecha.textContent = "";
    errorHorario.textContent = "";
    errorProfesional.textContent = "";

    let formularioValido = true;

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

    if (atencion) {
        errorAtencion.textContent = "Seleccione una atención.";
        formularioValido = false;
    }

    if (planServ) {
        errorPlanServ.textContent = "Seleccione un plan o servicio.";
        formularioValido = false;
    }

    if (fecha) {
        errorFecha.textContent = "Seleccione una fecha";
        formularioValido = false;
    }

    if (horario) {
        errorHorario.textContent = "Seleccione un horario";
        formularioValido = false;
    }

    if (profesional) {
        errorProfesional.textContent = "Seleccione un profesional";
        formularioValido = false;
    }

    if (formularioValido) {

        errorNombre.textContent = "";
        errorCorreo.textContent = "";
        errorRun.textContent = "";
        errorAtencion.textContent = "";
        errorPlanServ.textContent = "";
        errorFecha.textContent = "";
        errorHorario.textContent = "";
        errorProfesional.textContent = "";

        //   1. Entregamos parámetros
        const parametros = new URLSearchParams();
        parametros.append("nombre", campoNombre.value.trim());
        parametros.append("run", campoRun.value.trim())
        parametros.append("fecha", campoFecha.value);
        parametros.append("horario", campoHorario.value);
        parametros.append("atencion", tipoAtencion.selectedOptions[0].value);
        parametros.append("planServ", planesServicios.selectedOptions[0].value);
        parametros.append("precio", planesServicios.selectedOptions[0].dataset.precio);

        // 💡 2. Definimos la página de destino
        const paginaDestino = "confirmacion.html";

        window.location.href = `${paginaDestino}?${parametros.toString()}`;
    }
}
