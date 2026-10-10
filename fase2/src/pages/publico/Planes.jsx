import Servicio from '../../components/Servicio';
import planes from '../../data/planes';

function Planes() {
  const accion = "Agregar al carrito"

  return (
      <main className="container">
        <div className="container-fluid justify-content-center h-100 row">
          <h1 className="titulo-servicio">Planes de Alimentación</h1>

          {planes.map((servicio) =>
          (
            <Servicio
              id={servicio.id}
              atencion={servicio.atencion}
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
export default Planes;