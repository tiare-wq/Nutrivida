import { useState, useEffect } from "react";

import consultas from '../../data/consultas'
import evaluaciones from '../../data/evaluaciones'
import planes from '../../data/planes'
import talleres from '../../data/talleres'
import { useLocation } from "react-router-dom";

function Reserva() {
    const location = useLocation();

    const [atencion, setAtencion] = useState('');
    const [campoAtencion, setCampoAtencion] = useState('');

    const [servicio, setServicio] = useState('');
    const [campoServicio, setCampoServicio] = useState('');

    const [prof, setProf] = useState('');
    const [campoProf, setCampoProf] = useState('');
    
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

        if (prof === '') {
            setError('Seleccione un profesional');
            return;
        }

        setError('');
    }

    const limpiar = (level) => {

        setProf('');
        setCampoProf('');

        if (level >= 1)
            return

        setServicio('');
        setCampoServicio('');
    }

    return (
        <main>
            <div className="container justify-content-center reserva">
                <form className="border rounded p-4 shadow bg-white formulario" onSubmit={handleSubmit}>
                    <h1 className="subtitulo-form">Búsqueda por especialidad</h1>

                    <section>

                        <div className="campo">
                            <label htmlFor="atencion-select">Tipo de Atención</label>
                            <select name="atencion" id="atencion-select" className="form-select" value={atencion}
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
                                        <option value={item[0]}>
                                            {item[1]}
                                        </option>
                                ))}
                            </select>
                        </div>

                        <div className="campo">
                            <label htmlFor="servicio-select">Servicio / Plan</label>
                            <select name="planes-servicios" id="servicio-select" className="form-select" value={servicio} disabled={!atencion}
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
                            <select name="profesional" id="profesional-select" className="form-select" value={prof} disabled={!servicio}
                                onChange={(event) => {
                                    setProf(event.target.value);
                                    setCampoProf(event.target.options[event.target.selectedIndex].text);

                                    limpiar(2);
                                }}>
                                <option value="" disabled>
                                    Seleccione una opción
                                </option>
                                {profesionalesFiltrados.map(item => (
                                    <option value={item[0]}>
                                        {item[1]}
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