import { useState } from "react";

import { buscarConsultaPorId, buscarEvaluacionPorId, buscarPlanesPorId, buscarTallerPorId, buscarTallerPorIda } from '../../data/servicios.js';

function BuscarPorID() {
    const [search, setSearch] = useState("");
    const [servicio, setServicio] = useState(null);

    const [nombre, setNombre] = useState(servicio.id? servicio.id : "");
    const [descr, setDescr] = useState(servicio.descr? servicio.descr : "");
    const [tpProfesional, setTpProfesional] = useState(servicio.tpProfesional ? servicio.tpProfesional : "");
    const [duracion, setDuracion] = useState(servicio.duracion? servicio.duracion : "");
    const [modalidad, setModalidad] = useState(servicio.modalidad? servicio.modalidad : "");
    const [precio, setPrecio] = useState(servicio.precio? servicio.precio : "");
    const [accion, setAccion] = useState(servicio.accion? servicio.accion : null);

    const onSubmit = () => {
        var id = search.toUpperCase();

        if(id.startsWith('C') {
            setServicio(buscarConsultaPorId(id));
        } else if (id.startsWith('E')) {
            setServicio(buscarEvaluacionPorId(id));
        } else if (id.startsWith('P')) {
            setServicio(buscarPlanesPorId(id));
        } else if(id.startsWith('T')) {
            setServicio(buscarTallerPorId(id));
        }
    }

    return (
        <div>
            <form>
                <label htmlFor="buscar">ID del servicio</label>
                <input id="buscar" type="search" placeholder="C1"/>
                <button type="submit" onClick={onSubmit}>Buscar</button>
            </form>
            {servicio != null && <div>
                (
        descr: "Evaluación inicial. Anamnesis, antropometría completa y diseño del primer plan alimenticio.",
        tpProfesional: "clinico",
        duracion: "50 min",
        modalidad: "Presencial",
        precio: "35.000",
        accion: accReserva
                )
                    <form class="row g-3">
                        <div class="col-md-4">
                            <label for="validationServer01" class="form-label">Nombre servicio</label>
                            <input type="text" class="form-control is-valid" id="validationServer01" value={nombre} required
                            onChange={ event =>
                                setNombre(event.target.value)}/>
                        </div>
                        <div class="col-md-4">
                            <label for="validationServer02" class="form-label">Descripción</label>
                            <textarea tclass="form-control is-valid" id="validationServer02" value={descr} required
                            onChange={event =>
                                setDescr(event.target.value)
                            }/>
                        </div>
                        <div class="col-md-4">
                            <label for="validationServerUsername" class="form-label">Tipo de profesional</label>
                            <div class="input-group has-validation">
                            <span class="input-group-text" id="inputGroupPrepend3">@</span>
                            <input type="text" class="form-control is-invalid" id="validationServerUsername" aria-describedby="inputGroupPrepend3 validationServerUsernameFeedback" required>
                            <div id="validationServerUsernameFeedback" class="invalid-feedback">
                                Please choose a username.
                            </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label for="validationServer03" class="form-label">City</label>
                            <input type="text" class="form-control is-invalid" id="validationServer03" aria-describedby="validationServer03Feedback" required>
                            <div id="validationServer03Feedback" class="invalid-feedback">
                            Please provide a valid city.
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label for="validationServer04" class="form-label">State</label>
                            <select class="form-select is-invalid" id="validationServer04" aria-describedby="validationServer04Feedback" required>
                            <option selected disabled value="">Choose...</option>
                            <option>...</option>
                            </select>
                            <div id="validationServer04Feedback" class="invalid-feedback">
                            Please select a valid state.
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label for="validationServer05" class="form-label">Zip</label>
                            <input type="text" class="form-control is-invalid" id="validationServer05" aria-describedby="validationServer05Feedback" required>
                            <div id="validationServer05Feedback" class="invalid-feedback">
                            Please provide a valid zip.
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-check">
                            <input class="form-check-input is-invalid" type="checkbox" value="" id="invalidCheck3" aria-describedby="invalidCheck3Feedback" required>
                            <label class="form-check-label" for="invalidCheck3">
                                Agree to terms and conditions
                            </label>
                            <div id="invalidCheck3Feedback" class="invalid-feedback">
                                You must agree before submitting.
                            </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <button class="btn btn-primary" type="submit">Submit form</button>
                        </div>
                        </form>
                </div>}
        </div>
    )
}

export default BuscarPorID;