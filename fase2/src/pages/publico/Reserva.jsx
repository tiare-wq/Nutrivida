import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Calendario from '../../components/Calendario';
import consultas from '../../data/consultas';
import evaluaciones from '../../data/evaluaciones';
import planes from '../../data/planes';
import talleres from '../../data/talleres';
import { fechaClave, guardarReserva, horaOcupada, pacienteActual } from '../../data/almacen';

const categorias = [
    ['consultas', 'Consulta'],
    ['evaluaciones', 'Evaluación'],
    ['planes', 'Plan especializado'],
    ['talleres', 'Taller grupal']
];
const servicios = [...consultas, ...evaluaciones, ...planes, ...talleres];
const profesionales = [
    ['Carolina Pérez', 'clinico'],
    ['Valentina Soto', 'clinico'],
    ['Camilo Rojas', 'deportivo'],
    ['Daniela Muñoz', 'veg']
];
const horas = ['10:00', '11:00', '12:00'];

function Reserva() {
    const location = useLocation();
    const navigate = useNavigate();
    const paciente = pacienteActual();
    const [atencion, setAtencion] = useState(location.state?.atencion ?? '');
    const [servicio, setServicio] = useState(String(location.state?.servicio ?? ''));
    const [profesional, setProfesional] = useState('');
    const [fecha, setFecha] = useState(() => new Date());
    const [hora, setHora] = useState('');
    const [error, setError] = useState('');

    const elegido = servicios.find(item => item.id === servicio && item.atencion === atencion);
    const compatibles = profesionales.filter(item => item[1] === elegido?.tpProfesional);
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

    function enviar(event) {
        event.preventDefault();
        if (!paciente) {
            navigate('/login', { state: { next: '/reservas', reserva: { atencion, servicio } } });
            return;
        }
        if (!elegido || !profesional || !hora || fecha < hoy || fecha > limite) {
            setError('Selecciona un servicio, profesional, fecha y hora válidos.');
            return;
        }
        const reserva = guardarReserva({
            servicio: elegido.nombre,
            profesional,
            precio: elegido.precio,
            fecha: fechaClave(fecha),
            hora
        });
        if (!reserva) {
            setError('Esa hora ya está reservada. Elige otra disponible.');
            return;
        }
        navigate('/confirmacion-reserva', { state: reserva });
    }

    return <main>
        <div className="d-flex justify-content-center align-items-center">
            <form className="border rounded p-4 shadow bg-white formulario" onSubmit={enviar}>
                <h1 className="subtitulo-form">Reserva tu atención</h1>
                {paciente && <p>Paciente: {paciente.nombre} · ID {paciente.id}</p>}
                <div className="campo">
                    <label htmlFor="atencion-select">Tipo de atención</label>
                    <select id="atencion-select" className="form-dato" value={atencion} onChange={event => {
                        setAtencion(event.target.value); setServicio(''); setProfesional(''); setHora('');
                    }}>
                        <option value="">Selecciona una opción</option>
                        {categorias.map(item => <option key={item[0]} value={item[0]}>{item[1]}</option>)}
                    </select>
                </div>
                <div className="campo">
                    <label htmlFor="servicio-select">Servicio / Plan</label>
                    <select id="servicio-select" className="form-dato" value={servicio} disabled={!atencion} onChange={event => {
                        setServicio(event.target.value); setProfesional(''); setHora('');
                    }}>
                        <option value="">Selecciona una opción</option>
                        {servicios.filter(item => item.atencion === atencion).map(item =>
                            <option key={item.id} value={item.id}>{item.nombre}</option>
                        )}
                    </select>
                </div>
                <div className="campo">
                    <label htmlFor="profesional-select">Profesional</label>
                    <select id="profesional-select" className="form-dato" value={profesional} disabled={!elegido} onChange={event => {
                        setProfesional(event.target.value); setHora('');
                    }}>
                        <option value="">Selecciona una opción</option>
                        {compatibles.map(item => <option key={item[0]} value={item[0]}>{item[0]}</option>)}
                    </select>
                </div>
                {profesional && <>
                    <h2 className="subtitulo-form">Elige fecha y hora</h2>
                    <Calendario fechaInicial={fecha} onFechaSeleccionada={dia => { setFecha(dia); setHora(''); }} />
                    <fieldset className="campo">
                        <legend>Horas disponibles</legend>
                        <div className="form-radio">
                            {horas.map(opcion => <label key={opcion} className="hora-opcion">
                                <input type="radio" name="hora" value={opcion} checked={hora === opcion}
                                    disabled={horaOcupada(profesional, fecha, opcion)} onChange={() => setHora(opcion)} />
                                {opcion}{horaOcupada(profesional, fecha, opcion) ? ' · ocupada' : ''}
                            </label>)}
                        </div>
                    </fieldset>
                </>}
                {error && <p className="alert alert-danger" role="alert">{error}</p>}
                <button type="submit" id="btn-form" className="btn-nutrivida">{paciente ? 'Confirmar reserva' : 'Inicia sesión para reservar'}</button>
            </form>
        </div>
    </main>;
}

export default Reserva;
