
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';

import Carrito from '../pages/publico/Carrito';
import {
  cambiarCantidad,
  compradosEsteAnio,
  leerCarrito,
  pacienteActual,
  quitarPlan,
  registrarPedido,
} from '../data/almacen';

// Simular los planes del proyecto
vi.mock('../data/planes', () => ({
  default: [
    { id: 1, nombre: 'Plan Básico', precio: '15.000' },
    { id: 2, nombre: 'Plan Premium', precio: '25.000' },
  ],
}));

// Simular las funciones de almacenamiento
vi.mock('../data/almacen', () => ({
  cambiarCantidad: vi.fn(),
  compradosEsteAnio: vi.fn(),
  leerCarrito: vi.fn(),
  pacienteActual: vi.fn(),
  quitarPlan: vi.fn(),
  registrarPedido: vi.fn(),
}));

const paciente = {
  id: 1,
  nombre: 'Camila González',
};

const mostrarCarrito = () => {
  return render(
    <MemoryRouter>
      <Carrito />
    </MemoryRouter>
  );
};

describe('Pruebas unitarias del carrito NutriVida', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    pacienteActual.mockReturnValue(paciente);
    compradosEsteAnio.mockReturnValue(2);
    leerCarrito.mockReturnValue([]);
    cambiarCantidad.mockReturnValue(true);
    registrarPedido.mockReturnValue({ id: 101 });
  });

  // TEST 1
  it('1. Solicita iniciar sesión cuando no hay paciente', () => {
    pacienteActual.mockReturnValue(null);

    mostrarCarrito();

    expect(
      screen.getByText(/Inicia sesión con tu cuenta de paciente/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Iniciar sesión' })
    ).toHaveAttribute('href', '/login');
  });

  // TEST 2
  it('2. Muestra el carrito vacío', () => {
    mostrarCarrito();

    expect(
      screen.getByText('Aún no tienes planes en el carrito.')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Ver planes' })
    ).toHaveAttribute('href', '/planes');
  });

  // TEST 3
  it('3. Muestra el nombre del paciente y sus planes registrados', () => {
    mostrarCarrito();

    expect(
      screen.getByText(/Camila González · 2 de 10 planes registrados/i)
    ).toBeInTheDocument();
  });

  // TEST 4
  it('4. Muestra correctamente los planes agregados', () => {
    leerCarrito.mockReturnValue([
      { id: 1, cantidad: 1 },
      { id: 2, cantidad: 1 },
    ]);

    mostrarCarrito();

    expect(
      screen.getByRole('heading', { name: 'Plan Básico' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Plan Premium' })
    ).toBeInTheDocument();
  });

  // TEST 5
  it('5. Calcula correctamente el total del carrito', () => {
    leerCarrito.mockReturnValue([
      { id: 1, cantidad: 2 },
      { id: 2, cantidad: 1 },
    ]);

    mostrarCarrito();

    expect(
      screen.getByText('Total: $55.000')
    ).toBeInTheDocument();

    expect(
      screen.getByText('3 planes · máximo 10 por año')
    ).toBeInTheDocument();
  });

  // TEST 6
  it('6. Permite actualizar la cantidad de planes', () => {
    leerCarrito.mockReturnValue([
      { id: 1, cantidad: 1 },
    ]);

    cambiarCantidad.mockReturnValue(true);

    mostrarCarrito();

    fireEvent.change(screen.getByLabelText('Cantidad'), {
      target: { value: '3' },
    });

    expect(cambiarCantidad).toHaveBeenCalledWith(1, 3);
    expect(leerCarrito).toHaveBeenCalledWith(1);
  });

  // TEST 7
  it('7. Muestra error cuando se supera el límite anual', () => {
    leerCarrito.mockReturnValue([
      { id: 1, cantidad: 1 },
    ]);

    cambiarCantidad.mockReturnValue(false);

    mostrarCarrito();

    fireEvent.change(screen.getByLabelText('Cantidad'), {
      target: { value: '11' },
    });

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Puedes elegir hasta 10 planes por año'
    );
  });

  // TEST 8
  it('8. Permite quitar un plan del carrito', () => {
    leerCarrito.mockReturnValue([
      { id: 1, cantidad: 1 },
    ]);

    mostrarCarrito();

    fireEvent.click(
      screen.getByRole('button', { name: 'Quitar' })
    );

    expect(quitarPlan).toHaveBeenCalledWith(1);
    expect(leerCarrito).toHaveBeenCalledWith(1);
  });

  // TEST 9
  it('9. Registra correctamente un pedido', () => {
    leerCarrito.mockReturnValue([
      { id: 1, cantidad: 1 },
    ]);

    registrarPedido.mockReturnValue({ id: 101 });

    mostrarCarrito();

    fireEvent.click(
      screen.getByRole('button', { name: 'Registrar pedido' })
    );

    expect(registrarPedido).toHaveBeenCalledTimes(1);

    expect(screen.getByRole('status')).toHaveTextContent(
      'Pedido #101 registrado'
    );

    expect(
      screen.getByRole('link', { name: 'Mis planes' })
    ).toHaveAttribute('href', '/mis-planes');
  });

  // TEST 10
  it('10. Muestra error si no se puede registrar el pedido', () => {
    leerCarrito.mockReturnValue([
      { id: 1, cantidad: 1 },
    ]);

    registrarPedido.mockReturnValue(null);

    mostrarCarrito();

    fireEvent.click(
      screen.getByRole('button', { name: 'Registrar pedido' })
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'No se pudo registrar el pedido.'
    );
  });
});
