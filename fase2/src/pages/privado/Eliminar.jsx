import { useState } from "react";
import {
    eliminarConsulta,
    eliminarEvaluacion,
    eliminarPlanes,
    eliminarTalleres } from '../../data/servicios';

function Eliminar() {

    const [atencion, setAtencion] = useState('');
    const [id, setId] = useState('');

    const confirmacion = () => {
        const confirmar = window.confirm('¿Desea confirmar la eliminación?');

        if (!confirmar) return;
        eliminar();
    }

    const eliminar = () => {
        
        if (atencion === '1') {
            eliminarConsulta(id);
        }
        else if (atencion === '2') {
            eliminarEvaluacion(id);
        }
        else if (atencion === '3') {
            eliminarPlanes(id);
        }
        else if (atencion === '4') {
            eliminarTalleres(id);
        }
    }

    return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <form className="d-inline-block w-auto border rounded p-4 shadow bg-white" onSubmit={confirmacion}>
            <h1 className="subtitulo-form">Eliminar oferta de servicio</h1>

            <div className="campo">
                <label for="atencion-servicio">Tipo atención</label>
                <select id="atencion-servicio" name="atenciones"
                onChange={item => setAtencion(item.target.value)}>
                    <option value="" selected disabled>Seleccione una opción</option>
                    <option value="1">Consulta</option>
                    <option value="2">Evaluación</option>
                    <option value="3">Planes / Servicios</option>
                    <option value="4">Taller</option>
                </select>
            </div>

            <div className="campo">
                <label for="id-servicio">Nombre del servicio</label>
                <input id="id-servicio" type="text"
                onChange={item => setId(item.target.value)}></input>
            </div>

            <button className="action" type="submit">Eliminar</button>
        </form>
    </div>
    )
}
export default Eliminar;