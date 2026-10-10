import { useNavigate } from "react-router-dom";

function Servicio({
    id,
    atencion,
    nombre,
    descr,
    duracion,
    modalidad,
    precio,
    accion
    }) {
        const navigate = useNavigate();
        const toAccion = () => {
            if (accion === "Reservar ahora") {
                navigate('/reservas', {
                state: {
                    atencion: atencion,
                    servicio: id
                }})
            } else if (accion === "Agregar al carrito") {
                navigate('/carrito')
            }
        } 

        return (
            <div className="col-12 col-md-6 col-lg-4 servicio">
                <h3 className="subtitulo-servicio">{nombre}</h3>
                <div className="descr-servicio">
                    <p className="nombre-caract">Descripción</p>
                    <p>{descr}</p>
                    <div className="feature-service">
                        <p className="nombre-caract">Duración</p>
                        <p>{duracion}</p>
                    </div>
                    <div className="feature-service">
                        <p className="nombre-caract">Modalidad</p>
                        <p>{modalidad}</p>
                    </div>
                    <div className="feature-service">
                        <p className="nombre-caract">Precio</p>
                        <p>${precio}</p>
                    </div>
                </div>
                <div className="contenedor-action">
                    <button className="action" onClick={toAccion} type="button" >
                        {accion}
                    </button>
                </div>
            </div>
        )
}
export default Servicio;