import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Reserva from '../pages/Reserva'; 

describe('Pruebas Unitarias - Módulo de Reserva (Nutrivida)', () => {

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

 
  test('1. Debería renderizar correctamente todos los elementos del formulario de reserva', () => {
    render(<Reserva />);
    
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo|email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/servicio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hora/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirmar reserva|reservar/i })).toBeInTheDocument();
  });


  test('2. Debe mostrar mensaje de error al intentar enviar el formulario vacío', () => {
    render(<Reserva />);
    const botonSubmit = screen.getByRole('button', { name: /confirmar reserva|reservar/i });
    
    fireEvent.click(botonSubmit);

    expect(screen.getByText(/todos los campos son obligatorios/i)).toBeInTheDocument();
  });

  
  test('3. Muestra error si el formato del correo electrónico es incorrecto', () => {
    render(<Reserva />);

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Juan Pérez' } });
    fireEvent.change(screen.getByLabelText(/correo|email/i), { target: { value: 'correo-invalido' } });
    fireEvent.change(screen.getByLabelText(/servicio/i), { target: { value: 'Consulta Nutricional' } });
    fireEvent.change(screen.getByLabelText(/fecha/i), { target: { value: '2026-11-10' } });
    fireEvent.change(screen.getByLabelText(/hora/i), { target: { value: '10:00' } });

    fireEvent.click(screen.getByRole('button', { name: /confirmar reserva|reservar/i }));

    expect(screen.getByText(/ingrese un correo válido/i)).toBeInTheDocument();
  });

  
  test('4. Procesa y guarda la reserva cuando todos los datos son válidos', () => {
    const mockOnSubmit = vi.fn();
    render(<Reserva onSubmitSuccess={mockOnSubmit} />);

   
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'María López' } });
    fireEvent.change(screen.getByLabelText(/correo|email/i), { target: { value: 'maria@ejemplo.com' } });
    fireEvent.change(screen.getByLabelText(/servicio/i), { target: { value: 'Plan Deportivo' } });
    fireEvent.change(screen.getByLabelText(/fecha/i), { target: { value: '2026-11-15' } });
    fireEvent.change(screen.getByLabelText(/hora/i), { target: { value: '11:00' } });

    fireEvent.click(screen.getByRole('button', { name: /confirmar reserva|reservar/i }));

   
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      nombre: 'María López',
      email: 'maria@ejemplo.com',
      servicio: 'Plan Deportivo',
      fecha: '2026-11-15',
      hora: '11:00'
    }));
  });

});