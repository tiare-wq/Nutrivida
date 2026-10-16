import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { agregarPlan, cambiarCantidad, compradosEsteAnio, fechaClave, guardarReserva, iniciarSesion, leerCarrito, leerPacientes, pacienteActual, registrarPedido } from '../data/almacen.js';

const datos = new Map();
globalThis.localStorage = {
    getItem: clave => datos.get(clave) ?? null,
    setItem: (clave, valor) => datos.set(clave, String(valor)),
    removeItem: clave => datos.delete(clave)
};
globalThis.window = { dispatchEvent: () => {} };

beforeEach(() => datos.clear());

test('ingresa con el paciente existente de main y conserva su ID', () => {
    assert.equal(iniciarSesion('PAME@OUTLOOK.COM', 'Paamela123.')?.id, 1);
    assert.equal(pacienteActual()?.nombre, 'Pamela Soto');
    assert.equal(iniciarSesion('pame@outlook.com', 'incorrecta'), undefined);
});

test('el carrito acepta únicamente diez planes por paciente y año', () => {
    iniciarSesion('pame@outlook.com', 'Paamela123.');
    for (let i = 0; i < 10; i++) assert.equal(agregarPlan('P1'), '');
    assert.match(agregarPlan('P2'), /máximo es de 10/);
    assert.equal(cambiarCantidad('P1', 11), false);
    assert.equal(leerCarrito(1)[0].cantidad, 10);
    const pedido = registrarPedido();
    assert.equal(pedido.planes[0].cantidad, 10);
    assert.equal(compradosEsteAnio(pacienteActual()), 10);
    assert.equal(leerCarrito(1).length, 0);
    assert.match(agregarPlan('P1'), /máximo es de 10/);
});

test('las reservas del paciente se guardan y bloquean la misma hora', () => {
    iniciarSesion('pame@outlook.com', 'Paamela123.');
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 2);
    const primera = guardarReserva({ servicio: 'Primera consulta nutricional', profesional: 'Carolina Pérez', fecha: fechaClave(fecha), hora: '10:00', precio: '35.000' });
    assert.equal(primera.pacienteId, 1);
    assert.equal(leerPacientes()[0].reservas.length, 1);
    assert.equal(guardarReserva({ ...primera, id: 999 }), null);
    assert.ok(guardarReserva({ ...primera, hora: '11:00' }));
});
