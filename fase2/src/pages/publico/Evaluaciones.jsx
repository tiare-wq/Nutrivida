import Servicio from '../../components/Servicio'

function Evaluaciones() {
    const accion = "Reservar ahora";
  return (
    <div className="container">
      <div className="container-fluid justify-content-center h-100 row">
        <h1 className="titulo-servicio">Evaluaciones</h1>

        <Servicio
          nombre="Antropometría completa"
          descr="Evaluación de peso, talla, circunferencias y otros indicadores antropométricos para conocer
                la composición y evolución corporal."
          duracion="20 min"
          modalidad="Presencial"
          precio="18.000"
          accion={accion}
        />

        <Servicio
          nombre="Bioimpedanciometría"
          descr="Evaluación de la composición corporal mediante bioimpedancia, permitiendo obtener
                    información sobre diferentes componentes del cuerpo."
          duracion="15 min"
          modalidad="Presencial"
          precio="12.000"
          accion={accion}
        />

        <Servicio
          nombre="Encuesta de hábitos alimentarios"
          descr="Evaluación de los hábitos y patrones de alimentación del paciente para identificar aspectos
                que pueden ser considerados en su orientación nutricional."
          duracion="20 min"
          modalidad="Presencial"
          precio="10.000"
          accion={accion}
        />

        <Servicio
          nombre="Análisis de exámenes de laboratorio"
          descr="Revisión y análisis de resultados de exámenes de laboratorio como apoyo para la evaluación y
                orientación nutricional."
          duracion="20 min"
          modalidad="Presencial"
          precio="15.000"
          accion={accion}
        />

      </div>
    </div>
  )
}
export default Evaluaciones