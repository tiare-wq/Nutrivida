import { useState } from "react";

function Servicio({
    nombre,
    descr,
    duracion,
    modalidad,
    precio,
    }) {
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
                <button class="action">
                    Agregar al carrito
                </button>
            </div>
        )
}
export default Servicio