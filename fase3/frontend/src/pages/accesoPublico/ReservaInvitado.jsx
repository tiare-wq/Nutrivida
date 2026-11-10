import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Calendario from '../../components/Calendario';
import consultas from '../../data/consultas';
import evaluaciones from '../../data/evaluaciones';
import planes from '../../data/planes';
import talleres from '../../data/talleres';
import { fechaClave, guardarReservaInvitado, horaOcupada, TipoPaciente } from '../../data/almacen';

const categorias = [
    ['consultas', 'Consulta'],
    ['evaluaciones', 'Evaluación'],
    ['planes', 'Plan especializado'],
    ['talleres', 'Taller grupal'],
];
const servicios = [...consultas, ...evaluaciones, ...planes, ...talleres];
const profesionales = [
    ['Carolina Pérez', 'clinico'],
    ['Valentina Soto', 'clinico'],
    ['Camilo Rojas', 'deportivo'],
    ['Daniela Muñoz', 'veg'],
];
const horas = ['10:00', '11:00', '12:00'];

function ReservaInvitado() {
    const location = useLocation();
    const navigate = useNavigate();
    const [atencion, setAtencion] = useState(location.state?.atencion ?? '');
    const [servicio, setServicio] = useState(String(location.state?.servicio ?? ''));
    const [profesional, setProfesional] = useState('');
    const [fecha, setFecha] = useState(() => new Date());
    const [hora, setHora] = useState('');
    const [nombre, setNombre] = useState('');
    const [run, setRun] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [error, setError] = useState('');

    const elegido = servicios.find((item) => item.id === servicio && item.atencion === atencion);
    const compatibles = profesionales.filter((item) => item[1] === elegido?.tpProfesional);
    const [hoy] = useState(() => {
        const dia = new Date();
        dia.setHours(0, 0, 0, 0);
        return dia;
    });
    const [limite] = useState(() => {
        const dia = new Date();
        dia.setMonth(dia.getMonth() + 3);
        return dia;
    });

    const runPattern = /^[0-9]\d{7,8}-[0-9kK]$/;

    function enviar(event) {
        event.preventDefault();
        if (!elegido || !profesional || !hora || fecha < hoy || fecha > limite) {
            setError('Selecciona un servicio, profesional, fecha y hora válidos.');
            return;
        }
        if (!nombre || !run || !telefono || !email) {
            setError('Todos los cambios son obligatorios');
            return;
        }
        if (nombre.length < 4) {
            setError('El nombre es demasiado corto');
            return;
        }
        if (telefono.length < 9) {
            setError('Ingrese un número de teléfono válido');
            return;
        }
        if (!run.match(runPattern)) {
            setError('Ingrese un RUN válido');
            return;
        }
        const reserva = guardarReservaInvitado({
            servicio: elegido.nombre,
            profesional,
            precio: elegido.precio,
            fecha: fechaClave(fecha),
            hora,
            nombre,
            run,
            email,
            telefono,
            tipoPaciente: TipoPaciente.INVITADO

        });
        if (!reserva) {
            setError('Esa hora ya está reservada. Elige otra disponible.');
            return;
        }
        navigate('/confirmacion-reserva', { state: reserva });
    }

    return (
        <main>
            <div className="d-flex justify-content-center align-items-center page min-vh-100">
                <form className="border rounded p-4 shadow bg-white formulario" onSubmit={enviar}>
                    <h1 className="subtitulo-form">Reserva tu atención</h1>
                    <div className="campo">
                        <label htmlFor="atencion-select">Tipo de atención</label>
                        <select
                            id="atencion-select"
                            className="form-dato"
                            value={atencion}
                            onChange={(event) => {
                                setAtencion(event.target.value);
                                setServicio('');
                                setProfesional('');
                                setHora('');
                            }}
                        >
                            <option value="">Selecciona una opción</option>
                            {categorias.map((item) => (
                                <option key={item[0]} value={item[0]}>
                                    {item[1]}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="campo">
                        <label htmlFor="servicio-select">Servicio / Plan</label>
                        <select
                            id="servicio-select"
                            className="form-dato"
                            value={servicio}
                            disabled={!atencion}
                            onChange={(event) => {
                                setServicio(event.target.value);
                                setProfesional('');
                                setHora('');
                            }}
                        >
                            <option value="">Selecciona una opción</option>
                            {servicios
                                .filter((item) => item.atencion === atencion)
                                .map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.nombre}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="campo">
                        <label htmlFor="profesional-select">Profesional</label>
                        <select
                            id="profesional-select"
                            className="form-dato"
                            value={profesional}
                            disabled={!elegido}
                            onChange={(event) => {
                                setProfesional(event.target.value);
                                setHora('');
                            }}
                        >
                            <option value="">Selecciona una opción</option>
                            {compatibles.map((item) => (
                                <option key={item[0]} value={item[0]}>
                                    {item[0]}
                                </option>
                            ))}
                        </select>
                    </div>
                    {profesional && (
                        <>
                            <h2 className="subtitulo-form">Elige fecha y hora</h2>
                            <Calendario
                                fechaInicial={fecha}
                                onFechaSeleccionada={(dia) => {
                                    setFecha(dia);
                                    setHora('');
                                }}
                            />
                            <fieldset className="campo">
                                <legend>Horas disponibles</legend>
                                <div className="form-radio">
                                    {horas.map((opcion) => (
                                        <label key={opcion} className="hora-opcion">
                                            <input
                                                type="radio"
                                                name="hora"
                                                value={opcion}
                                                checked={hora === opcion}
                                                disabled={horaOcupada(profesional, fecha, opcion)}
                                                onChange={() => setHora(opcion)}
                                            />
                                            {opcion}
                                            {horaOcupada(profesional, fecha, opcion)
                                                ? ' · ocupada'
                                                : ''}
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                        </>
                    )}

                    {hora && (
                        <>
                            <h2 className="subtitulo-form">Datos de Contacto</h2>

                            <div className="campo">
                                <label htmlFor="nombre">Nombre</label>
                                <input
                                    name="nombre"
                                    type="text"
                                    id="nombre"
                                    value={nombre}
                                    placeholder="Ingrese su nombre"
                                    onChange={(element) =>
                                setNombre(element.target.value)}
                                    required
                                />
                            </div>

                            <div className="campo">
                                <label htmlFor="run">RUN</label>
                                <input
                                    name="run"
                                    type="text"
                                    id="run"
                                    value={run}
                                    placeholder="11111111-1"
                                onChange={(element) =>
                                setRun(element.target.value)}
                                    required
                                />
                            </div>

                            <div className="campo">
                                <label htmlFor="correo">Correo</label>
                                <input
                                    name="correo"
                                    type="email"
                                    id="correo"
                                    value={email}
                                    placeholder="example@gmail.com"
                                    onChange={(element) =>
                                setEmail(element.target.value)}
                                    required
                                />
                            </div>

                            <label htmlFor="telefono">Teléfono</label>
                            <div className="telefono-container">
                                <span className="codigo-pais">+56</span>
                                <input
                                    id="telefono"
                                    type="tel"
                                    value={telefono}
                                    onChange={(e) =>
                                        setTelefono(e.target.value.replace(/\D/g, '').slice(0, 9))
                                    }
                                    autoComplete="tel-national"
                                    inputMode="numeric"
                                    pattern="9[0-9]{8}"
                                    maxLength={9}
                                    placeholder="912345678"
                                    required
                                />
                            </div>
                        </>
                    )}
                    {error && (
                        <p className="alert alert-danger" role="alert">
                            {error}
                        </p>
                    )}
                    <button type="submit" id="btn-form" className="btn-nutrivida">
                        Confirmar reserva
                    </button>
                </form>
            </div>
        </main>
    );
}

export default ReservaPaciente;
