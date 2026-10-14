import { Link } from 'react-router-dom';
import { pacienteActual, planActivo } from '../../data/almacen';

function MisPlanes() {
    const paciente = pacienteActual();
    const compras = [...(paciente?.historial ?? [])].filter(compra => Array.isArray(compra.planes)).reverse();
    const activo = planActivo(paciente);

    return <div className="fondo"><div className="fondo-principal">
        <h1>Mis planes</h1>
        <h5>{paciente?.nombre} · ID {paciente?.id}</h5>
        <div className="card-private">
            <h3>{activo ? `Plan activo: ${activo}` : 'Sin plan activo'}</h3>
            {!compras.length && <p>Aún no has registrado planes. <Link to="/planes">Ver planes disponibles</Link></p>}
            {compras.map(compra => <div key={compra.id} className="plan-historial">
                <h4>Pedido #{compra.id}</h4>
                <p>{new Date(compra.fecha).toLocaleDateString('es-CL')}</p>
                <ul>{compra.planes.map(plan => <li key={plan.id}>{plan.cantidad} × {plan.nombre} · ${plan.precio}</li>)}</ul>
            </div>)}
            <p>Estos registros se guardan en este navegador. No representan un cobro en línea.</p>
        </div>
    </div></div>;
}

export default MisPlanes;
