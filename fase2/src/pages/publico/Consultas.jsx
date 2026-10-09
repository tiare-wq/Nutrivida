import Servicio from '../../components/Servicio'

function Consultas() {
  const accion = "Reservar ahora"

  return (
        <div className="container">
            <div className="container-fluid justify-content-center h-100 row">
                <h1 className="titulo-servicio">Consultas Nutricionales</h1>

                <Servicio
                    nombre="Primera consulta nutricional"
                    descr={<>
                    <strong>Evaluación inicial.</strong>{" "} Anamnesis, antropometría completa y diseño del primer plan alimenticio.
                    </>}
                    duracion="50 min"
                    modalidad="Presencial"
                    precio="35.000"
                    accion={accion}
                />

                <Servicio
                    nombre="Control nutricional (seguimiento)"
                    descr="Seguimiento de la evolución del paciente, revisión de objetivos y ajustes al plan alimenticio según sus avances."
                    duracion="30 min"
                    modalidad="Presencial"
                    precio="25.000"
                    accion={accion}
                />

                <Servicio
                    nombre="Control nutricional quincenal"
                    descr="Consulta de seguimiento realizada cada 15 días para evaluar avances y realizar los ajustes
                    necesarios al plan alimenticio."
                    duracion="30 min"
                    modalidad="Presencial"
                    precio="22.000"
                    accion={accion}
                />

                <Servicio
                    nombre="Control nutricional quincenal"
                    descr="Atención nutricional a distancia mediante videollamada, permitiendo realizar seguimiento y
                        orientación sin asistir presencialmente a la clínica."
                    duracion="30 min"
                    modalidad="Online"
                    precio="20.000"
                    accion={accion}
                />

                <Servicio
                    nombre="Consulta de urgencia / reagendada"
                    descr="Atención destinada a resolver situaciones nutricionales urgentes o recuperar una
                    consulta que debió ser reagendada."
                    duracion="30 min"
                    modalidad="Presencial"
                    precio="28.000"
                    accion={accion}
                />

        </div>
      </div>
  )
}
export default Consultas;