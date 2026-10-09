import Servicio from '../../components/Servicio'

function Planes() {
  const accion = "Agregar al carrito"

  return (
      <div className="container">
        <div className="container-fluid justify-content-center h-100 row">
          <h1 className="titulo-servicio">Planes de Alimentación</h1>

          <Servicio
              nombre="Plan de pérdida de peso (1 mes)"
              descr="Programa de un mes orientado a la pérdida de peso, con seguimiento nutricional y un plan
                    de alimentación personalizado."
              duracion="1 mes"
              modalidad="Presencial"
              precio="65.000"
              accion={accion}
            />

            <Servicio
              nombre="Plan de pérdida de peso (3 meses)"
              descr="Programa de tres meses para la pérdida de peso, con controles periódicos, planes de alimentación
                    y seguimiento continuo."
              duracion="3 meses"
              modalidad="Presencial"
              precio="170.000"
              accion={accion}
            />

            <Servicio
              nombre="Plan de nutrición deportiva (1 mes)"
              descr="Plan nutricional dirigido a deportistas y personas con actividad física frecuente,
                    adaptado a sus requerimientos energéticos y proteicos."
              duracion="1 mes"
              modalidad="Presencial"
              precio="70.000"
              accion={accion}
            />

            <Servicio
              nombre="Plan control diabetes / hipertensión"
              descr="Plan de alimentación adaptado a personas con diabetes o hipertensión, considerando sus
                    necesidades nutricionales y objetivos de salud."
              duracion="1 mes"
              modalidad="Presencial"
              precio="$75.000"
              accion={accion}
            />

            <Servicio
              nombre="Plan alimentación vegetariana / vegana"
              descr="Plan alimenticio adaptado a una alimentación vegetariana o vegana, considerando el aporte
                    adecuado de nutrientes esenciales."
              duracion="1 mes"
              modalidad="Presencial"
              precio="68.000"
              accion={accion}
            />

        </div>
      </div>
  )
}
export default Planes;