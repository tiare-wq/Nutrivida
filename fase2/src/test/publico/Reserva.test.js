import { render, screen, fireEvent } from '@testing-library/react';
import Reserva from '../../pages/publico/Reserva'

describe (<Reserva />, () => {
    test("render the Reserva component", () => {
        render(<Reserva />)
        const campoAtencion = screen.getById("atencion-select");
        const campoServicio = screen.getById("servicio-select");
        const campoProfesional = screen.getById("profesional-select")
        const submit = screen.getById("btn-form");

        expect(campoAtencion).toBeInTheDocument();
        expect(campoServicio).toBeInTheDocument();
        expect(campoProfesional).toBeInTheDocument();
        expect(submit).toBeInTheDocument();
    });

    test("change the text content of submit when completed the labels", () => {
        const campoAtencion = screen.getById("atencion-select");
        const campoServicio = screen.getById("servicio-select");
        const campoProfesional = screen.getById("profesional-select")
        const submit = screen.getById("btn-form");

        fireEvent.onChange(campoAtencion.value !== "");
        fireEvent.onChange(campoServicio.value !== "");
        fireEvent.onChange(campoAtencion.value !== "");
        
        expect(submit).getValue("Enviar");
    })
})