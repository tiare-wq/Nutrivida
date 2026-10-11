function Confirmacion() {
    const queryParam = window.location.search;
    const urlParam = new URLSearchParams(queryParam);

    const nombre = urlParam.get('nombre');
    const profesional = urlParam.get('profesional');
    const servicio = urlParam.get('servicio');
    const precio = urlParam.get('precio');
    const fecha = urlParam.get('fecha');
    const hora = urlParam.get('hora');

    const obtenerCodigoReserva = () => {
        return Math.random(0, 1) * 10**16;
    }
    let codigo = obtenerCodigoReserva();

    return (
        <main>
            <div className="bg-light container col-12 col-md-8 col-lg-6">
                <div className="justify-content-center confirmacion">
                    <h2>Confirmación de la reserva.</h2>

                    <div class="card-codigo">
                        <label>Código de la reserva</label>
                        <h5>{codigo}</h5>
                    </div>

                    <h6>¡Hola {nombre}! Envíamos un mensaje a tu correo.</h6>
                    <h6>Se agendó su cita para el día {fecha} a las {hora} horas.</h6>
                    <h6>Servicio: {servicio}</h6>
                    <h6>Profesional: {profesional}</h6>
                    <h6>Valor de la atención: ${precio}.</h6>
                    
                    <button id="btn-form" className="btn-nutrivida">
                        Volver
                    </button>
                </div>
            </div>
        </main>
    )
}
export default Confirmacion;