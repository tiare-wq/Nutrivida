import { useEffect, useState } from 'react';
import { solicitar } from '../../api/usuarios';

const vacio = { nombre: '', especialidad: '', correo: '', password: '' };

export default function Profesionales() {
    const [lista, setLista] = useState([]);
    const [datos, setDatos] = useState(vacio);
    const [id, setId] = useState(null);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [ocupado, setOcupado] = useState(false);

    useEffect(() => {
        let vigente = true;
        solicitar('/api/admin/profesionales')
            .then((lista) => {
                if (vigente) {
                    setLista(lista);
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

    function nuevo() {
        setId(null);
        setDatos(vacio);
    }

    async function guardar(evento) {
        evento.preventDefault();
        setOcupado(true);
        setError('');
        setMensaje('');

        try {
            await solicitar(`/api/admin/profesionales${id ? `/${id}` : ''}`, {
                method: id ? 'PUT' : 'POST',
                body: datos,
            });
            setLista(await solicitar('/api/admin/profesionales'));
            nuevo();
            setMensaje('Profesional guardado correctamente.');
        } catch (error) {
            setError(error.message);
        } finally {
            setOcupado(false);
        }
    }

    async function desactivar(profesional) {
        if (
            !window.confirm(
                `¿Desactivar a ${profesional.nombre}? Se revocarán sus sesiones y asignaciones.`,
            )
        ) {
            return;
        }
        setOcupado(true);
        setError('');

        try {
            await solicitar(`/api/admin/profesionales/${profesional.id}`, { method: 'DELETE' });
            setLista(await solicitar('/api/admin/profesionales'));
            setMensaje('Profesional desactivado. Sus mediciones anteriores se conservan.');
        } catch (error) {
            setError(error.message);
        } finally {
            setOcupado(false);
        }
    }

    const campos = [
        ['nombre', 'Nombre completo', 'text'],
        ['especialidad', 'Especialidad', 'text'],
        ['correo', 'Correo electrónico', 'email'],
        ...(!id ? [['password', 'Contraseña inicial', 'password']] : []),
    ];

    return (
        <section className="card-private">
            <h1>Profesionales</h1>
            {error && <p role="alert">{error}</p>}
            {mensaje && <p role="status">{mensaje}</p>}
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Especialidad</th>
                            <th>Correo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lista.map((profesional) => (
                            <tr key={profesional.id}>
                                <td>{profesional.id}</td>
                                <td>{profesional.nombre}</td>
                                <td>{profesional.especialidad}</td>
                                <td>{profesional.correo}</td>
                                <td>{profesional.activo ? 'Activo' : 'Inactivo'}</td>
                                <td>
                                    <button
                                        className="btn btn-outline-success me-2"
                                        onClick={() => {
                                            setId(profesional.id);
                                            setDatos(profesional);
                                        }}
                                    >
                                        Editar {profesional.nombre}
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary"
                                        disabled={ocupado || !profesional.activo}
                                        onClick={() => desactivar(profesional)}
                                    >
                                        Desactivar {profesional.nombre}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <h2>{id ? 'Editar profesional' : 'Crear profesional'}</h2>
            <form onSubmit={guardar}>
                {campos.map(([campo, etiqueta, tipo]) => (
                    <div className="mb-3" key={campo}>
                        <label htmlFor={campo}>{etiqueta}</label>
                        <input
                            id={campo}
                            type={tipo}
                            className="form-control"
                            required
                            value={datos[campo] || ''}
                            minLength={campo === 'password' ? 8 : undefined}
                            maxLength={campo === 'password' ? 72 : 120}
                            onChange={(evento) =>
                                setDatos({ ...datos, [campo]: evento.target.value })
                            }
                        />
                    </div>
                ))}
                <button className="btn btn-success" disabled={ocupado}>
                    Guardar profesional
                </button>{' '}
                <button className="btn btn-secondary" type="button" onClick={nuevo}>
                    Nuevo
                </button>
            </form>
        </section>
    );
}
