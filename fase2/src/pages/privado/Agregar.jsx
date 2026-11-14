import { useState } from "react";
import {
    leerConsultas,
    leerEvaluaciones,
    leerPlanes,
    leerTalleres,
    agregarConsulta,
    agregarEvaluaciones,
    agregarPlanes,
    agregarTalleres } from '../../data/servicios';

function Agregar() {

    const [categoria, setCategoria] = useState('');
    const [nombre, setNombre] = useState('');
    const [descr, setDescr] = useState('');
    const [tpProfesional, setTpProfesional] = useState('');
    const [duracion, setDuracion] = useState('');
    const [modalidad, setModalidad] = useState('');
    const [precio, setPrecio] = useState('');
    const [accion, setAccion] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleSubmit = (event) => {
        event.preventDefault()

        setSuccess('');

        if (
            !categoria.trim() ||
            !nombre.trim() ||
            !descr.trim() ||
            !tpProfesional.trim() ||
            !duracion.trim() ||
            !modalidad.trim() ||
            !precio.trim() ||
            !accion.trim()
        ) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        if (nombre.trim().length < 5) {
            setError('El nombre debe contener al menos 5 caracteres.');
            return;
        }

        const duracionValida = /^\d+\s?(min|hora|horas|semana|semanas|mes|meses)$/i.test(duracion.trim());

        if (!duracionValida) {
            setError('La duración debe tener un formato válido. Ejemplo: 50 min o 1 hora.');
            return;
        }

        const precioValido = /^\d+(\.\d{3})*$/.test(precio.trim());

        if (!precioValido || Number(precio.replace(/\./g, '')) <= 0) {
            setError('Ingresa un precio válido mayor que cero. Ejemplo: 35.000.');
            return;
        }
        setError('');
        agregar();
        setSuccess('Servicio agregado con éxito');
    };

    const agregar = () => {
        const servicio = {
                nombre,
                descr,
                tpProfesional,
                duracion,
                modalidad,
                precio,
                accion
            }
        if (categoria === '1') {
            const atencion = "consulta";
            const datos = leerConsultas();
            const id = datos.length > 0
            ? Math.max(...datos.map(servicio => Number(servicio.id.slice(1)))) + 1
            : 1;
            servicio.atencion = atencion;
            servicio.id = "C" + String(id);
            agregarConsulta(servicio);
        }
        else if (categoria === '2') {
            const atencion = "evaluaciones";
            const datos = leerEvaluaciones();
            const id = datos.length > 0
            ? Math.max(...datos.map(servicio => Number(servicio.id.slice(1)))) + 1
            : 1;
            servicio.atencion = atencion;
            servicio.id = "E" + String(id);
            agregarEvaluaciones(servicio);
        }
        else if (categoria === '3') {
            const atencion = "planes";
            const datos = leerPlanes();
            const id = datos.length > 0
            ? Math.max(...datos.map(servicio => Number(servicio.id.slice(1)))) + 1
            : 1;
            servicio.atencion = atencion;
            servicio.id = "P" + String(id);
            agregarPlanes(servicio);
        }
        else if (categoria === '4') {
            const atencion = "talleres";
            const datos = leerTalleres();
            const id = datos.length > 0
            ? Math.max(...datos.map(servicio => Number(servicio.id.slice(1)))) + 1
            : 1;
            servicio.atencion = atencion;
            servicio.id = "T" + String(id);
            agregarTalleres(servicio);
        }
    }
    
    return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <form className="d-inline-block w-auto border rounded p-4 shadow bg-white" onSubmit={handleSubmit}>
            <h1 className="subtitulo-form">Agregar oferta de servicio</h1>

            <div className="campo">
                <label for="categoria-servicio">Tipo atención</label>
                <select id="categoria-servicio" name="categorias"
                onChange={item => setCategoria(item.target.value)}>
                    <option value="" selected disabled>Seleccione una opción</option>
                    <option value="1">Consulta</option>
                    <option value="2">Evaluación</option>
                    <option value="3">Planes / Servicios</option>
                    <option value="4">Taller</option>
                </select>
            </div>

            <div className="campo">
                <label for="nombre-servicio">Nombre del servicio</label>
                <input id="nombre-servicio" type="text"
                onChange={item => setNombre(item.target.value)}></input>
            </div>

            <div className="campo">
                <label for="descr-servicio">Descripción</label>
                <textarea id="descr-servicio" type="text" placeholder="Descripción del servicio..."
                onChange={item => setDescr(item.target.value)}></textarea>
            </div>

            <div className="campo">
                <label for="tp-profesional">Tipo profesional</label>
                <select id="tp-profesional" name="tpProfesional"
                onChange={item => setTpProfesional(item.target.value)}>
                    <option value="" selected disabled>Seleccione una opción</option>
                    <option value="clinico">Clínico</option>
                    <option value="veg">Vegetariana / Vegana</option>
                    <option value="deportiva">Deportiva</option>
                </select>
            </div>

            <div className="campo">
                <label for="duracion-servicio">Duración</label>
                <input id="duracion-servicio" type="text"
                onChange={item => setDuracion(item.target.value)}></input>
            </div>

            <div className="campo">
                <label for="modalidad-servicio">Modalidad</label>
                <select id="modalidad-servicio" name="modalidades"
                onChange={item => setModalidad(item.target.value)}>
                    <option value="" selected disabled>Seleccione una opción</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Presencial (grupal)">Presencial (grupal)</option>
                    <option value="Online">Online</option>
                </select>
            </div>

            <div className="campo">
                <label for="precio-servicio">Precio</label>
                <input id="precio-servicio" type="text"
                onChange={item => setPrecio(item.target.value)}></input>
            </div>

            <div className="campo">
                <label for="accion-servicio">Acción</label>
                <select id="accion-servicio" name="acciones"
                onChange={item => setAccion(item.target.value)}>
                    <option value="" selected disabled>Seleccione una opción</option>
                    <option value="Reservar ahora">Reservar ahora</option>
                    <option value="Agregar al carrito">Agregar al carrito</option>
                </select>
            </div>

            <button className="action" type="submit">Agregar</button>

            {
                error && (
                    <div className="alert alert-danger m-3">
                        {error}
                    </div>
                )
            }
            {
                success && (
                    <div className="alert alert-success m-3">
                        {success}
                    </div>
                )
            }
        </form>
    </div>
    )
}
export default Agregar;