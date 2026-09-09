// ======================================
// OPCIONES DE SELECT PLANES-SERVICIOS
// ======================================

const tipoAtencion = document.getElementById("tipo-atencion-select");
const planesServicios = document.getElementById("plan-servicio-select");

const opcionesPlanesServicios = planesServicios.options;

tipoAtencion.onchange = function() {

    opcionesPlanesServicios.selectedIndex = 0;

    if (tipoAtencion === "") {
        planesServicios.disabled = true;
        return;
    }

    planesServicios.disabled = false;

    const opcionSeleccionada = tipoAtencion.selectedOptions[0];
    
    for (const opc of opcionesPlanesServicios) {
        if (opc.classList.contains(opcionSeleccionada.value)) {
            opc.hidden = false;
        } else {
            opc.hidden = true;
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

submit.onclick = function(event) {

    event.preventDefault()

    const nombre = campoNombre.value.trim() === "";
    const run = campoRun.value.trim() === "";
    const correo = campoCorreo.value.trim() === "";
    const fecha = campoFecha.value.trim() === "";
    const horario = campoHorario.value === "";
    const atencion = tipoAtencion.selectedOptions[0].value === "";
    const planServ = planesServicios.selectedOptions[0].value === "";

    if (nombre || run || correo || fecha || horario || atencion || planServ) {

        const mensajeError = document.getElementById("mensaje-error");
        mensajeError.textContent = "Debe completar todos los campos"
    } else {
        mensajeForm.textContent = "";

        //   1. Entregamos parámetros
        const parametros = new URLSearchParams();
        parametros.append("nombre", campoNombre.value.trim());
        parametros.append("run", campoRun.value.trim())
        parametros.append("fecha", campoFecha.value);
        parametros.append("horario", campoHorario.value);
        parametros.append("atencion", tipoAtencion.selectedOptions[0].value);
        parametros.append("planServ", planesServicios.selectedOptions[0].value);
        parametros.append("precio", Number(planesServicios.selectedOptions[0].dataset.precio));

        // 💡 2. Definimos la página de destino
        const paginaDestino = "confirmacion.html";

        window.location.href = `${paginaDestino}?${parametros.toString()}`;
    }
}
