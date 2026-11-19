import { Link, useLocation } from 'react-router-dom';
import { emitirBoleta } from '../../service/reservaService';

function Confirmacion() {
    const { id } = useLocation().state;
    try {
        const boleta = emitirBoleta(id);
    } catch {
        return (
            <main className="container py-5">
                <h1>Hemos tenido problemas para obtener tu boleta.</h1>
                <Link to="/reservas">Volver a reservar</Link>
            </main>
        );
    }

    return (
        <main>
            <div className="bg-light container col-12 col-md-8 col-lg-6">
                <div className="confirmacion">
                    <h1>Reserva confirmada</h1>
                    <div className="card-codigo">
                        <span>Código de reserva</span>
                        <h2>{reserva.id}</h2>
                    </div>
                    <p>Tu atención quedó guardada en este navegador.</p>
                    <p>
                        Hora reservada para el {reserva.fecha} a las {reserva.hora}hrs.
                    </p>
                    <p>Servicio: {reserva.servicio}</p>
                    <p>Profesional: {reserva.profesional}</p>
                    <p>Valor: ${reserva.precio}</p>
                    <Link className="btn btn-success" to="/mis-reservas">
                        Ver mis reservas
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default Confirmacion;
