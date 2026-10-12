import { useState } from "react";

import pacientes from "../../data/pacientes";

function MisReservas() {

    const [listaPacientes, setListaPacientes] = useState(() => {
        const guardados = localStorage.getItem("pacientes");

        return guardados
            ? JSON.parse(guardados).map(p => ({
                ...p,
                fechaNac: new Date(p.fechaNac)
            }))
            : pacientes;
    });

    const id = Number(localStorage.getItem("pacienteId"));
    const paciente = listaPacientes.find(p => p.id === id);

    return(
        <div className="fondo">
            <div className="fondo-principal">
                <h1>Mis reservas</h1>
                <h5>Consulta y haz un seguimiento de tus atenciones y productos contratados.</h5>

                <div className="card-private">
                    <h3>Reservas pendientes</h3>
                    <div className="p-3">
                        {(paciente.reservas == null || paciente.reservas.length === 0) && (
                                <h6>No hay reservas pendientes.</h6>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MisReservas;