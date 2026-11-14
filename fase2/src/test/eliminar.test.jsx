import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Eliminar from '../pages/privado/Eliminar';
import {
    leerConsultas,
    leerEvaluaciones,
    leerPlanes,
    leerTalleres,
} from '../data/servicios';

describe('Componente Eliminar', () => {

    const datosIniciales = {
        consultas: [
            { id: 'C1', nombre: 'Consulta nutricional' },
            { id: 'C2', nombre: 'Consulta deportiva' },
        ],
        evaluaciones: [
            { id: 'E1', nombre: 'Evaluación nutricional' },
            { id: 'E2', nombre: 'Evaluación física' },
        ],
        planes: [
            { id: 'P1', nombre: 'Plan básico' },
            { id: 'P2', nombre: 'Plan premium' },
        ],
        talleres: [
            { id: 'T1', nombre: 'Taller alimentación' },
            { id: 'T2', nombre: 'Taller saludable' },
        ],
    };

    beforeEach(() => {
        localStorage.clear();

        localStorage.setItem('consultas', JSON.stringify(datosIniciales.consultas));
        localStorage.setItem('evaluaciones', JSON.stringify(datosIniciales.evaluaciones));
        localStorage.setItem('planes', JSON.stringify(datosIniciales.planes));
        localStorage.setItem('talleres', JSON.stringify(datosIniciales.talleres));

        vi.restoreAllMocks();
        vi.spyOn(window, 'confirm').mockReturnValue(true);
    });

    const seleccionarServicio = (categoria, id) => {
        fireEvent.change(screen.getByLabelText('Tipo atención'), {
            target: { value: categoria },
        });

        fireEvent.change(screen.getByLabelText('Nombre del servicio'), {
            target: { value: id },
        });
    };

    const enviarFormulario = () => {
        fireEvent.submit(
            screen.getByRole('button', { name: 'Eliminar' }).closest('form')
        );
    };

    test('1. Renderiza correctamente el formulario', () => {
        render(<Eliminar />);

        expect(screen.getByRole('heading', {
            name: 'Eliminar oferta de servicio',
        })).toBeInTheDocument();

        expect(screen.getByRole('button', {
            name: 'Eliminar',
        })).toBeInTheDocument();

        expect(screen.getByLabelText('Tipo atención')).toBeInTheDocument();
        expect(screen.getByLabelText('Nombre del servicio')).toBeInTheDocument();
    });

    test('2. Muestra las cuatro categorías disponibles', () => {
        render(<Eliminar />);

        expect(screen.getByRole('option', {
            name: 'Consulta',
        })).toBeInTheDocument();

        expect(screen.getByRole('option', {
            name: 'Evaluación',
        })).toBeInTheDocument();

        expect(screen.getByRole('option', {
            name: 'Planes / Servicios',
        })).toBeInTheDocument();

        expect(screen.getByRole('option', {
            name: 'Taller',
        })).toBeInTheDocument();
    });

    test('3. Solicita confirmación antes de eliminar', () => {
        render(<Eliminar />);

        seleccionarServicio('1', 'C1');
        enviarFormulario();

        expect(window.confirm).toHaveBeenCalledTimes(1);

        expect(window.confirm).toHaveBeenCalledWith(
            '¿Desea confirmar la eliminación?'
        );
    });

    test('4. Elimina correctamente una consulta', () => {
        render(<Eliminar />);

        seleccionarServicio('1', 'C1');
        enviarFormulario();

        expect(leerConsultas()).toEqual([
            { id: 'C2', nombre: 'Consulta deportiva' },
        ]);

        expect(JSON.parse(localStorage.getItem('consultas'))).toEqual([
            { id: 'C2', nombre: 'Consulta deportiva' },
        ]);
    });

    test('5. Elimina correctamente una evaluación', () => {
        render(<Eliminar />);

        seleccionarServicio('2', 'E1');
        enviarFormulario();

        expect(leerEvaluaciones()).toEqual([
            { id: 'E2', nombre: 'Evaluación física' },
        ]);

        expect(JSON.parse(localStorage.getItem('evaluaciones'))).toEqual([
            { id: 'E2', nombre: 'Evaluación física' },
        ]);
    });

    test('6. Elimina correctamente un plan', () => {
        render(<Eliminar />);

        seleccionarServicio('3', 'P1');
        enviarFormulario();

        expect(leerPlanes()).toEqual([
            { id: 'P2', nombre: 'Plan premium' },
        ]);

        expect(JSON.parse(localStorage.getItem('planes'))).toEqual([
            { id: 'P2', nombre: 'Plan premium' },
        ]);
    });

    test('7. Elimina correctamente un taller', () => {
        render(<Eliminar />);

        seleccionarServicio('4', 'T1');
        enviarFormulario();

        expect(leerTalleres()).toEqual([
            { id: 'T2', nombre: 'Taller saludable' },
        ]);

        expect(JSON.parse(localStorage.getItem('talleres'))).toEqual([
            { id: 'T2', nombre: 'Taller saludable' },
        ]);
    });

    test('8. No elimina el servicio cuando se cancela la confirmación', () => {
        window.confirm.mockReturnValue(false);

        render(<Eliminar />);

        seleccionarServicio('1', 'C1');
        enviarFormulario();

        expect(window.confirm).toHaveBeenCalledTimes(1);

        expect(leerConsultas()).toEqual(datosIniciales.consultas);
    });

    test('9. No modifica los registros cuando el ID no existe', () => {
        render(<Eliminar />);

        seleccionarServicio('1', 'C99');
        enviarFormulario();

        expect(leerConsultas()).toEqual(datosIniciales.consultas);
    });

    test('10. No modifica los registros cuando el ID está vacío', () => {
        render(<Eliminar />);

        fireEvent.change(screen.getByLabelText('Tipo atención'), {
            target: { value: '1' },
        });

        enviarFormulario();

        expect(leerConsultas()).toEqual(datosIniciales.consultas);
    });
});
