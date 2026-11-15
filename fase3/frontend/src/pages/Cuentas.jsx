import { useEffect, useState } from 'react';
import { solicitar, renovar } from '../api/usuarios';
import { useSesion } from '../context/sesion';
import CambiarPassword from '../components/CambiarPassword';

export default function Cuentas() {
    const { usuario } = useSesion();
    const [cuentas, setCuentas] = useState([]);
    const [ediciones, setEdiciones] = useState({});
    const [administrador, setAdministrador] = useState(null);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [ocupado, setOcupado] = useState(false);
    const [restablecer, setRestablecer] = useState({ id: '', nueva: '' });

    useEffect(() => {
        let vigente = true;
        solicitar('/api/admin/usuarios')
            .then((lista) => {
                if (vigente) {
                    setCuentas(lista);
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

    function editar(cuenta, campo, valor) {
        setEdiciones((actuales) => ({
            ...actuales,
            [cuenta.id]: { ...(actuales[cuenta.id] || cuenta), [campo]: valor },
        }));
    }

    async function cambiar(cuenta, datos) {
        if (
            !window.confirm(`¿Cambiar los permisos de ${cuenta.nombre}? Se cerrarán sus sesiones.`)
        ) {
            return;
        }
        setOcupado(true);
        setError('');
        setMensaje('');
        try {
            await solicitar(`/api/admin/usuarios/${cuenta.id}/permisos`, {
                method: 'PATCH',
                body: {
                    rol: cuenta.rol,
                    activo: cuenta.activo,
                    especialidad: cuenta.especialidad,
                    cargo: cuenta.cargo,
                    ...datos,
                },
            });
            setCuentas(await solicitar('/api/admin/usuarios'));
            setEdiciones({});
            setMensaje('Permisos actualizados. Las sesiones anteriores fueron revocadas.');
        } catch (error) {
            setError(error.message);
        } finally {
            setOcupado(false);
        }
    }

    async function guardarAdministrador(evento) {
        evento.preventDefault();
        setOcupado(true);
        setError('');
        setMensaje('');
        try {
            await solicitar(`/api/admin/usuarios/${administrador.id}/administracion`, {
                method: 'PUT',
                body: administrador,
            });
            setCuentas(await solicitar('/api/admin/usuarios'));
            if (administrador.id === usuario.id) {
                await renovar();
            }
            setAdministrador(null);
            setMensaje('Datos de administración actualizados.');
        } catch (error) {
            setError(error.message);
        } finally {
            setOcupado(false);
        }
    }

    async function restablecerPassword(evento) {
        evento.preventDefault();
        const cuenta = cuentas.find((c) => String(c.id) === restablecer.id);
        if (
            !cuenta ||
            !window.confirm(
                `¿Restablecer la contraseña de ${cuenta.nombre}? Se cerrarán sus sesiones.`,
            )
        ) {
            return;
        }
        setOcupado(true);
        setError('');
        setMensaje('');
        try {
            await solicitar(`/api/admin/usuarios/${cuenta.id}/password`, {
                method: 'PUT',
                body: { nueva: restablecer.nueva },
            });
            setRestablecer({ id: '', nueva: '' });
            setMensaje(
                `Contraseña de ${cuenta.nombre} restablecida. Sus sesiones fueron cerradas.`,
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setOcupado(false);
        }
    }

    return (
        <section className="card-private">
            <h1>Cuentas y permisos</h1>
            <p>Roles PACIENTE, ADMIN y PROFESIONAL. No puedes cambiar tus propios permisos.</p>
            {error && <p role="alert">{error}</p>}
            {mensaje && <p role="status">{mensaje}</p>}
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Rol y datos del cargo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cuentas.map((cuenta) => {
                            const datos = ediciones[cuenta.id] || cuenta;
                            const bloqueado = ocupado || cuenta.id === usuario.id;
                            return (
                                <tr key={cuenta.id}>
                                    <td>{cuenta.id}</td>
                                    <td>{cuenta.nombre}</td>
                                    <td>{cuenta.correo}</td>
                                    <td>
                                        <select
                                            className="form-select"
                                            aria-label={`Rol de ${cuenta.nombre}`}
                                            value={datos.rol}
                                            disabled={bloqueado}
                                            onChange={(evento) =>
                                                editar(cuenta, 'rol', evento.target.value)
                                            }
                                        >
                                            <option value="PACIENTE">PACIENTE</option>
                                            <option value="ADMIN">ADMIN</option>
                                            <option value="PROFESIONAL">PROFESIONAL</option>
                                        </select>
                                        {datos.rol === 'PROFESIONAL' && (
                                            <input
                                                className="form-control mt-2"
                                                aria-label={`Especialidad de ${cuenta.nombre}`}
                                                value={datos.especialidad || ''}
                                                disabled={bloqueado}
                                                onChange={(evento) =>
                                                    editar(
                                                        cuenta,
                                                        'especialidad',
                                                        evento.target.value,
                                                    )
                                                }
                                            />
                                        )}
                                        {datos.rol === 'ADMIN' && (
                                            <p>Cargo: {cuenta.cargo || 'Administración'}</p>
                                        )}
                                    </td>
                                    <td>{cuenta.activo ? 'Activo' : 'Inactivo'}</td>
                                    <td>
                                        <button
                                            className="btn btn-outline-success mb-2"
                                            disabled={bloqueado}
                                            onClick={() =>
                                                cambiar(cuenta, {
                                                    rol: datos.rol,
                                                    especialidad: datos.especialidad,
                                                    cargo: datos.cargo,
                                                })
                                            }
                                        >
                                            Cambiar rol de {cuenta.nombre}
                                        </button>
                                        <button
                                            className="btn btn-outline-secondary mb-2"
                                            disabled={bloqueado}
                                            onClick={() =>
                                                cambiar(cuenta, { activo: !cuenta.activo })
                                            }
                                        >
                                            {cuenta.activo ? 'Desactivar' : 'Activar'}{' '}
                                            {cuenta.nombre}
                                        </button>
                                        {cuenta.rol === 'ADMIN' && (
                                            <button
                                                className="btn btn-outline-success"
                                                onClick={() =>
                                                    setAdministrador({
                                                        id: cuenta.id,
                                                        nombre: cuenta.nombre,
                                                        cargo: cuenta.cargo || 'Administración',
                                                    })
                                                }
                                            >
                                                Editar datos de {cuenta.nombre}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {administrador && (
                <form onSubmit={guardarAdministrador}>
                    <h2>Datos de administración</h2>
                    <p>Código o ID: {administrador.id}</p>
                    <label htmlFor="nombre-administrador">Nombre del administrador</label>
                    <input
                        id="nombre-administrador"
                        className="form-control mb-3"
                        required
                        minLength={3}
                        maxLength={120}
                        value={administrador.nombre}
                        onChange={(evento) =>
                            setAdministrador({
                                ...administrador,
                                nombre: evento.target.value,
                            })
                        }
                    />
                    <label htmlFor="cargo-administrador">Cargo del administrador</label>
                    <input
                        id="cargo-administrador"
                        className="form-control mb-3"
                        required
                        maxLength={120}
                        value={administrador.cargo}
                        onChange={(evento) =>
                            setAdministrador({
                                ...administrador,
                                cargo: evento.target.value,
                            })
                        }
                    />
                    <button className="btn btn-success" disabled={ocupado}>
                        Guardar datos de administración
                    </button>
                </form>
            )}
            <form onSubmit={restablecerPassword}>
                <h2>Restablecer contraseña de una cuenta</h2>
                <label htmlFor="cuenta-restablecer">Cuenta</label>
                <select
                    id="cuenta-restablecer"
                    className="form-select mb-3"
                    required
                    value={restablecer.id}
                    onChange={(evento) =>
                        setRestablecer({ ...restablecer, id: evento.target.value })
                    }
                >
                    <option value="">Selecciona una cuenta</option>
                    {cuentas
                        .filter((cuenta) => cuenta.id !== usuario.id)
                        .map((cuenta) => (
                            <option key={cuenta.id} value={cuenta.id}>
                                {cuenta.nombre} · {cuenta.correo}
                            </option>
                        ))}
                </select>
                <label htmlFor="password-restablecer">Contraseña nueva de la cuenta</label>
                <input
                    id="password-restablecer"
                    className="form-control mb-3"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    maxLength={72}
                    value={restablecer.nueva}
                    onChange={(evento) =>
                        setRestablecer({ ...restablecer, nueva: evento.target.value })
                    }
                />
                <button className="btn btn-success" disabled={ocupado}>
                    Restablecer contraseña
                </button>
            </form>
            <CambiarPassword />
        </section>
    );
}
