import { Link } from 'react-router-dom';
import { pacienteActual, planActivo } from '../../data/almacen';

function MisPlanes() {
    const paciente = pacienteActual();
    const compras = [...(paciente?.historial ?? [])].filter(compra => Array.isArray(compra.planes)).reverse();
    const activo = planActivo(paciente);

    return (
        <div className="fondo">
            <div className="fondo-principal">
                <h1>Mis planes</h1>
                <h5>{paciente?.nombre}</h5>
                <div className='card-private'>
                    <h3>{activo ? `Plan activo: ${activo}` : 'Sin plan activo'}</h3>
                </div>
                <div className='card-private'>
                    <div className="p-3">
                        {!compras.length && <p>Aún no has registrado planes. <Link to="/planes">Ver planes disponibles</Link></p>}
                        {compras.length && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Plan ID</th>
                                        <th>Fecha</th>
                                        <th>Cantidad</th>
                                        <th>Nombre</th>
                                        <th>Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {compras.flatMap(compra =>
                                        compra.planes.map((plan, index) => (
                                            <tr key={plan.id}>
                                                <td>{plan.id}</td>
                                                <td>
                                                    {new Date(compra.fecha).toLocaleDateString('es-CL')}
                                                </td>
                                                <td>{plan.cantidad}</td>
                                                <td>{plan.nombre}</td>
                                                <td>${plan.precio}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                
                            </table>
                        )}
                        <p>Estos registros se guardan en este navegador. No representan un cobro en línea.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MisPlanes;
