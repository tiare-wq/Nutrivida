import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Ver from '../pages/privado/Ver';

import {
    leerConsultas,
    leerEvaluaciones,
    leerPlanes,
    leerTalleres
} from '../data/servicios';

const datosIniciales = {
    consultas: [
        { id: 'C1', nombre: 'Consulta nutricional', modalidad: 'Online', precio: '30.000' },
        { id: 'C2', nombre: 'Consulta deportiva', modalidad: 'Presencial', precio: '35.000' }
    ],
    evaluaciones: [
        { id: 'E1', nombre: 'Evaluación nutricional', modalidad: 'Online', precio: '25.000' },
        { id: 'E2', nombre: 'Evaluación física', modalidad: 'Presencial', precio: '20.000' }
    ],
    planes: [
        { id: 'P1', nombre: 'Plan básico', modalidad: 'Online', precio: '40.000' },
        { id: 'P2', nombre: 'Plan premium', modalidad: 'Presencial', precio: '60.000' }
    ],
    talleres: [
        { id: 'T1', nombre: 'Taller alimentación', modalidad: 'Online', precio: '15.000' },
        { id: 'T2', nombre: 'Taller saludable', modalidad: 'Presencial', precio: '18.000' }
    ]
};

beforeEach(() => {
    localStorage.clear();

    localStorage.setItem('consultas', JSON.stringify(datosIniciales.consultas));
    localStorage.setItem('evaluaciones', JSON.stringify(datosIniciales.evaluaciones));
    localStorage.setItem('planes', JSON.stringify(datosIniciales.planes));
    localStorage.setItem('talleres', JSON.stringify(datosIniciales.talleres));
});

const seleccionarAtencion = (categoria) => {
    fireEvent.change(screen.getByLabelText('Tipo atención'), {
        target: { value: categoria }
    });
};

describe('Componente Ver', () => {

    test('1. Debe renderizar el formulario y la tabla', () => {
        render(<Ver />);

        expect(screen.getByRole('heading', {
            name: 'Ver ofertas de servicios'
        })).toBeInTheDocument();

        expect(screen.getByLabelText('Tipo atención')).toBeInTheDocument();

        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    test('2. Debe mostrar las cuatro opciones de atención', () => {
        render(<Ver />);

        const select = screen.getByLabelText('Tipo atención');

        expect(within(select).getByRole('option', { name: 'Consulta' })).toBeInTheDocument();
        expect(within(select).getByRole('option', { name: 'Evaluación' })).toBeInTheDocument();
        expect(within(select).getByRole('option', { name: 'Planes / Servicios' })).toBeInTheDocument();
        expect(within(select).getByRole('option', { name: 'Taller' })).toBeInTheDocument();
    });

    test('3. No debe mostrar servicios si no se selecciona una categoría', () => {
        render(<Ver />);

        const filas = screen.getAllByRole('row');

        // Solo debe existir la fila de encabezados.
        expect(filas).toHaveLength(1);
    });

    test('4. Debe mostrar las consultas seleccionadas', () => {
        render(<Ver />);

        seleccionarAtencion('Consultas');

        expect(screen.getByText('Consultas')).toBeInTheDocument();
        expect(screen.getByText('C1')).toBeInTheDocument();
        expect(screen.getByText('Consulta nutricional')).toBeInTheDocument();
        expect(screen.getByText('Consulta deportiva')).toBeInTheDocument();

        expect(leerConsultas()).toHaveLength(2);
    });

    test('5. Debe actualizar la tabla al cambiar la categoría', () => {
        render(<Ver />);

        seleccionarAtencion('Consultas');

        expect(screen.getByText('Consulta nutricional')).toBeInTheDocument();

        seleccionarAtencion('Talleres');

        expect(screen.getByText('Taller alimentación')).toBeInTheDocument();

        expect(screen.queryByText('Consulta nutricional')).not.toBeInTheDocument();
    });
});