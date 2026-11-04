import { useEffect, useState } from 'react';
import { solicitar } from '../../api/usuarios';
import CamposPaciente from '../../components/CamposPaciente';
import CambiarPassword from '../../components/CambiarPassword';
import HistorialMediciones from '../../components/HistorialMediciones';
import '../../css/atencion.css';

function nuevaMedicion() {
    const hoy = new Date();
    const fecha = [
        hoy.getFullYear(),
        String(hoy.getMonth() + 1).padStart(2, '0'),
        String(hoy.getDate()).padStart(2, '0'),
    ].join('-');
    return { fecha, estaturaCm: '', pesoKg: '', cinturaCm: '', caderaCm: '' };
}

export default function Atencion() {
    const [buscar, setBuscar] = useState('');
    const [pacientes, setPacientes] = useState([]);
    const [informe, setInforme] = useState(null);
    const [perfil, setPerfil] = useState(null);
    const [medicion, setMedicion] = useState(nuevaMedicion);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [ocupado, setOcupado] = useState(false);
    const [editando, setEditando] = useState(null);

    useEffect(() => {
        let vigente = true;
        solicitar('/api/profesionales/pacientes')
            .then((lista) => {
                if (vigente) {
                    setPacientes(lista);
                }
            })
            .catch((error) => {
                if (vigente) {
                    setError(error.message);
                }
            });
        return () => {
            vigente = false;
        };
    }, []);

    async function buscarPacientes(evento) {
        evento.preventDefault();
        setOcupado(true);
        setError('');
        try {
            setPacientes(
                await solicitar(
                    `/api/profesionales/pacientes?buscar=${encodeURIComponent(buscar)}`,
                ),
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setOcupado(false);
        }
    }

    async function abrir(paciente) {
        setOcupado(true);
        setInforme(null);
        setError('');
        setMensaje('');
        try {
            const datos = await solicitar(`/api/profesionales/pacientes/${paciente.id}`);
            setInforme(datos);
            setPerfil(datos.paciente);
            setMedicion(nuevaMedicion());
            setEditando(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setOcupado(false);
        }
    }

    async function editarPaciente(evento) {
        evento.preventDefault();
        setOcupado(true);
        setError('');
        setMensaje('');
        try {
            const paciente = await solicitar(`/api/profesionales/pacientes/${perfil.id}`, {
                method: 'PUT',
                body: perfil,
            });
            setPerfil(paciente);
            setInforme({ ...informe, paciente });
            setPacientes((lista) =>
                lista.map((item) => (item.id === paciente.id ? paciente : item)),
            );
            setMensaje('Información del paciente actualizada.');
        } catch (error) {
            setError(error.message);
        } finally {
            setOcupado(false);
        }
    }

    async function registrarMedicion(evento) {
        evento.preventDefault();
        setOcupado(true);
        setError('');
        setMensaje('');
        const datos = { fecha: medicion.fecha };
        for (const campo of ['estaturaCm', 'pesoKg', 'cinturaCm', 'caderaCm']) {
            datos[campo] = Number(medicion[campo]);
        }
        const ruta = `/api/profesionales/pacientes/${perfil.id}/mediciones`;
        try {
            await solicitar(editando ? `${ruta}/${editando}` : ruta, {
                method: editando ? 'PUT' : 'POST',
                body: datos,
            });
            setInforme(await solicitar(`/api/profesionales/pacientes/${perfil.id}`));
            setMedicion(nuevaMedicion());
            setMensaje(
                editando
                    ? 'Medición actualizada correctamente.'
                    : 'Medición registrada correctamente.',
            );
            setEditando(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setOcupado(false);
        }
    }

    function editarMedicion(existente) {
        setError('');
        setMensaje('');
        setEditando(existente.id);
        setMedicion({
            fecha: existente.fecha,
            estaturaCm: String(existente.estaturaCm),
            pesoKg: String(existente.pesoKg),
            cinturaCm: String(existente.cinturaCm),
            caderaCm: String(existente.caderaCm),
        });
    }

    function cancelarEdicion() {
        setEditando(null);
        setMedicion(nuevaMedicion());
    }

    async function eliminarMedicion(existente) {
        if (!window.confirm(`¿Eliminar la medición del ${existente.fecha}?`)) {
            return;
        }
        setOcupado(true);
        setError('');
        setMensaje('');
        try {
            await solicitar(
                `/api/profesionales/pacientes/${perfil.id}/mediciones/${existente.id}`,
                {
                    method: 'DELETE',
                },
            );
            setInforme(await solicitar(`/api/profesionales/pacientes/${perfil.id}`));
            if (editando === existente.id) {
                cancelarEdicion();
            }
            setMensaje('Medición eliminada correctamente.');
        } catch (error) {
            setError(error.message);
        } finally {
            setOcupado(false);
        }
    }

    const medidas = [
        ['estaturaCm', 'Estatura en centímetros'],
        ['pesoKg', 'Peso en kilogramos'],
        ['cinturaCm', 'Cintura en centímetros'],
        ['caderaCm', 'Cadera en centímetros'],
    ];

    return (
        <section className="card-private atencion">
            <h1>Atención de pacientes</h1>
            <p>Busca por ID o nombre entre los pacientes que tienes asignados.</p>
            {error && <p role="alert">{error}</p>}
            {mensaje && <p role="status">{mensaje}</p>}
            <form className="busqueda-pacientes" onSubmit={buscarPacientes}>
                <label htmlFor="buscar-paciente">ID o nombre del paciente</label>
                <input
                    id="buscar-paciente"
                    className="form-control"
                    value={buscar}
                    onChange={(evento) => setBuscar(evento.target.value)}
                />
                <button className="btn btn-success" disabled={ocupado}>
                    Buscar pacientes
                </button>
            </form>
            {pacientes.length === 0 && <p>No hay pacientes que coincidan con la búsqueda.</p>}
            <ul className="pacientes-asignados">
                {pacientes.map((paciente) => (
                    <li key={paciente.id}>
                        <span>
                            ID {paciente.id} · {paciente.nombre}
                        </span>
                        <button
                            className="btn btn-outline-success"
                            disabled={ocupado}
                            onClick={() => abrir(paciente)}
                        >
                            Abrir ficha de {paciente.nombre}
                        </button>
                    </li>
                ))}
            </ul>
            {informe && (
                <section aria-label="Informe detallado del paciente">
                    <h2>Informe de {informe.paciente.nombre}</h2>
                    <p>ID del paciente: {informe.paciente.id}</p>
                    <HistorialMediciones
                        mediciones={informe.mediciones}
                        onEditar={editarMedicion}
                        onEliminar={eliminarMedicion}
                    />
                    <h2>{editando ? 'Editar medición' : 'Registrar nuevas medidas'}</h2>
                    <form onSubmit={registrarMedicion}>
                        <label htmlFor="fecha-medicion">Fecha de medición</label>
                        <input
                            id="fecha-medicion"
                            className="form-control mb-3"
                            type="date"
                            value={medicion.fecha}
                            required
                            onChange={(evento) =>
                                setMedicion({
                                    ...medicion,
                                    fecha: evento.target.value,
                                })
                            }
                        />
                        {medidas.map(([campo, etiqueta]) => (
                            <div className="mb-3" key={campo}>
                                <label htmlFor={campo}>{etiqueta}</label>
                                <input
                                    id={campo}
                                    className="form-control"
                                    type="number"
                                    min="0.01"
                                    max="999.99"
                                    step="0.01"
                                    required
                                    value={medicion[campo]}
                                    onChange={(evento) =>
                                        setMedicion({
                                            ...medicion,
                                            [campo]: evento.target.value,
                                        })
                                    }
                                />
                            </div>
                        ))}
                        <button className="btn btn-success" disabled={ocupado}>
                            {editando ? 'Guardar cambios de la medición' : 'Registrar medición'}
                        </button>
                        {editando && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary ms-2"
                                onClick={cancelarEdicion}
                            >
                                Cancelar edición
                            </button>
                        )}
                    </form>
                    <h2>Editar información del paciente</h2>
                    <form onSubmit={editarPaciente}>
                        <CamposPaciente datos={perfil} cambiar={setPerfil} />
                        <button className="btn btn-success" disabled={ocupado}>
                            Guardar información del paciente
                        </button>
                    </form>
                </section>
            )}
            <CambiarPassword />
        </section>
    );
}
