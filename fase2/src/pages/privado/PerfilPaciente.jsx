import { useLocation } from "react-router-dom";
import { useState } from "react";

function PerfilPaciente() {

    const location = useLocation();
    const paciente = location.state.paciente;

    let nombre = paciente.nombre;
    let run = paciente.rut;

    let fechaNac = paciente.fechaNac;
    const opciones = {day: '2-digit', month: '2-digit', year: 'numeric'};
    let formateada = new Intl.DateTimeFormat('es-CL', opciones).format(fechaNac);
    
    let telefono = paciente.telefono;
    let correo = paciente.correo;
    let foto = paciente.foto;

    const [campoNombre, setCampoNombre] = useState(nombre);
    const [campoRun, setcampoRun] = useState(run);
    const [campoFechaNac, setCampoFechaNac] = useState(fechaNac);
    const [campoTelefono, setCampoTelefono] = useState(telefono);
    const [campoCorreo, setCampoCorreo] = useState(correo);
    const [error, setError] = useState('');

    const handleError = () => {

        setError('');
    }

    const editar = () => {

    }

    return (
        <div className="fondo">
            <div className="fondo-principal">
                <h1>Mi perfil</h1>
                <h5>Consulta y edita tu información personal.</h5>

                <div className="card-perfil head-perfil">
                    <div>
                        <img src={foto} alt="Foto de perfil" className="foto-perfil" />
                    </div>
                    <div className="mensaje-bienvenida">
                        <h4>¡Hola {nombre}!</h4>
                        <h6>{correo}</h6>
                    </div>
                </div>

                <div className="card-perfil">
                    <div className="head-editar">
                        <h4>Mis datos personales</h4>
                        <button className="btn-perfil">
                            <img src="../../img/editar.png" alt="Editar" className="icono" />
                            Editar
                        </button>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <input type="text" class="form-control" placeholder={nombre} aria-label="Nombre"
                            onChange={(event) => setCampoNombre(event.target.value)}></input>
                        </div>
                        <div class="col-md-6">
                            <input type="text" class="form-control" placeholder={telefono} aria-label="Teléfono"
                            onChange={(event) => setCampoTelefono(event.target.value)}></input>
                        </div>
                        <div class="col-md-6">
                            <input type="text" class="form-control" placeholder={run} aria-label="Run"
                            onChange={(event) => setCampoRun(event.target.value)}></input>
                        </div>
                        <div class="col-md-6">
                            <input type="text" class="form-control" placeholder={correo} aria-label="Correo"
                            onChange={(event) => setCampoCorreo(event.target.value)}></input>
                        </div>
                        <div class="col-md-6">
                            <input type="text" class="form-control" placeholder={formateada} aria-label="Fecha de nacimiento"
                            onChange={(event) => setCampoFechaNac(event.target.value)}></input>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PerfilPaciente;