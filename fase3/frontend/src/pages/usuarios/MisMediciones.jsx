import { useEffect, useState } from 'react';
import { solicitar } from '../../api/usuarios';
import HistorialMediciones from '../../components/HistorialMediciones';

export default function MisMediciones() {
    const [informe, setInforme] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let vigente = true;

        solicitar('/api/pacientes/me/informe')
            .then((datos) => {
                if (vigente) {
                    setInforme(datos);
                }
            })
            .catch((error) => {
                if (vigente) {
                    setError(error.message);
                }
            });

        return () => {
            vigente = false;
        };
    }, []);

    return (
        <section className="card-private">
            <h1>Mis medidas</h1>
            <p>Consulta tus registros de estatura, peso, cintura y cadera.</p>
            {error && <p role="alert">{error}</p>}
            {!informe && !error && <p role="status">Cargando informe…</p>}
            {informe && (
                <>
                    <p>
                        Profesional asignado:{' '}
                        {informe.profesional
                            ? `${informe.profesional.nombre} · ${informe.profesional.especialidad}`
                            : 'Pendiente de asignación'}
                    </p>
                    <HistorialMediciones mediciones={informe.mediciones} />
                </>
            )}
        </section>
    );
}
