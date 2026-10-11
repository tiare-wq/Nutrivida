import { useState, useEffect } from "react";

import Calendario from '../../components/Calendario';

import consultas from '../../data/consultas';
import evaluaciones from '../../data/evaluaciones';
import planes from '../../data/planes';
import talleres from '../../data/talleres';
import { useLocation } from "react-router-dom";

function Reserva() {
    const location = useLocation();

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const limiteReservas = new Date(hoy);
    limiteReservas.setMonth(limiteReservas.getMonth() + 3);

    const [atencion, setAtencion] = useState('');
    const [campoAtencion, setCampoAtencion] = useState('');

    const [servicio, setServicio] = useState('');
    const [campoServicio, setCampoServicio] = useState('');

    const [profesional, setProfesional] = useState('');
    const [campoProfesional, setCampoProfesional] = useState('');

    const [campoFecha, setCampoFecha] = useState(hoy);

    const [campoHora, setCampoHora] = useState('1')

    const [nombre, setNombre] = useState('');
    const [run, setRun] = useState('');
    const [correo, setCorreo] = useState('');
    
    // CARGAR DATOS
    const todasLasAtenciones = [
        ['consultas', 'Consulta'],
        ['evaluaciones', 'Evaluación'],
        ['planes', 'Plan especializado'],
        ['talleres', 'Taller grupal']
    ];

    const todosLosServicios = [
        ...consultas.map(item => ({ ...item, categoria: 'consultas' })),
        ...evaluaciones.map(item => ({ ...item, categoria: 'evaluaciones' })),
        ...planes.map(item => ({ ...item, categoria: 'planes' })),
        ...talleres.map(item => ({ ...item, categoria: 'talleres' }))
    ];

    const serviciosFiltrados = todosLosServicios.filter(
        item => item.categoria === atencion
    );

    const servicioSeleccionado = todosLosServicios.find(
        item => String(item.id) === servicio
    );

    const todosProfesionales = [
        ['1', 'Carolina Pérez', 'clinico'],
        ['2', 'Valentina Soto', 'clinico'],
        ['3', 'Camilo Rojas', 'deportivo'],
        ['4', 'Daniela Muñoz', 'veg']
    ];

    const profesionalesFiltrados = todosProfesionales.filter(
        item => item[2] === servicioSeleccionado?.tpProfesional
    );

    // OBTENER DATOS DEL PATH SI ES QUE HAY
    useEffect(() => {
        const datos = location.state;

        if (!datos) return;

        const nuevaAtencion = datos.atencion ?? '';
        const nuevoServicio = datos.servicio != null
            ? String(datos.servicio)
            : '';

        setAtencion(nuevaAtencion);
        setServicio(nuevoServicio);

        const atencionEncontrada = todasLasAtenciones.find(
            item => item[0] === nuevaAtencion
        );

        const servicioEncontrado = todosLosServicios.find(
            item =>
                item.categoria === nuevaAtencion &&
                String(item.id) === nuevoServicio
        );

        setCampoAtencion(atencionEncontrada?.[1] ?? '');
        setCampoServicio(servicioEncontrado?.nombre ?? '');
    }, [location.state]);

    // MANEJAR EXCEPTIONS
    const [error, setError] = useState('');
    const runPattern = /^\d{7,8}-[0-9kK]$/;

    const handleSubmit = (event) => {
        event.preventDefault();

        if (atencion === '') {
            setError('Seleccione un tipo de atención');
            return;
        }
        if (servicio === '') {
            setError('Seleccione un plan o servicio');
            return;
        }
        if (profesional === '') {
            setError('Seleccione un profesional');
            return;
        }
        if (campoFecha < hoy || campoFecha > limiteReservas) {
            setError('Seleccione una fecha válida');
            return;
        }
        if (nombre.trim() === '') {
            setError('Ingrese su nombre');
            return;
        }

        const runValido = !runPattern.test(run.trim());
        if (runValido) {
            setError('El formato del RUN no es válido. Por favor, ingrese su RUN sin puntos y con guión.');
            return;
        }
        setError('');
        enviar();
    }

    const enviar = () => {
        // FORMATEAR FECHA
        const opciones = {day: '2-digit', month: '2-digit', year: 'numeric'};
        const formateada = new Intl.DateTimeFormat('es-CL', opciones).format(campoFecha);

        let hora = '';
        if (campoHora === "1") {
            hora = '10:00';
        } else if (campoHora === '2') {
            hora = '11:00';
        } else if (campoHora === '3') {
            hora = '12:00';
        }

        const serv = servicioSeleccionado;

        const parametros = new URLSearchParams();
        parametros.append("nombre", nombre);
        parametros.append("profesional", campoProfesional);
        parametros.append("servicio", campoServicio);
        parametros.append("precio", serv.precio);
        parametros.append("fecha", formateada);
        parametros.append("hora", hora);

        const paginaDestino = "/confirmacion-reserva";
        window.location.href = `${paginaDestino}?${parametros.toString()}`;
    }

    const limpiar = (level) => {

        setCorreo('');
        setRun('');
        setNombre('');
        setCampoHora('1')
        setCampoFecha(hoy);

        if (level >= 2)
            return;

        setProfesional('');
        setCampoProfesional('');

        if (level >= 1)
            return;

        setServicio('');
        setCampoServicio('');
    }

    return (
        <main>
            <div className="d-flex justify-content-center aling-items-center ">
                <form className="border rounded p-4 shadow bg-white formulario" onSubmit={handleSubmit}>
                    <h1 className="subtitulo-form">Búsqueda por especialidad</h1>

                    <section>
                        <div className="campo">
                            <label htmlFor="atencion-select">Tipo de Atención</label>
                            <select name="atencion" id="atencion-select" className="form-dato" value={atencion}
                                onChange={(event) => {
                                    setAtencion(event.target.value);
                                    setCampoAtencion(
                                        todasLasAtenciones.find(item => item[0] === event.target.value)?.[1] ?? ''
                                    );
                                    limpiar(0);
                                }}>
                                <option value="" select disabled>
                                    Seleccione una opción
                                </option>
                                {todasLasAtenciones.map(item => (
                                        <option key={item[0]} value={item[0]}>
                                            {item[1]}
                                        </option>
                                ))}
                            </select>
                        </div>

                        <div className="campo">
                            <label htmlFor="servicio-select">Servicio / Plan</label>
                            <select name="planes-servicios" id="servicio-select" className="form-dato" value={servicio} disabled={!atencion}
                                onChange={(event) => {
                                    const select = event.target
                                    setServicio(select.value);
                                    setCampoServicio(
                                        todosLosServicios.find(item => item[0] === select.value)?.nombre ?? ''
                                    );

                                    limpiar(1);
                                }}>
                                <option value="" disabled>
                                    Seleccione una opción
                                </option>
                                {serviciosFiltrados.map(item => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="campo">
                            <label htmlFor="profesional-select">Profesional</label>
                            <select name="profesional" id="profesional-select" className="form-dato" value={profesional} disabled={!servicio}
                                onChange={(event) => {
                                    setProfesional(event.target.value);
                                    setCampoProfesional(event.target.options[event.target.selectedIndex].text);

                                    limpiar(2);
                                }}>
                                <option value="" disabled>
                                    Seleccione una opción
                                </option>
                                {profesionalesFiltrados.map(item => (
                                    <option key={item[0]} value={item[0]}>
                                        {item[1]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </section>

                    <section id="reserva-hora" className={profesional? "": "d-none"} >
                        <h1 className="subtitulo-form">Seleccione su sesión</h1>

                        <div className="campo">
                            <label htmlFor="fecha">Seleccione la fecha de la atención:</label>
                            <Calendario fechaInicial={campoFecha} onFechaSeleccionada={ setCampoFecha } />
                        </div>

                        <div className="campo">
                            <label htmlFor="hora">Horas disponibles:</label>
                            <div class="form-radio">
                                <div>
                                    <input type="radio" id="10h" name="hora" value="1"
                                    checked={campoHora === '1'}
                                    onChange={(event) => { setCampoHora(event.target.value) }} ></input>
                                    <label htmlFor="10h">10:00</label>
                                </div>

                                <div>
                                    <input type="radio" id="11h" name="hora" value="2"
                                    checked={campoHora === '2'}
                                    onChange={(event) => { setCampoHora(event.target.value) }} ></input>
                                    <label htmlFor="11h">11:00</label>
                                </div>

                                <div>
                                    <input type="radio" id="12h" name="hora" value="3"
                                    checked={campoHora === '3'}
                                    onChange={(event) => { setCampoHora(event.target.value) }} ></input>
                                    <label htmlFor="12h">12:00</label>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className={profesional? "": "d-none"} >
                        <h1 className="subtitulo-form">Completar datos</h1>

                        <div className="campo">
                            <label htmlFor="nombre">Nombre</label>
                            <input name="nombre" type="text" className="form-dato" placeholder="Camila Guzmán"
                            onChange={ (event) => setNombre(event.target.value) }></input>
                        </div>

                        <div className="campo">
                            <label htmlFor="run" >RUN</label>
                            <input name="run" type="text" className="form-dato" placeholder="11111111-1"
                            onChange={ (event) => setRun(event.target.value) }></input>
                        </div>

                        <div className="campo">
                            <label htmlFor="correo" >Correo</label>
                            <input name="correo" type="email" className="form-dato" placeholder="example@nutrivida.com"
                            onChange={ (event) => setCorreo(event.target.value)}></input>
                        </div>
                    </section>

                    {error && (<div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <button name="enviar" type="submit" id="reservar" className="btn-nutrivida">
                        {profesional? "Enviar": "Continuar"}
                    </button>

                </form>
            </div>
        </main>
    )
}

export default Reserva;