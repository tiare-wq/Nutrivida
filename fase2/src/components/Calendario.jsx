import { useState } from "react";

function Calendario({ fechaInicial, onFechaSeleccionada }) {

    const [fechaVisible, setFechaVisible] = useState(
        new Date(
            fechaInicial.getFullYear(),
            fechaInicial.getMonth(),
            fechaInicial.getDate()
        )
    );

    const [fechaSeleccionada, setFechaSeleccionada] = useState(fechaVisible);

    const fechaLimiteSuperior = new Date();
    fechaLimiteSuperior.setFullYear(fechaLimiteSuperior.getFullYear() + 1);
    const fechaLimiteInferior = new Date();
    fechaLimiteInferior.setFullYear(fechaLimiteInferior.getFullYear() - 1);

    const mesActual = fechaVisible.getMonth();
    const anioActual = fechaVisible.getFullYear();

    const diasMes = new Date(
        anioActual,
        mesActual + 1,
        0
    ).getDate();

    const primerDia = new Date(
        anioActual,
        mesActual,
        1
    ).getDay();

    const posicionPrimerDia = (primerDia + 6) % 7;

    const nombreMes = fechaVisible.toLocaleDateString("es-CL", {
        month: "long",
        year: "numeric"
    });

    const seleccionarDia = (dia) => {
        const nuevoDia = new Date(anioActual, mesActual, dia);
        
        setFechaSeleccionada(
            nuevoDia
        );

        onFechaSeleccionada(
            nuevoDia
        );
    };

    const mesAnterior = () => {
        const nuevaFecha = new Date(anioActual, mesActual - 1, 1);
        if (nuevaFecha < fechaLimiteInferior)
            return;

        setFechaVisible(
            nuevaFecha
        );
    };

    const mesSiguiente = () => {
        const nuevaFecha = new Date(anioActual, mesActual + 1, 1);
        if (nuevaFecha > fechaLimiteSuperior)
            return;

        setFechaVisible(
            nuevaFecha
        );
    };

    const inicialesDias = ["L", "M", "Mi", "J", "V", "S", "D"];

    const dias = [
        ...inicialesDias.map((dia, i) => (
            <div className="week-day" key={`semana-${i}`}>
                <p><b>{dia}</b></p>
            </div>
        )),

        ...Array.from(
            { length: posicionPrimerDia },
            (_, i) => (
                <div
                    className="calendar-day empty"
                    key={`vacio-${i}`}
                />
            )
        ),

        ...Array.from(
            { length: diasMes },
            (_, i) => {
                const dia = i + 1;

                const seleccionado =
                    fechaSeleccionada.getDate() === dia &&
                    fechaSeleccionada.getMonth() === mesActual &&
                    fechaSeleccionada.getFullYear() === anioActual;

                return (
                    <button
                        type="button"
                        key={`dia-${dia}`}
                        className={`calendar-day ${
                            seleccionado ? "seleccionado" : ""
                        }`}
                        onClick={() => seleccionarDia(dia)}
                    >
                        {dia}
                    </button>
                );
            }
        )
    ];

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button
                    type="button"
                    className="calendar-btn"
                    onClick={mesAnterior}
                    aria-label="Mes anterior"
                >&lt;</button>

                <h3>
                    {nombreMes.charAt(0).toUpperCase()
                        + nombreMes.slice(1)}
                </h3>
                <button
                    type="button"
                    className="calendar-btn "
                    onClick={mesSiguiente}
                    aria-label="Mes siguiente"
                >&gt;</button>
            </div>

            <div className="calendar-body">
                {dias}
            </div>
        </div>
    );
}

export default Calendario;