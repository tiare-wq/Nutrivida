import Servicio from '../../components/Servicio'

function Talleres() {
  const accion = "Reservar ahora"

  return (
        <div className="container">
            <div className="container-fluid justify-content-center h-100 row">
                <h1 className="titulo-servicio">Talleres Grupales</h1>

                <Servicio
                    nombre="Taller de alimentación saludable"
                    descr="Taller grupal orientado a entregar conocimientos y herramientas prácticas para mantener una
                    alimentación saludable y equilibrada."
                    duracion="90 min"
                    modalidad="Presencial (grupo)"
                    precio="15.000"
                    accion={accion}
                />

                <Servicio
                    nombre="Taller de cocina nutritiva"
                    descr="Taller grupal práctico enfocado en la preparación de alimentos y recetas nutritivas,
                    promoviendo hábitos de cocina saludable."
                    duracion="120 min"
                    modalidad="Presencial (grupo)"
                    precio="20.000"
                    accion={accion}
                />

                <Servicio
                    nombre="Taller de nutrición para deportistas"
                    descr="Taller grupal dirigido a deportistas y personas físicamente activas, con orientación sobre
                    alimentación y nutrición aplicada al rendimiento deportivo."
                    duracion="90 min"
                    modalidad="Presencial (grupo)"
                    precio="18.000"
                    accion={accion}
                />

                

        </div>
      </div>
  )
}
export default Talleres;