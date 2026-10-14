import { pacienteActual } from '../../data/almacen';

function MisReservas() {

    const paciente = pacienteActual();
    
    const reservas = paciente?.reservas ?? [];

    const opciones = {day: '2-digit', month: '2-digit', year: 'numeric'};

    return(
        <div className="fondo">
            <div className="fondo-principal">
                <h1>Mis reservas</h1>
                <h5>Consulta y haz un seguimiento de tus atenciones y productos contratados.</h5>

                <div className="card-private">
                    <h3>Reservas pendientes</h3>
                    <div className="p-3 tabla-scroll">
                        {(reservas == null || reservas.length === 0) && (
                                <h6>No hay reservas pendientes.</h6>
                        )}
                        {(reservas != null && reservas.length > 0) && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Servicio</th>
                                        <th>Fecha</th>
                                        <th>Hora</th>
                                        <th>Profesional</th>
                                        <th>Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservas.map(reserva => {
                                    const formateada = /^\d{4}-\d{2}-\d{2}$/.test(reserva.fecha)
                                        ? reserva.fecha.split('-').reverse().join('-')
                                        : new Intl.DateTimeFormat('es-CL', opciones).format(new Date(reserva.fecha));

                                    return (
                                        <tr key={reserva.id}>
                                            <td>{reserva.servicio}</td>
                                            <td>{formateada}</td>
                                            <td>{reserva.hora}</td>
                                            <td>{reserva.profesional}</td>
                                            <td>${reserva.precio.toLocaleString("es-CL")}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>  
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MisReservas;
