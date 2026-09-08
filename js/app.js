const tipoAtencion = document.getElementById("tipo-atencion-select");
const planesServicios = document.getElementById("plan-servicio-select");

const opcionesPlanesServicios = planesServicios.options;

tipoAtencion.onchange = function() {

    const opcionSeleccionada = tipoAtencion.selectedOptions[0];

    if (opcionSeleccionada.classList.contains("consulta-opt")) {
        Array.from(opcionesPlanesServicios).forEach(element => {
            if (element.classList.contains("consulta-serv")) {
                element.classList.remove("d-none");
            } else if(!element.classList.contains("d-none")) {
                element.classList.add("d-none");
            }
        });
    }

    else if (opcionSeleccionada.classList.contains("tipo-ev-opt")) {
        Array.from(opcionesPlanesServicios).forEach(element => {
            if (element.classList.contains("eva-serv")) {
                element.classList.remove("d-none");
            } else if(!element.classList.contains("d-none")) {
                element.classList.add("d-none");
            }
        });
    }

    else if (opcionSeleccionada.classList.contains("tipo-plan-opt")) {
        Array.from(opcionesPlanesServicios).forEach(element => {
            if (element.classList.contains("plan")) {
                element.classList.remove("d-none");
            } else if(!element.classList.contains("d-none")) {
                element.classList.add("d-none");
            }
        });
    }

    else if (opcionSeleccionada.classList.contains("tipo-taller-opt")) {
        Array.from(opcionesPlanesServicios).forEach(element => {
            if (element.classList.contains("taller-serv")) {
                element.classList.remove("d-none");
            } else if(!element.classList.contains("d-none")) {
                element.classList.add("d-none");
            }
        });
    }
}