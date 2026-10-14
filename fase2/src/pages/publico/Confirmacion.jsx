import { Link, useLocation } from 'react-router-dom';

function Confirmacion() {
    const reserva = useLocation().state;
    if (!reserva) return <main className="container py-5">
        <h1>No hay una reserva para mostrar</h1>
        <Link to="/reservas">Volver a reservar</Link>
    </main>;

    return <main>
        <div className="bg-light container col-12 col-md-8 col-lg-6 min-vh-100">
            <div className="confirmacion">
                <h1>Reserva confirmada</h1>
                <div className="card-codigo"><span>Código de reserva</span><h2>{reserva.id}</h2></div>
                <p>Tu atención quedó guardada en este navegador.</p>
                <p>{reserva.fecha.split('-').reverse().join('-')} a las {reserva.hora} horas.</p>
                <p>Servicio: {reserva.servicio}</p>
                <p>Profesional: {reserva.profesional}</p>
                <p>Valor: ${reserva.precio}</p>
                <Link className="btn btn-success" to="/mis-reservas">Ver mis reservas</Link>
            </div>
        </div>
    </main>;
}

export default Confirmacion;
