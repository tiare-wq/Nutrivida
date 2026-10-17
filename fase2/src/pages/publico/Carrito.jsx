import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import planes from '../../data/planes';
import { cambiarCantidad, compradosEsteAnio, leerCarrito, pacienteActual, quitarPlan, registrarPedido } from '../../data/almacen';

const pesos = valor => Number(valor).toLocaleString('es-CL');

function Carrito() {
    const paciente = pacienteActual();
    const [carrito, setCarrito] = useState(() => leerCarrito(paciente?.id));
    const [error, setError] = useState('');
    const [pedido, setPedido] = useState(null);

    if (!paciente) return <main className="container py-5">
        <h1>Tu carrito</h1>
        <p>Inicia sesión con tu cuenta de paciente para elegir planes.</p>
        <Link className="btn btn-success" to="/login" state={{ next: '/carrito' }}>Iniciar sesión</Link>
    </main>;

    const comprados = compradosEsteAnio(paciente);
    const cantidad = carrito.reduce((total, item) => total + item.cantidad, 0);
    const detalle = carrito.map(item => ({ ...item, plan: planes.find(plan => plan.id === item.id) }));
    const total = detalle.reduce((suma, item) => suma + Number(item.plan.precio.replaceAll('.', '')) * item.cantidad, 0);

    function actualizarCantidad(id, valor) {
        if (!cambiarCantidad(id, Number(valor))) {
            setError('Puedes elegir hasta 10 planes por año, contando los que ya registraste.');
            return;
        }
        setCarrito(leerCarrito(paciente.id));
        setError('');
    }

    function eliminar(id) {
        quitarPlan(id);
        setCarrito(leerCarrito(paciente.id));
        setError('');
    }

    function confirmar() {
        const resultado = registrarPedido();
        if (!resultado) {
            setError('No se pudo registrar el pedido. Revisa el límite anual y vuelve a intentarlo.');
            return;
        }
        setPedido(resultado);
        setCarrito([]);
        setError('');
    }

    return <main className="container carrito-page">
        <h1>Tu carrito de planes</h1>
        <p>{paciente.nombre} · {comprados} de 10 planes registrados este año.</p>
        {error && <p className="alert alert-warning" role="alert">{error}</p>}
        {pedido && <div className="alert alert-success" role="status">
            Pedido #{pedido.id} registrado. Tus planes aparecen en <Link to="/mis-planes">Mis planes</Link>. No se realizó un cobro en línea.
        </div>}
        {detalle.length === 0 && !pedido && <div className="card-private">
            <p>Aún no tienes planes en el carrito.</p>
            <p>Para tu compra reciente.</p>
            <Link className="btn btn-success" to="/planes">Ver planes</Link>
        </div>}
        {detalle.length > 0 && <div className="card-private">
            <div className="carrito-lista">
                {detalle.map(item => <div className="carrito-fila" key={item.id}>
                    <div><h2>{item.plan.nombre}</h2><p>${item.plan.precio} por plan</p></div>
                    <div>
                        <label htmlFor={`cantidad-${item.id}`}>Cantidad</label>
                        <input id={`cantidad-${item.id}`} className="form-control" type="number" min="1" max="10" value={item.cantidad}
                            onChange={event => actualizarCantidad(item.id, event.target.value)} />
                    </div>
                    <strong>${pesos(Number(item.plan.precio.replaceAll('.', '')) * item.cantidad)}</strong>
                    <button className="btn btn-outline-danger" type="button" onClick={() => eliminar(item.id)}>Quitar</button>
                </div>)}
            </div>
            <div className="carrito-total"><span>{cantidad} planes · máximo 10 por año</span><strong>Total: ${total.toLocaleString('es-CL')}</strong></div>
            <div className="carrito-acciones"><Link to="/planes">Seguir viendo planes</Link><button className="btn btn-success" type="button" onClick={confirmar}>Registrar pedido</button></div>
            <p className="carrito-nota">Registro local para el proyecto académico. No incluye pago en línea.</p>
        </div>}
    </main>;
}

export default Carrito;
