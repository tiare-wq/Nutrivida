import { useState } from "react";
import {
    leerConsultas,
    leerEvaluaciones,
    leerPlanes,
    leerTalleres } from '../../data/servicios';

function Ver() {
    const [tpAtencion, setTpAtencion] = useState('');

    const consultas = leerConsultas();
    const evaluaciones = leerEvaluaciones();
    const planes = leerPlanes();
    const talleres = leerTalleres();
    
    return (
    <div className="fondo">
            <div className="fondo-principal d-flex flex-column align-items-center">
                <form className="d-inline border rounded p-4 shadow bg-white form-ver">
                    <h1 className="subtitulo-form">Ver ofertas de servicios</h1>

                    <div className="campo">
                        <label for="atencion-servicio">Tipo atención</label>
                        <select id="atencion-servicio" name="atenciones"
                        onChange={item => setTpAtencion(item.target.value)}>
                            <option value="" selected disabled>Seleccione una opción</option>
                            <option value="Consultas">Consulta</option>
                            <option value="Evaluaciones">Evaluación</option>
                            <option value="Planes / Servicios">Planes / Servicios</option>
                            <option value="Talleres">Taller</option>
                        </select>
                    </div>
                </form>

                <h2>{tpAtencion}</h2>
                <table className="tabla-ver">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nombre</th>
                            <th>Modalidad</th>
                            <th>Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tpAtencion === "Consultas" && (
                            consultas.map(servicio => (
                                <tr key={servicio.id}>
                                    <td>{servicio.id}</td>
                                    <td>{servicio.nombre}</td>
                                    <td>{servicio.modalidad}</td>
                                    <td>{servicio.precio}</td>
                                </tr>
                            ))
                        )}
                        {tpAtencion === "Evaluaciones" && (
                            evaluaciones.map(servicio => (
                                <tr key={servicio.id}>
                                    <td>{servicio.id}</td>
                                    <td>{servicio.nombre}</td>
                                    <td>{servicio.modalidad}</td>
                                    <td>{servicio.precio}</td>
                                </tr>
                            ))
                        )}
                        {tpAtencion === "Planes / Servicios" && (
                            planes.map(servicio => (
                                <tr key={servicio.id}>
                                    <td>{servicio.id}</td>
                                    <td>{servicio.nombre}</td>
                                    <td>{servicio.modalidad}</td>
                                    <td>{servicio.precio}</td>
                                </tr>
                            ))
                        )}
                        {tpAtencion === "Talleres" && (
                            talleres.map(servicio => (
                                <tr key={servicio.id}>
                                    <td>{servicio.id}</td>
                                    <td>{servicio.nombre}</td>
                                    <td>{servicio.modalidad}</td>
                                    <td>{servicio.precio}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default Ver;