
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Login from '../pages/publico/Login';
import { MemoryRouter } from 'react-router-dom';

const { mockNavigate, mockLocationState } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
    mockLocationState: { value: null }
}));

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();

    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => ({
            state: mockLocationState.value
        })
    };
});

vi.mock('../data/almacen', () => ({
    agregarPlan: vi.fn(),
    iniciarSesion: vi.fn()
}));

import { agregarPlan, iniciarSesion } from '../data/almacen';

describe('Pruebas Unitarias - Módulo Login (Nutrivida)', () => {

    beforeEach(() => {
        vi.resetAllMocks();
        mockLocationState.value = null;
    });

    // Función auxiliar para renderizar el componente
    const renderLogin = () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        return {
            correo: screen.getByLabelText('Correo electrónico'),
            password: screen.getByLabelText('Contraseña'),
            button: screen.getByRole('button', { name: /ingresar/i }),
            form: screen.getByRole('heading', { name: /iniciar sesión/i })
                .closest('form')
        };
    };

    // Función auxiliar para ingresar credenciales
    const completarFormulario = (correo, password) => {
        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: correo }
        });

        fireEvent.change(screen.getByLabelText('Contraseña'), {
            target: { value: password }
        });
    };

    test('1. Renderiza correctamente el formulario de inicio de sesión', () => {
        const { correo, password, button, form } = renderLogin();

        expect(screen.getByRole('heading', {
            name: /iniciar sesión/i
        })).toBeInTheDocument();

        expect(correo).toBeInTheDocument();
        expect(password).toBeInTheDocument();
        expect(button).toBeInTheDocument();
        expect(form).toBeInTheDocument();

        expect(screen.getByRole('link', {
            name: /regístrate aquí/i
        })).toHaveAttribute('href', '/registro');

        expect(screen.getByRole('link', {
            name: /inicia sesión aquí/i
        })).toHaveAttribute('href', '/login-admin');
    });

    test('2. Muestra un error si el correo electrónico no es válido', () => {
        const { form } = renderLogin();

        completarFormulario('correoIncorrecto', 'Flores123.');

        fireEvent.submit(form);

        const mensaje = screen.getByText(
            'El correo electrónico no es válido'
        );

        expect(mensaje).toBeInTheDocument();
        expect(mensaje).toHaveClass('alert', 'alert-danger');
    });

    test('3. Muestra un error si la contraseña tiene menos de 4 caracteres', () => {
        const { form } = renderLogin();

        completarFormulario('pame@outlook.com', '123');

        fireEvent.submit(form);

        const mensaje = screen.getByText(
            'La contraseña debe tener al menos 4 caracteres'
        );

        expect(mensaje).toBeInTheDocument();
        expect(mensaje).toHaveClass('alert', 'alert-danger');
    });

    test('4. No intenta iniciar sesión si faltan datos válidos', () => {
        const { form } = renderLogin();

        completarFormulario('', 'Flores123.');

        fireEvent.submit(form);

        expect(iniciarSesion).not.toHaveBeenCalled();

        completarFormulario('pame@outlook.com', '');

        fireEvent.submit(form);

        expect(iniciarSesion).not.toHaveBeenCalled();
    });

    test('5. Muestra un error si el usuario no está registrado', () => {
        const { form } = renderLogin();

        iniciarSesion.mockReturnValue(null);

        completarFormulario('lore@hotmail.cl', 'Flores123.');

        fireEvent.submit(form);

        const mensaje = screen.getByText(
            'Es posible que el correo electrónico o la contraseña no esté conectado a ninguna cuenta.'
        );

        expect(iniciarSesion).toHaveBeenCalledWith(
            'lore@hotmail.cl',
            'Flores123.'
        );

        expect(mensaje).toBeInTheDocument();
        expect(mensaje).toHaveClass('alert', 'alert-danger');
    });

    test('6. Redirige al perfil cuando el usuario inicia sesión correctamente', () => {
        const { form } = renderLogin();

        iniciarSesion.mockReturnValue({ id: 1 });

        completarFormulario('pame@outlook.com', 'Paamela123.');

        fireEvent.submit(form);

        expect(iniciarSesion).toHaveBeenCalledWith(
            'pame@outlook.com',
            'Paamela123.'
        );

        expect(mockNavigate).toHaveBeenCalledWith('/perfil', {
            state: undefined
        });
    });

    test('7. Redirige a la ruta solicitada y conserva los datos de la reserva', () => {
        mockLocationState.value = {
            next: '/reservas',
            reserva: {
                atencion: 'Consulta',
                servicio: 'Nutrición'
            }
        };

        const { form } = renderLogin();

        iniciarSesion.mockReturnValue({ id: 1 });

        completarFormulario('pame@outlook.com', 'Paamela123.');

        fireEvent.submit(form);

        expect(mockNavigate).toHaveBeenCalledWith('/reservas', {
            state: {
                atencion: 'Consulta',
                servicio: 'Nutrición'
            }
        });
    });

    test('8. Permite acceder al formulario de registro', () => {
        renderLogin();

        const enlace = screen.getByRole('link', {
            name: /regístrate aquí/i
        });

        expect(enlace).toBeInTheDocument();
        expect(enlace).toHaveAttribute('href', '/registro');
    });

    test('9. Agrega el plan y redirige al carrito si el usuario inició sesión correctamente', () => {
        mockLocationState.value = {
            planId: 5
        };

        const { form } = renderLogin();

        iniciarSesion.mockReturnValue({ id: 1 });
        agregarPlan.mockReturnValue(null);

        completarFormulario('pame@outlook.com', 'Paamela123.');

        fireEvent.submit(form);

        expect(agregarPlan).toHaveBeenCalledWith(5);
        expect(mockNavigate).toHaveBeenCalledWith('/carrito');
    });

    test('10. Muestra un mensaje si ocurre un error al agregar el plan', () => {
        mockLocationState.value = {
            planId: 5
        };

        const { form } = renderLogin();

        iniciarSesion.mockReturnValue({ id: 1 });

        agregarPlan.mockReturnValue(
            'No es posible agregar este plan.'
        );

        completarFormulario('pame@outlook.com', 'Paamela123.');

        fireEvent.submit(form);

        const mensaje = screen.getByText(
            'No es posible agregar este plan.'
        );

        expect(agregarPlan).toHaveBeenCalledWith(5);
        expect(mensaje).toBeInTheDocument();
        expect(mensaje).toHaveClass('alert', 'alert-danger');

        expect(mockNavigate).not.toHaveBeenCalled();
    });

});
