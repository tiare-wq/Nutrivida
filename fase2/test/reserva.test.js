import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import Reserva from '../pages/Reserva'; 


const mockNavigate = vi.fn();
let mockLocationState = null;

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: mockLocationState })
}));


vi.mock('../../components/Calendario', () => ({
    default: ({ onFechaSeleccionada }) => (
        <div data-testid="mock-calendario">
            <button
                type="button"
                onClick={() => onFechaSeleccionada(new Date())}
            >
                Seleccionar Fecha Hoy
            </button>
        </div>
    )
}));


vi.mock('../../data/consultas', () => ({
    default: [
        { id: 'c1', nombre: 'Consulta Nutricional Inicial', atencion: 'consultas', tpProfesional: 'clinico', precio: 25000 }
    ]
}));
vi.mock('../../data/evaluaciones', () => ({ default: [] }));
vi.mock('../../data/planes', () => ({ default: [] }));
vi.mock('../../data/talleres', () => ({ default: [] }));


vi.mock('../../data/almacen', () => ({
    pacienteActual: vi.fn(),
    guardarReserva: vi.fn(),
    horaOcupada: vi.fn(),
    fechaClave: vi.fn(() => '2026-10-20')
}));

import { pacienteActual, guardarReserva, horaOcupada } from '../../data/almacen';

describe('Pruebas Unitarias - Módulo Reserva (Nutrivida)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockLocationState = null;
        horaOcupada.mockReturnValue(false); 
    });

    test('1. Redirige a /login si el paciente no ha iniciado sesión al hacer clic en reservar', () => {
        pacienteActual.mockReturnValue(null);
        render(<Reserva />);
        const boton = screen.getByRole('button', { name: /inicia sesión para reservar/i });
        expect(boton).toBeInTheDocument();
        fireEvent.click(boton);
        expect(mockNavigate).toHaveBeenCalledWith('/login', {
            state: { next: '/reservas', reserva: { atencion: '', servicio: '' } }
        });
    });

    
    test('2. Muestra los selectores iniciales y el nombre del paciente cuando inició sesión', () => {
        pacienteActual.mockReturnValue({ nombre: 'Juan Pérez' });

        render(<Reserva />);
        expect(screen.getByText(/paciente: juan pérez/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/tipo de atención/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/servicio \/ plan/i)).toBeDisabled();
        expect(screen.getByLabelText(/profesional/i)).toBeDisabled();
        expect(screen.getByRole('button', { name: /confirmar reserva/i })).toBeInTheDocument();
    });

    
    test('3. Habilita los desplegables de servicio y profesional según la selección en cascada', () => {
        pacienteActual.mockReturnValue({ nombre: 'Juan Pérez' });
        render(<Reserva />);
        const selectAtencion = screen.getByLabelText(/tipo de atención/i);
        fireEvent.change(selectAtencion, { target: { value: 'consultas' } });
        const selectServicio = screen.getByLabelText(/servicio \/ plan/i);
        expect(selectServicio).not.toBeDisabled();
        fireEvent.change(selectServicio, { target: { value: 'c1' } });
        const selectProfesional = screen.getByLabelText(/profesional/i);
        expect(selectProfesional).not.toBeDisabled();
        fireEvent.change(selectProfesional, { target: { value: 'Carolina Pérez' } });
        expect(screen.getByTestId('mock-calendario')).toBeInTheDocument();
        expect(screen.getByText(/horas disponibles/i)).toBeInTheDocument();
    });


    test('4. Muestra un mensaje de error si no se selecciona hora o profesional antes de enviar', () => {
        pacienteActual.mockReturnValue({ nombre: 'Juan Pérez' });
        render(<Reserva />);
        fireEvent.change(screen.getByLabelText(/tipo de atención/i), { target: { value: 'consultas' } });
        fireEvent.change(screen.getByLabelText(/servicio \/ plan/i), { target: { value: 'c1' } });
        fireEvent.click(screen.getByRole('button', { name: /confirmar reserva/i }));
        const alerta = screen.getByRole('alert');
        expect(alerta).toBeInTheDocument();
        expect(alerta.textContent).toMatch(/selecciona un servicio, profesional, fecha y hora válidos/i);
        expect(guardarReserva).not.toHaveBeenCalled();
    });

  
    test('5. Muestra mensaje de error si la hora seleccionada ya fue reservada por otro paciente', () => {
        pacienteActual.mockReturnValue({ nombre: 'Juan Pérez' });
        guardarReserva.mockReturnValue(null);
        render(<Reserva />);
        fireEvent.change(screen.getByLabelText(/tipo de atención/i), { target: { value: 'consultas' } });
        fireEvent.change(screen.getByLabelText(/servicio \/ plan/i), { target: { value: 'c1' } });
        fireEvent.change(screen.getByLabelText(/profesional/i), { target: { value: 'Carolina Pérez' } });
        const radioHora = screen.getByDisplayValue('10:00');
        fireEvent.click(radioHora);
        fireEvent.click(screen.getByRole('button', { name: /confirmar reserva/i }));
        const alerta = screen.getByRole('alert');
        expect(alerta.textContent).toMatch(/esa hora ya está reservada. elige otra disponible/i);
    });

   
    test('6. Procesa la reserva correctamente y navega a /confirmacion-reserva', () => {
        pacienteActual.mockReturnValue({ nombre: 'Juan Pérez' });
        const mockReservaCreada = {
            servicio: 'Consulta Nutricional Inicial',
            profesional: 'Carolina Pérez',
            precio: 25000,
            fecha: '2026-10-20',
            hora: '10:00'
        };
        guardarReserva.mockReturnValue(mockReservaCreada);
        render(<Reserva />);
        fireEvent.change(screen.getByLabelText(/tipo de atención/i), { target: { value: 'consultas' } });
        fireEvent.change(screen.getByLabelText(/servicio \/ plan/i), { target: { value: 'c1' } });
        fireEvent.change(screen.getByLabelText(/profesional/i), { target: { value: 'Carolina Pérez' } });
        const radioHora = screen.getByDisplayValue('10:00');
        fireEvent.click(radioHora);
        fireEvent.click(screen.getByRole('button', { name: /confirmar reserva/i }));

     
        expect(guardarReserva).toHaveBeenCalledWith({
            servicio: 'Consulta Nutricional Inicial',
            profesional: 'Carolina Pérez',
            precio: 25000,
            fecha: '2026-10-20',
            hora: '10:00'
        });

        expect(mockNavigate).toHaveBeenCalledWith('/confirmacion-reserva', {
            state: mockReservaCreada
        });
    });

   
    test('7. Carga la atención y servicio preseleccionados si vienen desde location.state', () => {
        pacienteActual.mockReturnValue({ nombre: 'Juan Pérez' });
        mockLocationState = { atencion: 'consultas', servicio: 'c1' };
        render(<Reserva />);
        expect(screen.getByLabelText(/tipo de atención/i)).toHaveValue('consultas');
        expect(screen.getByLabelText(/servicio \/ plan/i)).toHaveValue('c1');
    });

});