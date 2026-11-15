
import { describe, test, expect, beforeEach, vi } from 'vitest';

import pacientes from '../data/pacientes.js';
import planes from '../data/planes.js';

import {
    agregarPaciente,
    leerPacientes,
    guardarPacientes,
    pacienteActual,
    iniciarSesion,
    iniciarSesionAdmin,
    registrarSesion,
    cerrarSesion,
    leerCarrito,
    compradosEsteAnio,
    agregarPlan,
    cambiarCantidad,
    quitarPlan,
    registrarPedido,
    planActivo,
    fechaClave,
    horaOcupada,
    guardarReserva
} from '../data/almacen.js';

describe('Pruebas Unitarias - Módulo almacen (Nutrivida)', () => {

    beforeEach(() => {
        localStorage.clear();

        // Utilizar los pacientes reales del proyecto
        localStorage.setItem(
            'pacientes',
            JSON.stringify(pacientes)
        );

        // Iniciar sesión con el paciente real
        localStorage.setItem('pacienteId', '1');
    });

    test('1. Lee los pacientes iniciales cuando no existen datos guardados', () => {
        localStorage.removeItem('pacientes');

        expect(leerPacientes()).toEqual(pacientes);
    });

    test('2. Recupera los pacientes iniciales cuando el JSON almacenado es inválido', () => {
        localStorage.setItem('pacientes', '{datos incorrectos');

        expect(leerPacientes()).toEqual(pacientes);
    });

    test('3. Agrega un nuevo paciente y lo almacena correctamente', () => {
        const nuevoPaciente = {
            id: 2,
            nombre: 'Camila Pérez',
            rut: '98765432-1',
            fechaNac: '2000-05-15',
            telefono: '+56 9 1234 5678',
            correo: 'camila@gmail.com',
            password: 'Camila123.',
            reservas: [],
            historial: [],
            foto: '../../img/paciente2.jpg'
        };

        agregarPaciente(nuevoPaciente);

        const resultado = leerPacientes();

        expect(resultado).toHaveLength(2);
        expect(resultado[1]).toEqual(nuevoPaciente);
    });

    test('4. Guarda los pacientes y notifica los cambios', () => {
        const listener = vi.fn();

        window.addEventListener('nutrivida:actualizar', listener);

        const nuevosPacientes = [
            ...leerPacientes(),
            {
                id: 2,
                nombre: 'Camila Pérez'
            }
        ];

        guardarPacientes(nuevosPacientes);

        expect(leerPacientes()).toEqual(nuevosPacientes);
        expect(listener).toHaveBeenCalledTimes(1);

        window.removeEventListener(
            'nutrivida:actualizar',
            listener
        );
    });

    test('5. Obtiene el paciente que tiene la sesión iniciada', () => {
        const paciente = pacienteActual();

        expect(paciente).toEqual(
            expect.objectContaining({
                id: 1,
                nombre: 'Pamela Soto',
                correo: 'pame@outlook.com'
            })
        );

        localStorage.removeItem('pacienteId');

        expect(pacienteActual()).toBeNull();
    });

    test('6. Inicia sesión con las credenciales correctas', () => {
        localStorage.removeItem('pacienteId');

        const paciente = iniciarSesion(
            ' PAME@OUTLOOK.COM ',
            'Paamela123.'
        );

        expect(paciente.nombre).toBe('Pamela Soto');
        expect(localStorage.getItem('pacienteId')).toBe('1');
    });

    test('7. Rechaza el inicio de sesión con credenciales incorrectas', () => {
        localStorage.removeItem('pacienteId');

        const resultado = iniciarSesion(
            'pame@outlook.com',
            'ContraseñaIncorrecta'
        );

        expect(resultado).toBeUndefined();
        expect(localStorage.getItem('pacienteId')).toBeNull();
    });

    test('8. Gestiona correctamente la sesión del administrador y del paciente', () => {
        expect(
            iniciarSesionAdmin('ADMIN@NUTRIVIDA.CL', 'Admin123.')
        ).toBe(true);

        expect(localStorage.getItem('isAdmin')).toBe('true');

        registrarSesion(pacientes[0]);

        expect(localStorage.getItem('pacienteId')).toBe('1');

        cerrarSesion();

        expect(localStorage.getItem('pacienteId')).toBeNull();
        expect(localStorage.getItem('isAdmin')).toBeNull();

        expect(
            iniciarSesionAdmin('admin@nutrivida.cl', 'incorrecta')
        ).toBe(false);
    });

    test('9. Lee el carrito y descarta planes o cantidades inválidas', () => {
        localStorage.setItem(
            'carrito-1',
            JSON.stringify([
                { id: 'P1', cantidad: 2 },
                { id: 'P2', cantidad: 1 },
                { id: 'P99', cantidad: 1 },
                { id: 'P3', cantidad: 0 },
                { id: 'P4', cantidad: 11 },
                { id: 'P5', cantidad: 1.5 }
            ])
        );

        expect(leerCarrito(1)).toEqual([
            { id: 'P1', cantidad: 2 },
            { id: 'P2', cantidad: 1 }
        ]);

        expect(leerCarrito(null)).toEqual([]);
    });

    test('10. Calcula correctamente los planes comprados durante el año', () => {
        const anio = new Date().getFullYear();

        const paciente = {
            historial: [
                {
                    fecha: `${anio}-03-10`,
                    planes: [
                        { id: 'P1', cantidad: 2 },
                        { id: 'P2', cantidad: 3 }
                    ]
                },
                {
                    fecha: `${anio - 1}-05-10`,
                    planes: [
                        { id: 'P3', cantidad: 5 }
                    ]
                }
            ]
        };

        expect(compradosEsteAnio(paciente, anio)).toBe(5);
    });

    test('11. Agrega un plan existente e incrementa su cantidad', () => {
        expect(agregarPlan('P1')).toBe('');

        expect(leerCarrito(1)).toEqual([
            { id: 'P1', cantidad: 1 }
        ]);

        expect(agregarPlan('P1')).toBe('');

        expect(leerCarrito(1)).toEqual([
            { id: 'P1', cantidad: 2 }
        ]);

        // El identificador debe existir en planes.js
        expect(planes.some(plan => plan.id === 'P1')).toBe(true);
    });

    test('12. Rechaza agregar planes si no hay sesión o se alcanza el límite anual', () => {
        localStorage.removeItem('pacienteId');

        expect(agregarPlan('P1')).toBe(
            'Inicia sesión para agregar un plan.'
        );

        localStorage.setItem('pacienteId', '1');

        const lista = leerPacientes();

        lista[0].historial = [
            {
                fecha: new Date().toISOString(),
                planes: [
                    { id: 'P1', cantidad: 10 }
                ]
            }
        ];

        guardarPacientes(lista);

        expect(agregarPlan('P1')).toBe(
            'El máximo es de 10 planes por año por paciente.'
        );
    });

    test('13. Modifica la cantidad de un plan respetando el límite anual', () => {
        localStorage.setItem(
            'carrito-1',
            JSON.stringify([
                { id: 'P1', cantidad: 2 },
                { id: 'P2', cantidad: 1 }
            ])
        );

        expect(cambiarCantidad('P1', 3)).toBe(true);

        expect(leerCarrito(1)).toEqual([
            { id: 'P1', cantidad: 3 },
            { id: 'P2', cantidad: 1 }
        ]);

        expect(cambiarCantidad('P1', 0)).toBe(false);
        expect(cambiarCantidad('P1', 1.5)).toBe(false);
        expect(cambiarCantidad('P99', 2)).toBe(false);
    });

    test('14. Elimina un plan del carrito', () => {
        localStorage.setItem(
            'carrito-1',
            JSON.stringify([
                { id: 'P1', cantidad: 2 },
                { id: 'P2', cantidad: 1 }
            ])
        );

        quitarPlan('P1');

        expect(leerCarrito(1)).toEqual([
            { id: 'P2', cantidad: 1 }
        ]);
    });

    test('15. Registra pedidos, consulta el plan activo y gestiona reservas', () => {
        // Registrar pedido
        localStorage.setItem(
            'carrito-1',
            JSON.stringify([
                { id: 'P1', cantidad: 2 }
            ])
        );

        const compra = registrarPedido();

        const planReal = planes.find(plan => plan.id === 'P1');

        expect(compra).not.toBeNull();

        expect(compra.planes).toEqual([
            {
                id: 'P1',
                nombre: planReal.nombre,
                precio: planReal.precio,
                cantidad: 2
            }
        ]);

        expect(leerCarrito(1)).toEqual([]);

        const pacienteActualizado = pacienteActual();

        expect(pacienteActualizado.historial).toHaveLength(1);

        // Consultar el plan activo
        expect(planActivo(pacienteActualizado))
            .toBe(planReal.nombre);

        // Normalizar una fecha
        expect(fechaClave('2026-10-17')).toBe('2026-10-17');

        // Comprobar disponibilidad de una hora
        const fecha = '2026-11-20';

        guardarPacientes([
            {
                ...pacienteBaseParaReserva(),
                reservas: [
                    {
                        profesional: 'Ana',
                        fecha,
                        hora: '10:00'
                    }
                ]
            }
        ]);

        expect(horaOcupada('Ana', fecha, '10:00')).toBe(true);
        expect(horaOcupada('Ana', fecha, '11:00')).toBe(false);

        // Guardar una reserva válida
        const reserva = guardarReserva({
            profesional: 'Carlos',
            fecha,
            hora: '11:00',
            servicio: 'C1'
        });

        expect(reserva).toMatchObject({
            profesional: 'Carlos',
            hora: '11:00',
            pacienteId: 1
        });

        // Rechazar una hora no permitida
        expect(guardarReserva({
            profesional: 'Carlos',
            fecha,
            hora: '13:00',
            servicio: 'C1'
        })).toBeNull();

        // Rechazar una reserva duplicada
        expect(guardarReserva({
            profesional: 'Carlos',
            fecha,
            hora: '11:00',
            servicio: 'C1'
        })).toBeNull();
    });

});

function pacienteBaseParaReserva() {
    return {
        ...pacientes[0],
        reservas: []
    };
}