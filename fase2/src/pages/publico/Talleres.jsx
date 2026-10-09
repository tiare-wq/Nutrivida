import Servicio from '../../components/Servicio';
import talleres from '../../data/talleres';

function Talleres() {
  const accion = "Reservar ahora"

  return (
        <main className="container">
            <div className="container-fluid justify-content-center h-100 row">
                <h1 className="titulo-servicio">Talleres Grupales</h1>
                
                {talleres.map((servicio) =>
                (
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
export default Talleres;