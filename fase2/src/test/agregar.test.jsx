import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Agregar from '../pages/privado/Agregar';

const mocks = vi.hoisted(() => ({
    leerConsultas: vi.fn(),
    leerEvaluaciones: vi.fn(),
    leerPlanes: vi.fn(),
    leerTalleres: vi.fn(),
    agregarConsulta: vi.fn(),
    agregarEvaluaciones: vi.fn(),
    agregarPlanes: vi.fn(),
    agregarTalleres: vi.fn(),
}));

vi.mock('../data/servicios', () => ({
    leerConsultas: mocks.leerConsultas,
    leerEvaluaciones: mocks.leerEvaluaciones,
    leerPlanes: mocks.leerPlanes,
    leerTalleres: mocks.leerTalleres,
    agregarConsulta: mocks.agregarConsulta,
    agregarEvaluaciones: mocks.agregarEvaluaciones,
    agregarPlanes: mocks.agregarPlanes,
    agregarTalleres: mocks.agregarTalleres,
}));

describe('Componente Agregar', () => {

    beforeEach(() => {
        vi.resetAllMocks();

        mocks.leerConsultas.mockReturnValue([]);
        mocks.leerEvaluaciones.mockReturnValue([]);
        mocks.leerPlanes.mockReturnValue([]);
        mocks.leerTalleres.mockReturnValue([]);
    });

    const completarFormulario = (categoria = '1') => {
        fireEvent.change(screen.getByLabelText('Tipo atención'), {
            target: { value: categoria },
        });

        fireEvent.change(screen.getByLabelText('Nombre del servicio'), {
            target: { value: 'Consulta nutricional' },
        });

        fireEvent.change(screen.getByLabelText('Descripción'), {
            target: { value: 'Atención nutricional personalizada' },
        });

        fireEvent.change(screen.getByLabelText('Tipo profesional'), {
            target: { value: 'clinico' },
        });

        fireEvent.change(screen.getByLabelText('Duración'), {
            target: { value: '50 min' },
        });

        fireEvent.change(screen.getByLabelText('Modalidad'), {
            target: { value: 'Presencial' },
        });

        fireEvent.change(screen.getByLabelText('Precio'), {
            target: { value: '35.000' },
        });

        fireEvent.change(screen.getByLabelText('Acción'), {
            target: { value: 'Reservar ahora' },
        });
    };

    test('1. Renderiza correctamente el formulario', () => {
        render(<Agregar />);

        expect(screen.getByRole('heading', {
            name: 'Agregar oferta de servicio',
        })).toBeInTheDocument();

        expect(screen.getByRole('button', {
            name: 'Agregar',
        })).toBeInTheDocument();
    });

    test('2. Muestra un error cuando los campos están vacíos', () => {
        render(<Agregar />);

        fireEvent.click(screen.getByRole('button', {
            name: 'Agregar',
        }));

        expect(screen.getByText(
            'Todos los campos son obligatorios.'
        )).toBeInTheDocument();

        expect(mocks.agregarConsulta).not.toHaveBeenCalled();
        expect(mocks.agregarEvaluaciones).not.toHaveBeenCalled();
        expect(mocks.agregarPlanes).not.toHaveBeenCalled();
        expect(mocks.agregarTalleres).not.toHaveBeenCalled();
    });

    test('3. Rechaza nombres con menos de 5 caracteres', () => {
        render(<Agregar />);
        completarFormulario();

        fireEvent.change(screen.getByLabelText('Nombre del servicio'), {
            target: { value: 'ABC' },
        });

        fireEvent.click(screen.getByRole('button', {
            name: 'Agregar',
        }));

        expect(screen.getByText(
            'El nombre debe contener al menos 5 caracteres.'
        )).toBeInTheDocument();

        expect(mocks.agregarConsulta).not.toHaveBeenCalled();
    });

    test('4. Rechaza una duración con formato inválido', () => {
        render(<Agregar />);
        completarFormulario();

        fireEvent.change(screen.getByLabelText('Duración'), {
            target: { value: 'cincuenta minutos' },
        });

        fireEvent.click(screen.getByRole('button', {
            name: 'Agregar',
        }));

        expect(screen.getByText(
            'La duración debe tener un formato válido. Ejemplo: 50 min o 1 hora.'
        )).toBeInTheDocument();

        expect(mocks.agregarConsulta).not.toHaveBeenCalled();
    });

    test('5. Rechaza un precio con formato inválido', () => {
        render(<Agregar />);
        completarFormulario();

        fireEvent.change(screen.getByLabelText('Precio'), {
            target: { value: '35mil' },
        });

        fireEvent.click(screen.getByRole('button', {
            name: 'Agregar',
        }));

        expect(screen.getByText(
            'Ingresa un precio válido mayor que cero. Ejemplo: 35.000.'
        )).toBeInTheDocument();

        expect(mocks.agregarConsulta).not.toHaveBeenCalled();
    });

    test('6. Agrega correctamente una consulta', () => {
        mocks.leerConsultas.mockReturnValue([
            { id: 'C1' },
            { id: 'C2' },
        ]);

        render(<Agregar />);
        completarFormulario('1');

        fireEvent.click(screen.getByRole('button', {
            name: 'Agregar',
        }));

        expect(mocks.agregarConsulta).toHaveBeenCalledTimes(1);

        expect(mocks.agregarConsulta).toHaveBeenCalledWith({
            nombre: 'Consulta nutricional',
            descr: 'Atención nutricional personalizada',
            tpProfesional: 'clinico',
            duracion: '50 min',
            modalidad: 'Presencial',
            precio: '35.000',
            accion: 'Reservar ahora',
            atencion: 'consulta',
            id: 'C3',
        });

        expect(screen.getByText(
            'Servicio agregado con éxito'
        )).toBeInTheDocument();
    });

    test('7. Agrega correctamente una evaluación', () => {
        mocks.leerEvaluaciones.mockReturnValue([
            { id: 'E1' },
        ]);

        render(<Agregar />);
        completarFormulario('2');

        fireEvent.click(screen.getByRole('button', {
            name: 'Agregar',
        }));

        expect(mocks.agregarEvaluaciones).toHaveBeenCalledTimes(1);

        expect(mocks.agregarEvaluaciones).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'E2',
                atencion: 'evaluaciones',
                nombre: 'Consulta nutricional',
            })
        );

        expect(screen.getByText(
            'Servicio agregado con éxito'
        )).toBeInTheDocument();
    });

    test('8. Agrega correctamente un plan', () => {
        mocks.leerPlanes.mockReturnValue([
            { id: 'P1' },
            { id: 'P2' },
        ]);

        render(<Agregar />);
        completarFormulario('3');

        fireEvent.click(screen.getByRole('button', {
            name: 'Agregar',
        }));

        expect(mocks.agregarPlanes).toHaveBeenCalledTimes(1);

        expect(mocks.agregarPlanes).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'P3',
                atencion: 'planes',
                nombre: 'Consulta nutricional',
            })
        );

        expect(screen.getByText(
            'Servicio agregado con éxito'
        )).toBeInTheDocument();
    });

    test('9. Agrega correctamente un taller', () => {
        mocks.leerTalleres.mockReturnValue([
            { id: 'T1' },
        ]);

        render(<Agregar />);
        completarFormulario('4');

        fireEvent.click(screen.getByRole('button', {
            name: 'Agregar',
        }));

        expect(mocks.agregarTalleres).toHaveBeenCalledTimes(1);

        expect(mocks.agregarTalleres).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'T2',
                atencion: 'talleres',
                nombre: 'Consulta nutricional',
            })
        );

        expect(screen.getByText(
            'Servicio agregado con éxito'
        )).toBeInTheDocument();
    });

    test('10. Rechaza un precio igual a cero', () => {
        render(<Agregar />);
        completarFormulario();

        fireEvent.change(screen.getByLabelText('Precio'), {
            target: { value: '0' },
        });

        fireEvent.click(screen.getByRole('button', {
            name: 'Agregar',
        }));

        expect(screen.getByText(
            'Ingresa un precio válido mayor que cero. Ejemplo: 35.000.'
        )).toBeInTheDocument();

        expect(mocks.agregarConsulta).not.toHaveBeenCalled();
    });
});