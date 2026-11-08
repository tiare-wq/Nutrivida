import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { LoginUsuarios, RegistroUsuarios } from '../pages/Usuarios';
import { Protegida } from '../components/Sesion';
import { ingresar, solicitar, actual, salir, renovar } from '../api/usuarios';
afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
});
const respuesta = (data, status = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
});
describe('API y sesión fase 3', () => {
    it('usa JWT en memoria y no persiste contraseñas', async () => {
        const fetch = vi
            .fn()
            .mockResolvedValueOnce(
                respuesta({
                    accessToken: 'jwt-prueba',
                    usuario: { id: 1, rol: 'PACIENTE', nombre: 'Ana' },
                }),
            )
            .mockResolvedValueOnce(respuesta({ id: 1 }))
            .mockResolvedValueOnce(respuesta({}, 204));
        vi.stubGlobal('fetch', fetch);
        localStorage.setItem('isAdmin', 'true');
        await ingresar('ana@test.cl', 'Ana12345', 'PACIENTE');
        expect(actual().nombre).toBe('Ana');
        expect(localStorage.getItem('isAdmin')).toBeNull();
        await solicitar('/api/pacientes/me');
        expect(fetch.mock.calls[1][1].headers.Authorization).toBe('Bearer jwt-prueba');
        await salir();
        expect(actual()).toBeNull();
    });
    it('rechaza rol incorrecto y cierra la sesión creada', async () => {
        const fetch = vi
            .fn()
            .mockResolvedValueOnce(respuesta({ accessToken: 'jwt', usuario: { rol: 'PACIENTE' } }))
            .mockResolvedValueOnce(respuesta({}, 204));
        vi.stubGlobal('fetch', fetch);
        await expect(ingresar('a@a.cl', 'Password1', 'ADMIN')).rejects.toThrow('rol');
        expect(fetch.mock.calls[1][0]).toBe('/api/auth/logout');
    });
    it('renueva una vez ante 401 y reintenta', async () => {
        const fetch = vi
            .fn()
            .mockResolvedValueOnce(respuesta({}, 401))
            .mockResolvedValueOnce(
                respuesta({ accessToken: 'nuevo', usuario: { id: 2, rol: 'PACIENTE' } }),
            )
            .mockResolvedValueOnce(respuesta({ id: 2 }));
        vi.stubGlobal('fetch', fetch);
        expect(await solicitar('/api/pacientes/me')).toEqual({ id: 2 });
        expect(fetch).toHaveBeenCalledTimes(3);
        expect(fetch.mock.calls[2][1].headers.Authorization).toBe('Bearer nuevo');
    });
    it('una sesión vencida queda anónima', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respuesta({}, 401)));
        expect(await renovar()).toBeNull();
        expect(actual()).toBeNull();
    });
    it('propaga fallos de red al renovar y permite volver a intentarlo', async () => {
        const fetch = vi
            .fn()
            .mockRejectedValueOnce(new Error('Sin conexión'))
            .mockResolvedValueOnce(
                respuesta({ accessToken: 'renovado', usuario: { id: 2, rol: 'PACIENTE' } }),
            );
        vi.stubGlobal('fetch', fetch);
        await expect(renovar()).rejects.toThrow('Sin conexión');
        await expect(renovar()).resolves.toEqual({ id: 2, rol: 'PACIENTE' });
        expect(fetch).toHaveBeenCalledTimes(2);
    });
    it('conserva el cierre pendiente si falla la red', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Sin conexión')));
        await expect(salir()).rejects.toThrow('Sin conexión');
    });
});
describe('Interfaz fase 3', () => {
    it('muestra error real de credenciales', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(respuesta({ message: 'Credenciales incorrectas' }, 401)),
        );
        render(
            <MemoryRouter>
                <LoginUsuarios />
            </MemoryRouter>,
        );
        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'ana@test.cl' },
        });
        fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'incorrecta' } });
        fireEvent.click(screen.getByText('Ingresar'));
        expect(await screen.findByRole('alert')).toHaveTextContent('Credenciales incorrectas');
        await waitFor(() => expect(screen.getByText('Ingresar')).not.toBeDisabled());
    });
    it('el registro identifica sus campos y regla de edad', () => {
        render(
            <MemoryRouter>
                <RegistroUsuarios />
            </MemoryRouter>,
        );
        expect(screen.getByLabelText('RUT')).toBeRequired();
        expect(screen.getByLabelText('RUT')).toHaveAttribute('maxLength', '12');
        expect(screen.getByText(/Edad mínima 14/)).toBeInTheDocument();
    });
    it('una bandera local no permite mostrar administración', () => {
        localStorage.setItem('isAdmin', 'true');
        render(
            <MemoryRouter>
                <Protegida rol="ADMIN">
                    <p>Secreto administrativo</p>
                </Protegida>
            </MemoryRouter>,
        );
        expect(screen.queryByText('Secreto administrativo')).not.toBeInTheDocument();
    });
});
