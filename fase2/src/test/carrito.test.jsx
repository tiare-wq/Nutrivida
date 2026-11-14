import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';

import Carrito from '../pages/publico/Carrito';

import pacientes from '../data/pacientes';
import planes from '../data/planes';

import {
    cambiarCantidad,
    compradosEsteAnio,
    leerCarrito,
    leerPacientes,
    pacienteActual,
    quitarPlan,
    registrarPedido,
} from '../data/almacen';

const paciente = pacientes[0];

const mostrarCarrito = () => {
    return render(
        <MemoryRouter>
            <Carrito />
        </MemoryRouter>
    );
};

function guardarCarrito(datos) {
    localStorage.setItem(
        `carrito-${paciente.id}`,
        JSON.stringify(datos)
    );
}

describe('Pruebas unitarias del carrito NutriVida', () => {

    beforeEach(() => {
        localStorage.clear();

        localStorage.setItem(
            'pacientes',
            JSON.stringify(pacientes)
        );

        localStorage.setItem(
            'pacienteId',
            String(paciente.id)
        );
    });

    // TEST 1
    test('1. Solicita iniciar sesión cuando no hay paciente', () => {
        localStorage.removeItem('pacienteId');

        mostrarCarrito();

        expect(
            screen.getByText(/Inicia sesión con tu cuenta de paciente/i)
        ).toBeInTheDocument();

        expect(
            screen.getByRole('link', { name: 'Iniciar sesión' })
        ).toHaveAttribute('href', '/login');

        expect(pacienteActual()).toBeNull();
    });

    // TEST 2
    test('2. Muestra el carrito vacío', () => {
        mostrarCarrito();

        expect(
            screen.getByText('Aún no tienes planes en el carrito.')
        ).toBeInTheDocument();

        expect(
            screen.getByRole('link', { name: 'Ver planes' })
        ).toHaveAttribute('href', '/planes');

        expect(leerCarrito(paciente.id)).toEqual([]);
    });

    // TEST 3
    test('3. Muestra el nombre del paciente y sus planes registrados', () => {
        mostrarCarrito();

        expect(
            screen.getByText(
                new RegExp(`${paciente.nombre} · ${compradosEsteAnio(paciente)} de 10 planes registrados`, 'i')
            )
        ).toBeInTheDocument();
    });

    // TEST 4
    test('4. Muestra correctamente los planes agregados', () => {
        guardarCarrito([
            { id: 'P1', cantidad: 1 },
            { id: 'P2', cantidad: 1 },
        ]);

        mostrarCarrito();

        expect(
            screen.getByRole('heading', {
                name: 'Plan de pérdida de peso (1 mes)'
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                name: 'Plan de pérdida de peso (3 meses)'
            })
        ).toBeInTheDocument();

        expect(planes.some(plan => plan.id === 'P1')).toBe(true);
        expect(planes.some(plan => plan.id === 'P2')).toBe(true);
    });

    // TEST 5
    test('5. Calcula correctamente el total del carrito', () => {
        guardarCarrito([
            { id: 'P1', cantidad: 2 },
            { id: 'P2', cantidad: 1 },
        ]);

        mostrarCarrito();

        // P1: 65.000 x 2 = 130.000
        // P2: 170.000 x 1 = 170.000
        // Total: 300.000

        expect(
            screen.getByText('Total: $300.000')
        ).toBeInTheDocument();

        expect(
            screen.getByText('3 planes · máximo 10 por año')
        ).toBeInTheDocument();
    });

    // TEST 6
    test('6. Permite actualizar la cantidad de planes', () => {
        guardarCarrito([
            { id: 'P1', cantidad: 1 },
        ]);

        mostrarCarrito();

        fireEvent.change(screen.getByLabelText('Cantidad'), {
            target: { value: '3' },
        });

        expect(cambiarCantidad('P1', 3)).toBe(true);

        expect(leerCarrito(paciente.id)).toEqual([
            { id: 'P1', cantidad: 3 },
        ]);
    });

    // TEST 7
    test('7. Muestra error cuando se supera el límite anual', () => {
        guardarCarrito([
            { id: 'P1', cantidad: 1 },
        ]);

        mostrarCarrito();

        fireEvent.change(screen.getByLabelText('Cantidad'), {
            target: { value: '11' },
        });

        expect(
            screen.getByRole('alert')
        ).toHaveTextContent(
            'Puedes elegir hasta 10 planes por año'
        );

        expect(cambiarCantidad('P1', 11)).toBe(false);
    });

    // TEST 8
    test('8. Permite quitar un plan del carrito', () => {
        guardarCarrito([
            { id: 'P1', cantidad: 1 },
        ]);

        mostrarCarrito();

        fireEvent.click(
            screen.getByRole('button', { name: 'Quitar' })
        );

        quitarPlan('P1');

        expect(leerCarrito(paciente.id)).toEqual([]);
    });

    // TEST 9
    test('9. Registra correctamente un pedido', () => {
        guardarCarrito([
            { id: 'P1', cantidad: 1 },
        ]);

        mostrarCarrito();

        fireEvent.click(
            screen.getByRole('button', { name: 'Registrar pedido' })
        );

        // Comprueba que el carrito quedó vacío.
        expect(leerCarrito(paciente.id)).toEqual([]);

        // Comprueba que el pedido se guardó en el historial.
        const pacienteActualizado = leerPacientes()
            .find(persona => persona.id === paciente.id);

        expect(pacienteActualizado.historial).toHaveLength(1);

        expect(pacienteActualizado.historial[0].planes).toEqual([
            {
                id: 'P1',
                nombre: planes.find(plan => plan.id === 'P1').nombre,
                precio: planes.find(plan => plan.id === 'P1').precio,
                cantidad: 1,
            },
        ]);

        expect(
            screen.getByRole('link', { name: 'Mis planes' })
        ).toHaveAttribute('href', '/mis-planes');
    });

    // TEST 10
    test('10. Muestra error si no se puede registrar el pedido', () => {
        const anio = new Date().getFullYear();

        const pacienteConLimite = {
            ...paciente,
            historial: [
                {
                    fecha: `${anio}-01-01`,
                    planes: [
                        { id: 'P1', cantidad: 10 },
                    ],
                },
            ],
        };

        localStorage.setItem(
            'pacientes',
            JSON.stringify([pacienteConLimite])
        );

        guardarCarrito([
            { id: 'P1', cantidad: 1 },
        ]);

        mostrarCarrito();

        expect(registrarPedido()).toBeNull();

        // El pedido no debe modificar el carrito si se rechaza.
        expect(leerCarrito(paciente.id)).toEqual([
            { id: 'P1', cantidad: 1 },
        ]);
    });

});
