
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';

import Registro from '../pages/publico/Registro';
import { agregarPaciente, registrarSesion } from '../data/almacen';

// Simulamos la navegación para no cambiar de página durante los tests
const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal();

  return {
    ...original,
    useNavigate: () => mocks.navigate,
  };
});

// Simulamos las funciones de almacenamiento
vi.mock('../data/almacen', () => ({
  agregarPaciente: vi.fn(),
  registrarSesion: vi.fn(),
}));

// Renderiza el formulario dentro de un Router
const mostrarRegistro = () => {
  return render(
    <MemoryRouter>
      <Registro />
    </MemoryRouter>
  );
};

// Completa el formulario con datos válidos
const completarFormulario = () => {
  fireEvent.change(screen.getByLabelText('Nombre'), {
    target: { value: 'Camila' },
  });

  fireEvent.change(screen.getByLabelText('Apellido'), {
    target: { value: 'González' },
  });

  fireEvent.change(screen.getByLabelText('RUT'), {
    target: { value: '12.345.678-5' },
  });

  fireEvent.change(screen.getByLabelText('Fecha de nacimiento'), {
    target: { value: '2000-05-10' },
  });

  fireEvent.change(screen.getByLabelText('Teléfono'), {
    target: { value: '912345678' },
  });

  fireEvent.change(screen.getByLabelText('Correo electrónico'), {
    target: { value: 'camila@correo.cl' },
  });

  fireEvent.change(
    screen.getByLabelText('Contraseña', { exact: true }),
    {
      target: { value: 'Clave1234' },
    }
  );

  fireEvent.change(screen.getByLabelText('Confirmar contraseña'), {
    target: { value: 'Clave1234' },
  });
};

// Envía el formulario
const enviarFormulario = () => {
  fireEvent.click(
    screen.getByRole('button', { name: 'Registrarse' })
  );
};

// Genera fechas en formato YYYY-MM-DD
const formatearFecha = (fecha) => {
  return [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, '0'),
    String(fecha.getDate()).padStart(2, '0'),
  ].join('-');
};

describe('Pruebas unitarias del registro NutriVida', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // TEST 1
  it('1. Muestra correctamente el formulario', () => {
    mostrarRegistro();

    expect(
      screen.getByRole('heading', { name: 'Crear cuenta' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Registrarse' })
    ).toBeInTheDocument();
  });

  // TEST 2
  it('2. Valida que todos los campos sean obligatorios', () => {
    mostrarRegistro();
    enviarFormulario();

    expect(screen.getByRole('alert'))
      .toHaveTextContent('Todos los campos son obligatorios.');
  });

  // TEST 3
  it('3. Rechaza nombres demasiado cortos', () => {
    mostrarRegistro();
    completarFormulario();

    fireEvent.change(screen.getByLabelText('Nombre'), {
      target: { value: 'A' },
    });

    enviarFormulario();

    expect(screen.getByRole('alert'))
      .toHaveTextContent(
        'Nombre y apellido deben tener al menos 2 caracteres.'
      );
  });

  // TEST 4
  it('4. Rechaza un RUT inválido', () => {
    mostrarRegistro();
    completarFormulario();

    fireEvent.change(screen.getByLabelText('RUT'), {
      target: { value: '12.345.678-9' },
    });

    enviarFormulario();

    expect(screen.getByRole('alert'))
      .toHaveTextContent('El RUT ingresado no es válido.');
  });

  // TEST 5
  it('5. Rechaza una fecha de nacimiento futura', () => {
    mostrarRegistro();
    completarFormulario();

    const fechaFutura = new Date();
    fechaFutura.setFullYear(fechaFutura.getFullYear() + 1);

    fireEvent.change(screen.getByLabelText('Fecha de nacimiento'), {
      target: { value: formatearFecha(fechaFutura) },
    });

    enviarFormulario();

    expect(screen.getByRole('alert'))
      .toHaveTextContent('Ingresa una fecha de nacimiento válida.');
  });

  // TEST 6
  it('6. Rechaza usuarios menores de 14 años', () => {
    mostrarRegistro();
    completarFormulario();

    const fechaMenor = new Date();
    fechaMenor.setFullYear(fechaMenor.getFullYear() - 10);

    fireEvent.change(screen.getByLabelText('Fecha de nacimiento'), {
      target: { value: formatearFecha(fechaMenor) },
    });

    enviarFormulario();

    expect(screen.getByRole('alert'))
      .toHaveTextContent(
        'Debes tener al menos 14 años para registrarte'
      );
  });

  // TEST 7
  it('7. Rechaza teléfonos con menos de 9 dígitos', () => {
    mostrarRegistro();
    completarFormulario();

    fireEvent.change(screen.getByLabelText('Teléfono'), {
      target: { value: '91234567' },
    });

    enviarFormulario();

    expect(screen.getByRole('alert'))
      .toHaveTextContent(
        'Ingresa un celular válido de 9 dígitos.'
      );
  });

  // TEST 8
  it('8. Rechaza contraseñas demasiado cortas', () => {
    mostrarRegistro();
    completarFormulario();

    fireEvent.change(
      screen.getByLabelText('Contraseña', { exact: true }),
      {
        target: { value: 'Ab12' },
      }
    );

    enviarFormulario();

    expect(screen.getByRole('alert'))
      .toHaveTextContent(
        'La contraseña debe tener al menos 8 caracteres.'
      );
  });

  // TEST 9
  it('9. Rechaza contraseñas que no coinciden', () => {
    mostrarRegistro();
    completarFormulario();

    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), {
      target: { value: 'OtraClave123' },
    });

    enviarFormulario();

    expect(screen.getByRole('alert'))
      .toHaveTextContent('Las contraseñas no coinciden.');
  });

  // TEST 10
  it('10. Registra al paciente y redirige al perfil', () => {
    mostrarRegistro();
    completarFormulario();
    enviarFormulario();

    expect(agregarPaciente).toHaveBeenCalledTimes(1);
    expect(registrarSesion).toHaveBeenCalledTimes(1);

    expect(agregarPaciente).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: 'Camila González',
        rut: '12.345.678-5',
        correo: 'camila@correo.cl',
        telefono: '912345678',
      })
    );

    expect(mocks.navigate).toHaveBeenCalledWith(
      '/perfil',
      expect.objectContaining({
        state: {
          paciente: expect.objectContaining({
            nombre: 'Camila González',
          }),
        },
      })
    );
  });

});
