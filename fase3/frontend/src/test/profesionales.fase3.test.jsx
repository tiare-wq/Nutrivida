import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Atencion from '../pages/profesionales/Atencion';
import MisMediciones from '../pages/usuarios/MisMediciones';
import LoginUsuarios from '../pages/usuarios/LoginUsuarios';

afterEach(() => {
    vi.unstubAllGlobals();
});

function respuesta(datos) {
    return { ok: true, status: 200, json: async () => datos };
}

describe('Profesionales y medidas', () => {
    it('permite buscar pacientes por nombre mediante la API', async () => {
        const fetch = vi
            .fn()
            .mockResolvedValueOnce(respuesta([{ id: 2, nombre: 'Esteban Zavala' }]))
            .mockResolvedValueOnce(respuesta([]));
        vi.stubGlobal('fetch', fetch);
        render(<Atencion />);

        expect(await screen.findByText('ID 2 · Esteban Zavala')).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText('ID o nombre del paciente'), {
            target: { value: 'Nombre con espacio' },
        });
        fireEvent.click(screen.getByText('Buscar pacientes'));

        await waitFor(() =>
            expect(fetch.mock.calls[1][0]).toBe(
                '/api/profesionales/pacientes?buscar=Nombre%20con%20espacio',
            ),
        );
        expect(
            await screen.findByText('No hay pacientes que coincidan con la búsqueda.'),
        ).toBeInTheDocument();
    });

    it('muestra las cuatro medidas del paciente y el profesional responsable', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(
                respuesta({
                    paciente: { id: 2, nombre: 'Esteban Zavala' },
                    profesional: {
                        id: 3,
                        nombre: 'Valentina Rojas',
                        especialidad: 'Nutrición',
                    },
                    mediciones: [
                        {
                            id: 1,
                            fecha: '2026-10-30',
                            estaturaCm: 170,
                            pesoKg: 72,
                            cinturaCm: 80,
                            caderaCm: 95,
                            profesionalNombre: 'Valentina Rojas',
                        },
                    ],
                }),
            ),
        );
        render(<MisMediciones />);

        expect(await screen.findByText('72 kg')).toBeInTheDocument();
        expect(screen.getByText('170 cm')).toBeInTheDocument();
        expect(screen.getByText('80 cm')).toBeInTheDocument();
        expect(screen.getByText('95 cm')).toBeInTheDocument();
        expect(screen.getByText(/Profesional asignado: Valentina Rojas/)).toBeInTheDocument();
    });

    it('ofrece una pantalla de acceso específica para profesionales', () => {
        render(
            <MemoryRouter>
                <LoginUsuarios profesional />
            </MemoryRouter>,
        );

        expect(
            screen.getByRole('heading', { name: 'Acceso de profesionales' }),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Correo electrónico')).toBeRequired();
    });
});
