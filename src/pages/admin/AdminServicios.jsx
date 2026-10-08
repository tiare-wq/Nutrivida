function AdminServicios() {
    return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <form className="d-inline-block w-auto border rounded p-4 shadow bg-white">
            <h1 className="subtitulo-form">Administrar oferta de servicios</h1>

            <div className="campo">
                <label for="categoria-servicio">Categoría</label>
                <select id="categoria-servicio" name="categorias">
                    <option value="" selected disabled>Seleccione una opción</option>
                    <option value="1">Consulta</option>
                    <option value="2">Evaluación</option>
                    <option value="3">Planes / Servicios</option>
                    <option value="4">Taller</option>
                </select>
            </div>

            <div className="campo">
                <label for="nombre-servicio">Nombre del servicio</label>
                <input id="nombre-servicio" type="text"></input>
            </div>

            <div className="campo">
                <label for="descr-servicio">Descripción</label>
                <textarea id="descr-servicio" type="text" placeholder="Descripción del servicio..."></textarea>
            </div>

            <div className="campo">
                <label for="duracion-servicio">Duración</label>
                <input id="duracion-servicio" type="text"></input>
            </div>

            <div className="campo">
                <label for="modalidad-servicio">Modalidad</label>
                <select id="modalidad-servicio" name="modalidades">
                    <option value="" selected disables>Seleccione una opción</option>
                    <option value="1">Presencial</option>
                    <option value="2">Presencial (grupal)</option>
                    <option value="3">Online</option>
                </select>
            </div>

            <div className="campo">
                <label for="precio-servicio">Precio</label>
                <input id="precio-servicio" type="text"></input>
            </div>

            <button className="action" type="submit">Agregar servicio</button>
        </form>
    </div>
    )
}

export default AdminServicios