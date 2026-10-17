import { useState, useEffect } from 'react';
import Servicio from '../../components/Servicio';
import { leerConsultas } from '../../data/servicios';

function Consultas() {
    const [listaConsultas, setListaConsultas] = useState(() => {
        return leerConsultas();
    });

    useEffect(() => {
        const actualizar = () => {
            setListaConsultas(leerConsultas());
        };

        window.addEventListener('servicios:actualizar', actualizar);

        return () => {
            window.removeEventListener('servicios:actualizar', actualizar);
        };
    }, []);

  return (
        <main className="container">
            <div className="container-fluid justify-content-center h-100 min-vh-100 row">
                <h1 className="titulo-servicio">Consultas Nutricionales</h1>

                {listaConsultas.map((servicio) => (
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
export default Consultas;