export default function HistorialMediciones({ mediciones = [], onEditar, onEliminar }) {
    const ultima = mediciones[0];
    const acciones = Boolean(onEditar || onEliminar);

    if (!ultima) {
        return <p>Todavía no hay mediciones registradas.</p>;
    }

    return (
        <section aria-label="Historial de mediciones">
            <h2>Últimas medidas</h2>
            <dl className="medidas-resumen">
                <div>
                    <dt>Estatura</dt>
                    <dd>{ultima.estaturaCm} cm</dd>
                </div>
                <div>
                    <dt>Peso</dt>
                    <dd>{ultima.pesoKg} kg</dd>
                </div>
                <div>
                    <dt>Cintura</dt>
                    <dd>{ultima.cinturaCm} cm</dd>
                </div>
                <div>
                    <dt>Cadera</dt>
                    <dd>{ultima.caderaCm} cm</dd>
                </div>
            </dl>

            <h2>Historial de medidas</h2>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Estatura cm</th>
                            <th>Peso kg</th>
                            <th>Cintura cm</th>
                            <th>Cadera cm</th>
                            <th>Profesional</th>
                            {acciones && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {mediciones.map((medicion) => (
                            <tr key={medicion.id}>
                                <td>{medicion.fecha}</td>
                                <td>{medicion.estaturaCm}</td>
                                <td>{medicion.pesoKg}</td>
                                <td>{medicion.cinturaCm}</td>
                                <td>{medicion.caderaCm}</td>
                                <td>{medicion.profesionalNombre}</td>
                                {acciones && (
                                    <td>
                                        {onEditar && (
                                            <button
                                                type="button"
                                                className="btn btn-outline-success btn-sm me-2"
                                                onClick={() => onEditar(medicion)}
                                            >
                                                Editar medición del {medicion.fecha}
                                            </button>
                                        )}
                                        {onEliminar && (
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => onEliminar(medicion)}
                                            >
                                                Eliminar medición del {medicion.fecha}
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
