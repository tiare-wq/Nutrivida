import { useState, useEffect } from 'react';
import Servicio from '../../components/Servicio';
import { leerTalleres } from '../../data/servicios';

function Talleres() {
  const [listaTalleres, setListaTalleres] = useState(() => {
          return leerTalleres();
      });
  
      useEffect(() => {
          const actualizar = () => {
              setListaTalleres(leerTalleres());
          };
  
          window.addEventListener('servicios:actualizar', actualizar);
  
          return () => {
              window.removeEventListener('servicios:actualizar', actualizar);
          };
      }, []);

  return (
        <main className="container">
            <div className="container-fluid justify-content-center h-100 row min-vh-100">
                <h1 className="titulo-servicio">Talleres Grupales</h1>
                
                {listaTalleres.map((servicio) =>
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
export default Talleres;