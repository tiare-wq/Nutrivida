import { useState } from "react";

import { guardarPacientes, leerPacientes } from '../../data/almacen';

function PerfilPaciente() {

    const [listaPacientes, setListaPacientes] = useState(() => {
        return leerPacientes().map(p => ({
                ...p,
                fechaNac: new Date(p.fechaNac)
            }));
    });

    const id = Number(localStorage.getItem("pacienteId"));
    const paciente = listaPacientes.find(p => p.id === id);

    const nombreActual = paciente.nombre;
    const correoActual = paciente.correo;

    let fecha = paciente.fechaNac;
    const opciones = {day: '2-digit', month: '2-digit', year: 'numeric'};
    let formateada = new Intl.DateTimeFormat('es-CL', opciones).format(fecha);

    const fechaLimite = new Date();
    fechaLimite.setHours(0, 0, 0, 0);
    fechaLimite.setFullYear(fechaLimite.getFullYear() - 16);

    const [nombre, setNombre] = useState(paciente.nombre);
    const [run, setRun] = useState(paciente.rut);
    const [fechaNac, setFechaNac] = useState(formateada);
    const [telefono, setTelefono] = useState(paciente.telefono);
    const [correo, setCorreo] = useState(paciente.correo);
    const foto = paciente.foto;

    const [succes, setSucces] = useState('');

    const [error, setError] = useState('');
    const runPattern = /^\d{7,8}-[0-9kK]$/;
    const correoPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefonoPattern = /^\+569\d{8}$/;
    const fechaPattern = /^\d{2}-\d{2}-\d{4}$/;

    const handleError = (event) => {
        event.preventDefault();

        setSucces('');

        if (nombre.trim() === '') {
            setError('Este campo no puede estar vacío');
            return;
        }

        const runValido = runPattern.test(run.trim());
        if (!runValido) {
            setError('El formato del RUN no es válido. Por favor, ingrese su RUN sin puntos y con guión.');
            return;
        }

        const telefonoValido = telefonoPattern.test(telefono.replaceAll(' ', ''));
        if (!telefonoValido) {
            setError('El formato del teléfono no es válido. Por favor, ingrese un teléfono con el siguiente formato +56 9 XXXX XXXX.')
            return;
        }

        const correoValido = correoPattern.test(correo.trim());
        if (!correoValido) {
            setError('Ingrese un correo válido');
            return;
        }

        const fechaValida = fechaPattern.test(fechaNac.trim());
        if (!fechaValida) {
            setError('El formato de la fecha no es válida. Por favor, ingrese una fecha en el siguiente formato DD-MM-YYYY');
            return;
        }

        const [dia, mes, anio] = fechaNac.split('-');
        const fechaDate = new Date(anio, mes - 1, dia);
        if (fechaDate > fechaLimite) {
            setError('La edad mínima es de 16 años');
            return;
        }
        setError('');
        setSucces('Se han actualizado los datos correctamente.');
        editar(fechaDate);
    }

    const editar = (fechaDate) => {
        const actualizados = listaPacientes.map(p =>
            p.id === id
                ? {
                    ...p,
                    nombre,
                    rut: run,
                    correo,
                    telefono,
                    fechaNac: fechaDate
                }
                : p
        );

        setListaPacientes(actualizados);

        guardarPacientes(actualizados);
    };

    return (
        <div className="fondo">
            <div className="fondo-principal">
                <h1>Mi perfil</h1>
                <h5>Consulta y edita tu información personal.</h5>

                <div className="card-private head-perfil">
                    <div>
                        <img src={foto} alt="Foto de perfil" className="foto-perfil" />
                    </div>
                    <div className="mensaje-bienvenida">
                        <h4>¡Hola {nombreActual}!</h4>
                        <h6>{correoActual} · ID {id}</h6>
                    </div>
                </div>

                <form className="card-private" onSubmit={handleError}>
                    <div className="head-editar">
                        <h4>Mis datos personales</h4>
                        <button type="submit" className="btn-perfil">
                            <img src="../../img/editar.png" alt="Editar" className="icono" />
                            Editar
                        </button>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-6 campo-perfil">
                            <label htmlFor="nombre">
                                <img src="../../img/perfil.png" alt="Nombre" className="icono" />
                                <p>Nombre</p>
                            </label>
                            <input type="text" id="nombre" className="form-control" value={nombre} aria-label="Nombre"
                            onChange={(event) => setNombre(event.target.value)}></input>
                        </div>
                        <div className="col-md-6 campo-perfil">
                            <label htmlFor="telefono">
                                <img src="../../img/telefono.png" alt="Teléfono" className="icono" />
                                <p>Teléfono</p>
                            </label>
                            <input type="text" id="telefono" className="form-control" value={telefono} aria-label="Teléfono"
                            onChange={(event) => setTelefono(event.target.value)}></input>
                        </div>
                        <div className="col-md-6 campo-perfil">
                            <label htmlFor="run">
                                <img src="../../img/credencial.png" alt="Run" className="icono" />
                                <p>Run</p>
                            </label>
                            <input type="text" id="run" className="form-control" value={run} aria-label="Run"
                            onChange={(event) => setRun(event.target.value)}></input>
                        </div>
                        <div className="col-md-6 campo-perfil">
                            <label htmlFor="correo">
                                <img src="../../img/correo.png" alt="Correo" className="icono" />
                                <p>Correo</p>
                            </label>
                            <input type="text" id="correo" className="form-control" value={correo} aria-label="Correo"
                            onChange={(event) => setCorreo(event.target.value)}></input>
                        </div>
                        <div className="col-md-6 campo-perfil">
                            <label htmlFor="fecha">
                                <img src="../../img/calendario.png" alt="Calendario" className="icono" />
                                <p>Fecha de nacimiento</p>
                            </label>
                            <input type="text" id="fecha" className="form-control" value={fechaNac} aria-label="Fecha de nacimiento"
                            onChange={(event) => setFechaNac(event.target.value)}></input>
                        </div>
                    </div>
                    {
                        error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}
                    {
                        succes && (
                            <div className="alert alert-success">
                                {succes}
                            </div>
                        )
                    }
                </form>
            </div>
        </div>
    )
}
export default PerfilPaciente;
