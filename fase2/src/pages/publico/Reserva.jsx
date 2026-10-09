import { useState } from "react";

import consultas from '../../data/consultas'
import evaluaciones from '../../data/evaluaciones'
import planes from '../../data/planes'
import talleres from '../../data/talleres'

function Reserva() {

    const planesServicios = document.getElementById('servicio-select');
    const servicios = planesServicios.options;

    const [atencion, setAtencion] = useState('');
    const [campoAtencion, setCampoAtencion] = useState('');

    const [servicio, setServicio] = useState('');
    const [campoServicio, setCampoServicio] = useState('');

    const [error, setError] = useState('');
    const handleSubmit = (event) => {
        event.preventDefault();

        if (atencion === '') {{
            setError('Seleccione un tipo de atención');
            return;
        }}

        setError('');
    }

    const limpiar = (event) => {

    }

    return (
        <main>
            <div className="container justify-content-center reserva">
                <form className="border rounded p-4 shadow bg-white formulario" onSubmit={handleSubmit}>
                    <h1 className="subtitulo-form">Búsqueda por especialidad</h1>

                    <section>

                        <div className="campo">
                            <label for="atencion-select">Tipo de Atención</label>
                            <select name="atencion" id="atencion-select" className="form-select"
                                onChange={(event) => {
                                    const select = event.target
                                    setAtencion(select.value);
                                    setCampoAtencion(select.options[select.selectedIndex].text);
                                    limpiar(event)
                                    if (select.value !== "") {
                                        planesServicios.disabled = false;
                                        for (const servicio of servicios) {
                                            if (select.value === "") {
                                                servicio.hidden = false;
                                                continue;
                                            }
                                            if (servicio.classList.contains(atencion)) {
                                                servicio.hidden = false;
                                            } else {
                                                servicio.hidden = true;
                                            }
                                        }
                                    } else {
                                        planesServicios.disabled = true;
                                    }
                                }}>
                                <option value="" selected disabled>
                                    Seleccione una opción
                                </option>
                                <option value="consultas">
                                    Consulta
                                </option>
                                <option value="evaluaciones">
                                    Evaluación
                                </option>
                                <option value="planes">
                                    Plan especializado
                                </option>
                                <option value="talleres">
                                    Taller grupal
                                </option>
                            </select>
                        </div>

                        <div className="campo">
                            <label for="servicio-select">Servicio / Plan</label>
                            <select name="planes-servicios" id="servicio-select" disabled
                                onChange={(event) => {
                                    const select = event.target
                                    setServicio(select.value);
                                    setCampoServicio(select.options[select.selectedIndex].text);
                                }}>
                                <option value="" selected disabled>
                                    Seleccione una opción
                                </option>
                                {consultas.map((consulta) => (
                                        <option value={consulta.id} className="consultas" data-precio={consulta.precio} data-prof={consulta.tpProfesional}>
                                            {consulta.nombre}
                                        </option>
                                ))}
                                {evaluaciones.map((evaluacion) => (
                                        <option value={evaluacion.id} className="evaluaciones" data-precio={evaluacion.precio} data-prof={evaluacion.tpProfesional}>
                                            {evaluacion.nombre}
                                        </option>
                                ))}
                                {planes.map((plan) => (
                                        <option value={plan.id} className="planes" data-precio={plan.precio} data-prof={plan.tpProfesional}>
                                            {plan.nombre}
                                        </option>
                                ))}
                                {talleres.map((taller) => (
                                        <option value={taller.id} className="talleres" data-precio={taller.precio} data-prof={taller.tpProfesional}>
                                            {taller.nombre}
                                        </option>
                                ))}
                            </select>
                        </div>

                    </section>

                    {error && (<div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <button name="enviar" type="submit" id="enviar" className="btn-nutrivida">
                        Continuar
                    </button>

                </form>
            </div>
        </main>
    )
}

export default Reserva;