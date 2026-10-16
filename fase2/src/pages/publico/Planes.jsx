import { useState, useEffect } from 'react';
import Servicio from '../../components/Servicio';
import { leerPlanes } from '../../data/servicios';

function Planes() {
  const [listaPlanes, setListaPlanes] = useState(() => {
            return leerPlanes();
        });
    
        useEffect(() => {
            const actualizar = () => {
                setListaPlanes(leerPlanes());
            };
    
            window.addEventListener('servicios:actualizar', actualizar);
    
            return () => {
                window.removeEventListener('servicios:actualizar', actualizar);
            };
        }, []);

  return (
      <main className="container">
        <div className="container-fluid justify-content-center h-100 row min-vh-100">
          <h1 className="titulo-servicio">Planes de Alimentación</h1>

          {listaPlanes.map((servicio) =>
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