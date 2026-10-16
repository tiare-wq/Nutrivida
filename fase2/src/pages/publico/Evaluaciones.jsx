import { useState, useEffect } from 'react';
import Servicio from '../../components/Servicio';
import { leerEvaluaciones } from '../../data/servicios';

function Evaluaciones() {
  const [listaEvaluaciones, setListaEvaluaciones] = useState(() => {
          return leerEvaluaciones();
      });
  
      useEffect(() => {
          const actualizar = () => {
              setListaEvaluaciones(leerEvaluaciones());
          };
  
          window.addEventListener('servicios:actualizar', actualizar);
  
          return () => {
              window.removeEventListener('servicios:actualizar', actualizar);
          };
      }, []);

  return (
    <main className="container min-vh-100">
      <div className="container-fluid justify-content-center h-100 row">
        <h1 className="titulo-servicio">Evaluaciones</h1>

        {listaEvaluaciones.map((servicio) => (
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
export default Evaluaciones;