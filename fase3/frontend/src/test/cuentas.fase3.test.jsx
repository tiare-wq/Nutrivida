import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Atencion from '../pages/profesionales/Atencion';
import CambiarPassword from '../components/CambiarPassword';
import { actual, ingresar } from '../api/usuarios';

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

const respuesta = (datos, status = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => datos,
});

const informe = (mediciones) => ({
    paciente: {
        id: 2,
        nombre: 'Esteban Zavala',
        rut: '20.456.789-1',
        fechaNac: '1998-05-14',
        telefono: '987654321',
        correo: 'esteban.zavala@nutrivida.cl',
    },
    profesional: { id: 3, nombre: 'Valentina Rojas', especialidad: 'Nutrición clínica' },
    mediciones,
});

const medida = {
    id: 7,
    fecha: '2026-10-30',
    estaturaCm: 178,
    pesoKg: 129,
    cinturaCm: 118,
    caderaCm: 124,
    profesionalNombre: 'Valentina Rojas',
};

async function abrirFicha(fetch) {
    vi.stubGlobal('fetch', fetch);
    render(<Atencion />);
    fireEvent.click(await screen.findByText('Abrir ficha de Esteban Zavala'));
    await screen.findByText('Informe de Esteban Zavala');
}

describe('Mediciones: editar y eliminar', () => {
    it('edita una medición existente con PUT y recarga el informe', async () => {
        const fetch = vi
            .fn()
            .mockResolvedValueOnce(respuesta([{ id: 2, nombre: 'Esteban Zavala' }]))
            .mockResolvedValueOnce(respuesta(informe([medida])))
            .mockResolvedValueOnce(respuesta({ ...medida, pesoKg: 127.5 }))
            .mockResolvedValueOnce(respuesta(informe([{ ...medida, pesoKg: 127.5 }])));
        await abrirFicha(fetch);

        fireEvent.click(screen.getByRole('button', { name: 'Editar medición del 2026-10-30' }));
        expect(screen.getByLabelText('Peso en kilogramos')).toHaveValue(129);
        fireEvent.change(screen.getByLabelText('Peso en kilogramos'), {
            target: { value: '127.5' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios de la medición' }));

        expect(await screen.findByText('Medición actualizada correctamente.')).toBeInTheDocument();
        const [ruta, opciones] = fetch.mock.calls[2];
        expect(ruta).toBe('/api/profesionales/pacientes/2/mediciones/7');
        expect(opciones.method).toBe('PUT');
        expect(JSON.parse(opciones.body).pesoKg).toBe(127.5);
    });

    it('elimina una medición solo después de confirmar', async () => {
        const fetch = vi
            .fn()
            .mockResolvedValueOnce(respuesta([{ id: 2, nombre: 'Esteban Zavala' }]))
            .mockResolvedValueOnce(respuesta(informe([medida])))
            .mockResolvedValueOnce(respuesta(null, 204))
            .mockResolvedValueOnce(respuesta(informe([])));
        await abrirFicha(fetch);

        vi.spyOn(window, 'confirm').mockReturnValueOnce(false);
        fireEvent.click(screen.getByRole('button', { name: 'Eliminar medición del 2026-10-30' }));
        expect(fetch).toHaveBeenCalledTimes(2);

        vi.spyOn(window, 'confirm').mockReturnValueOnce(true);
        fireEvent.click(screen.getByRole('button', { name: 'Eliminar medición del 2026-10-30' }));
        expect(await screen.findByText('Medición eliminada correctamente.')).toBeInTheDocument();
        expect(fetch.mock.calls[2][0]).toBe('/api/profesionales/pacientes/2/mediciones/7');
        expect(fetch.mock.calls[2][1].method).toBe('DELETE');
    });
});

describe('Cambio de contraseña', () => {
    it('envía la contraseña actual y la nueva, y cierra la sesión', async () => {
        const fetch = vi
            .fn()
            .mockResolvedValueOnce(
                respuesta({
                    accessToken: 'jwt-cuenta',
                    usuario: { id: 1, rol: 'PACIENTE', nombre: 'Juan López' },
                }),
            )
            .mockResolvedValueOnce(respuesta(null, 204))
            .mockResolvedValueOnce(respuesta(null, 204));
        vi.stubGlobal('fetch', fetch);
        await ingresar('juan.lopez@nutrivida.cl', 'ClaveActual123', 'PACIENTE');
        render(<CambiarPassword />);

        fireEvent.change(screen.getByLabelText('Contraseña actual'), {
            target: { value: 'ClaveActual123' },
        });
        fireEvent.change(screen.getByLabelText('Contraseña nueva'), {
            target: { value: 'ClaveNueva456' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Cambiar contraseña' }));

        await waitFor(() => expect(actual()).toBeNull());
        const [ruta, opciones] = fetch.mock.calls[1];
        expect(ruta).toBe('/api/cuenta/password');
        expect(opciones.method).toBe('PUT');
        expect(JSON.parse(opciones.body)).toEqual({
            actual: 'ClaveActual123',
            nueva: 'ClaveNueva456',
        });
        expect(fetch.mock.calls[2][0]).toBe('/api/auth/logout');
    });

    it('muestra el mensaje del servidor cuando la contraseña actual es incorrecta', async () => {
        vi.stubGlobal(
            'fetch',
            vi
                .fn()
                .mockResolvedValue(
                    respuesta({ message: 'La contraseña actual no es correcta' }, 400),
                ),
        );
        render(<CambiarPassword />);

        fireEvent.change(screen.getByLabelText('Contraseña actual'), {
            target: { value: 'Mala12345' },
        });
        fireEvent.change(screen.getByLabelText('Contraseña nueva'), {
            target: { value: 'ClaveNueva456' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Cambiar contraseña' }));

        expect(await screen.findByText('La contraseña actual no es correcta')).toBeInTheDocument();
    });
});
