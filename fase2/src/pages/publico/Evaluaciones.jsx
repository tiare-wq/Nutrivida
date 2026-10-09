import Servicio from '../../components/Servicio';
import evaluaciones from '../../data/evaluaciones';

function Evaluaciones() {
  return (
    <main className="container">
      <div className="container-fluid justify-content-center h-100 row">
        <h1 className="titulo-servicio">Evaluaciones</h1>

        {evaluaciones.map((servicio) => (
          <Servicio
            id={servicio.id}
            nombre={servicio.nombre}
            descr={servicio.descr}
            duracion={servicio.duracion}
            modalidad={servicio.modalidad}
            precio={servicio.precio}
            accion={servicio.accion}
          />
        ))}

      </div>
    </main>
  )
}
export default Evaluaciones;