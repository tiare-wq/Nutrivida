
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import PerfilPaciente from '../pages/privado/PerfilPaciente';

vi.mock('../data/almacen', () => ({
    guardarPacientes: vi.fn(),
    leerPacientes: vi.fn()
}));

import { guardarPacientes, leerPacientes } from '../data/almacen';

const pacienteBase = {
    id: 1,
    nombre: 'Tiare Salazar',
    rut: '12345678-9',
    correo: 'tiare@gmail.com',
    telefono: '+56912345678',
    fechaNac: new Date(2000, 0, 1),
    foto: 'foto-perfil.png'
};

const otroPaciente = {
    id: 2,
    nombre: 'Camila Pérez',
    rut: '98765432-1',
    correo: 'camila@gmail.com',
    telefono: '+56987654321',
    fechaNac: new Date(1998, 5, 10),
    foto: 'camila.png'
};

describe('Pruebas Unitarias - Módulo PerfilPaciente (Nutrivida)', () => {

    beforeEach(() => {
        vi.resetAllMocks();

        localStorage.clear();
        localStorage.setItem('pacienteId', '1');

        leerPacientes.mockReturnValue([
            pacienteBase,
            otroPaciente
        ]);
    });

    // Función auxiliar para renderizar el componente
    const renderPerfil = () => {
        render(<PerfilPaciente />);

        return {
            nombre: screen.getByLabelText('Nombre'),
            run: screen.getByLabelText('Run'),
            telefono: screen.getByLabelText('Teléfono'),
            correo: screen.getByLabelText('Correo'),
            fecha: screen.getByLabelText('Fecha de nacimiento'),
            button: screen.getByRole('button', { name: /editar/i }),
            form: screen.getByRole('button', { name: /editar/i })
                .closest('form')
        };
    };

    // Función auxiliar para modificar los datos
    const completarFormulario = ({
        nombre = 'Tiare Salazar',
        run = '12345678-9',
        telefono = '+56912345678',
        correo = 'tiare@gmail.com',
        fecha = '01-01-2000'
    } = {}) => {

        fireEvent.change(screen.getByLabelText('Nombre'), {
            target: { value: nombre }
        });

        fireEvent.change(screen.getByLabelText('Run'), {
            target: { value: run }
        });

        fireEvent.change(screen.getByLabelText('Teléfono'), {
            target: { value: telefono }
        });

        fireEvent.change(screen.getByLabelText('Correo'), {
            target: { value: correo }
        });

        fireEvent.change(screen.getByLabelText('Fecha de nacimiento'), {
            target: { value: fecha }
        });
    };

    test('1. Renderiza correctamente el perfil del paciente', () => {
        const {
            nombre,
            run,
            telefono,
            correo,
            fecha,
            button
        } = renderPerfil();

        expect(screen.getByRole('heading', {
            name: 'Mi perfil'
        })).toBeInTheDocument();

        expect(screen.getByText('¡Hola Tiare Salazar!'))
            .toBeInTheDocument();

        expect(nombre).toHaveValue('Tiare Salazar');
        expect(run).toHaveValue('12345678-9');
        expect(telefono).toHaveValue('+56912345678');
        expect(correo).toHaveValue('tiare@gmail.com');

        expect(fecha).toBeInTheDocument();
        expect(button).toBeInTheDocument();

        expect(screen.getByAltText('Foto de perfil'))
            .toHaveAttribute('src', 'foto-perfil.png');
    });

    test('2. Muestra un error si el nombre está vacío', () => {
        const { form } = renderPerfil();

        completarFormulario({
            nombre: '   '
        });

        fireEvent.submit(form);

        const mensaje = screen.getByText(
            'Este campo no puede estar vacío'
        );

        expect(mensaje).toBeInTheDocument();
        expect(mensaje).toHaveClass('alert', 'alert-danger');

        expect(guardarPacientes).not.toHaveBeenCalled();
    });

    test('3. Muestra un error si el formato del RUN no es válido', () => {
        const { form } = renderPerfil();

        completarFormulario({
            run: '12.345.678-9'
        });

        fireEvent.submit(form);

        const mensaje = screen.getByText(
            'El formato del RUN no es válido. Por favor, ingrese su RUN sin puntos y con guión.'
        );

        expect(mensaje).toBeInTheDocument();
        expect(mensaje).toHaveClass('alert', 'alert-danger');

        expect(guardarPacientes).not.toHaveBeenCalled();
    });

    test('4. Muestra un error si el formato del teléfono no es válido', () => {
        const { form } = renderPerfil();

        completarFormulario({
            telefono: '912345678'
        });

        fireEvent.submit(form);

        const mensaje = screen.getByText(
            'El formato del teléfono no es válido. Por favor, ingrese un teléfono con el siguiente formato +56 9 XXXX XXXX.'
        );

        expect(mensaje).toBeInTheDocument();
        expect(mensaje).toHaveClass('alert', 'alert-danger');

        expect(guardarPacientes).not.toHaveBeenCalled();
    });

    test('5. Muestra un error si el correo electrónico no es válido', () => {
        const { form } = renderPerfil();

        completarFormulario({
            correo: 'correoIncorrecto'
        });

        fireEvent.submit(form);

        const mensaje = screen.getByText('Ingrese un correo válido');

        expect(mensaje).toBeInTheDocument();
        expect(mensaje).toHaveClass('alert', 'alert-danger');

        expect(guardarPacientes).not.toHaveBeenCalled();
    });

    test('6. Muestra un error si el formato de la fecha de nacimiento no es válido', () => {
        const { form } = renderPerfil();

        completarFormulario({
            fecha: '2000-01-01'
        });

        fireEvent.submit(form);

        const mensaje = screen.getByText(
            'El formato de la fecha no es válida. Por favor, ingrese una fecha en el siguiente formato DD-MM-YYYY'
        );

        expect(mensaje).toBeInTheDocument();
        expect(mensaje).toHaveClass('alert', 'alert-danger');

        expect(guardarPacientes).not.toHaveBeenCalled();
    });

    test('7. Muestra un error si el paciente es menor de 16 años', () => {
        const { form } = renderPerfil();

        completarFormulario({
            fecha: '01-01-2020'
        });

        fireEvent.submit(form);

        const mensaje = screen.getByText(
            'La edad mínima es de 16 años'
        );

        expect(mensaje).toBeInTheDocument();
        expect(mensaje).toHaveClass('alert', 'alert-danger');

        expect(guardarPacientes).not.toHaveBeenCalled();
    });

    test('8. Actualiza los datos y muestra un mensaje de éxito', () => {
        const { form } = renderPerfil();

        completarFormulario({
            nombre: 'Tiare Nueva',
            run: '11222333-4',
            telefono: '+56911112222',
            correo: 'tiare.nueva@gmail.com',
            fecha: '15-05-2000'
        });

        fireEvent.submit(form);

        const mensaje = screen.getByText(
            'Se han actualizado los datos correctamente.'
        );

        expect(mensaje).toBeInTheDocument();
        expect(mensaje).toHaveClass('alert', 'alert-success');

        expect(guardarPacientes).toHaveBeenCalledTimes(1);

        const pacientesGuardados = guardarPacientes.mock.calls[0][0];

        expect(pacientesGuardados[0]).toMatchObject({
            id: 1,
            nombre: 'Tiare Nueva',
            rut: '11222333-4',
            telefono: '+56911112222',
            correo: 'tiare.nueva@gmail.com'
        });

        expect(pacientesGuardados[0].fechaNac).toBeInstanceOf(Date);
    });

    test('9. Conserva los datos de los demás pacientes al actualizar el perfil', () => {
        const { form } = renderPerfil();

        completarFormulario({
            nombre: 'Tiare Modificada'
        });

        fireEvent.submit(form);

        const pacientesGuardados = guardarPacientes.mock.calls[0][0];

        expect(pacientesGuardados).toHaveLength(2);

        expect(pacientesGuardados[0].nombre)
            .toBe('Tiare Modificada');

        expect(pacientesGuardados[1]).toEqual(otroPaciente);
    });

    test('10. Oculta el mensaje de éxito cuando aparece un nuevo error', () => {
        const { form } = renderPerfil();

        // Primero se actualizan correctamente los datos
        completarFormulario();

        fireEvent.submit(form);

        expect(screen.getByText(
            'Se han actualizado los datos correctamente.'
        )).toBeInTheDocument();

        // Después se intenta guardar con un nombre vacío
        completarFormulario({
            nombre: ''
        });

        fireEvent.submit(form);

        expect(screen.getByText(
            'Este campo no puede estar vacío'
        )).toBeInTheDocument();

        expect(screen.queryByText(
            'Se han actualizado los datos correctamente.'
        )).not.toBeInTheDocument();

        expect(guardarPacientes).toHaveBeenCalledTimes(1);
    });

});
