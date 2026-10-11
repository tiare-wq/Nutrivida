import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openDatabase, passwordHash } from "./db.js";
import { createApp } from "./app.js";
import { availableSlots, chileNow, runValid } from "./domain.js";
const folder = mkdtempSync(join(tmpdir(), "nutrivida-test-"));
const file = join(folder, "test.sqlite");
let db, server, url, client, other, admin, orderId, reservationId;
const credentials = {
  name: "Cliente de prueba",
  email: "cliente@example.test",
  run: "12345678-5",
  password: "ClavePrueba2026",
};
let profileCookie;
const profileCredentials = { name: "Perfil de prueba", email: "perfil@example.test", run: "12345678-5", password: "PerfilPrueba2026" };
async function request(
  path,
  { method = "GET", body, cookie, headers = {} } = {},
) {
  const response = await fetch(url + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return {
    status: response.status,
    body: await response.json(),
    cookie: response.headers.get("set-cookie")?.split(";")[0],
  };
}
before(async () => {
  db = openDatabase(file);
  server = createApp(db);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  url = `http://127.0.0.1:${server.address().port}`;
  db.prepare(
    "INSERT INTO users(name,email,run,password,role) VALUES(?,?,?,?,'admin')",
  ).run(
    "Administrador de prueba",
    "admin@example.test",
    "12345678-5",
    passwordHash(credentials.password),
  );
});
after(async () => {
  await new Promise((resolve) => server.close(resolve));
  db.close();
  rmSync(folder, { recursive: true, force: true });
});
test("el catálogo contiene los 18 servicios y cuatro profesionales del proyecto", async () => {
  const r = await request("/api/catalog");
  assert.equal(r.status, 200);
  assert.equal(r.body.services.length, 18);
  assert.equal(r.body.professionals.length, 4);
});
test("rechaza RUN con dígito incorrecto", async () => {
  const r = await request("/api/register", {
    method: "POST",
    body: { ...credentials, run: "12345678-4" },
  });
  assert.equal(r.status, 400);
  assert.equal(runValid("10000013-k"), true);
});
test("registra cliente con hash y cookie HttpOnly", async () => {
  const r = await request("/api/register", {
    method: "POST",
    body: credentials,
  });
  assert.equal(r.status, 201);
  assert.equal(r.body.user.role, "cliente");
  assert.equal(r.body.user.password, undefined);
  client = r.cookie;
  const u = db
    .prepare("SELECT * FROM users WHERE email=?")
    .get(credentials.email);
  assert.notEqual(u.password, credentials.password);
});
test("rechaza correo duplicado", async () =>
  assert.equal(
    (await request("/api/register", { method: "POST", body: credentials }))
      .status,
    409,
  ));
test("rechaza contraseña incorrecta", async () =>
  assert.equal(
    (
      await request("/api/login", {
        method: "POST",
        body: { email: credentials.email, password: "Incorrecta2026" },
      })
    ).status,
    401,
  ));
test("mantiene sesión y protege administración", async () => {
  assert.equal(
    (await request("/api/me", { cookie: client })).body.user.email,
    credentials.email,
  );
  assert.equal(
    (await request("/api/admin/orders", { cookie: client })).status,
    403,
  );
  assert.equal((await request("/api/admin/orders")).status, 401);
});
test("impide pedido sin sesión y cantidades inválidas", async () => {
  assert.equal(
    (await request("/api/orders", { method: "POST", body: {} })).status,
    401,
  );
  for (const quantity of [-1, 0, 1.5, 100])
    assert.equal(
      (
        await request("/api/orders", {
          method: "POST",
          cookie: client,
          body: {
            requestKey: "request-invalid-0001",
            items: [{ serviceId: 1, quantity }],
          },
        })
      ).status,
      400,
    );
});
test("rechaza carrito vacío, duplicado o servicio inexistente", async () => {
  for (const items of [
    [],
    [{ serviceId: 9999, quantity: 1 }],
    [
      { serviceId: 1, quantity: 1 },
      { serviceId: 1, quantity: 1 },
    ],
  ])
    assert.equal(
      (
        await request("/api/orders", {
          method: "POST",
          cookie: client,
          body: { requestKey: "request-invalid-0001", items },
        })
      ).status,
      400,
    );
});
test("calcula precio desde base e impide doble envío", async () => {
  const body = {
    requestKey: "request-order-00001",
    items: [{ serviceId: 1, quantity: 2, price: 1 }],
    total: 1,
  };
  const r = await request("/api/orders", {
    method: "POST",
    cookie: client,
    body,
  });
  assert.equal(r.status, 201);
  assert.equal(r.body.order.total, 70000);
  orderId = r.body.order.id;
  assert.equal(
    (await request("/api/orders", { method: "POST", cookie: client, body }))
      .body.order.id,
    orderId,
  );
  assert.equal(db.prepare("SELECT count(*) AS n FROM orders").get().n, 1);
});
test("un segundo cliente no ve el pedido del primero", async () => {
  const r = await request("/api/register", {
    method: "POST",
    body: { ...credentials, email: "otro@example.test" },
  });
  other = r.cookie;
  assert.deepEqual(
    (await request("/api/orders", { cookie: other })).body.orders,
    [],
  );
});
test("administrador cambia estados válidos y bloquea retrocesos", async () => {
  admin = (
    await request("/api/login", {
      method: "POST",
      body: { email: "admin@example.test", password: credentials.password },
    })
  ).cookie;
  assert.equal(
    (await request("/api/admin/orders", { cookie: admin })).body.orders.length,
    1,
  );
  assert.equal(
    (
      await request("/api/admin/orders/" + orderId, {
        method: "PATCH",
        cookie: admin,
        body: { status: "confirmado" },
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await request("/api/admin/orders/" + orderId, {
        method: "PATCH",
        cookie: admin,
        body: { status: "pendiente" },
      })
    ).status,
    409,
  );
});
let date;
test("rechaza fecha pasada e incompatibilidad de profesional", async () => {
  assert.equal(
    (await request("/api/slots?service=1&professional=1&date=2020-01-01"))
      .status,
    400,
  );
  assert.equal(
    (await request("/api/slots?service=1&professional=4&date=2026-10-12"))
      .status,
    400,
  );
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 4);
  while ([0, 6].includes(d.getUTCDay())) d.setUTCDate(d.getUTCDate() + 1);
  date = d.toISOString().slice(0, 10);
  assert.equal(chileNow(new Date("2026-10-10T01:00:00Z")).date, "2026-10-09");
  assert.ok(availableSlots(db, 1, date, 50).includes("09:00"));
});
test("reserva real y rechazo concurrente del mismo horario", async () => {
  const body = { serviceId: 1, professionalId: 1, date, time: "09:00" };
  const results = await Promise.all([
    request("/api/reservations", { method: "POST", cookie: client, body }),
    request("/api/reservations", { method: "POST", cookie: other, body }),
  ]);
  assert.deepEqual(results.map((r) => r.status).sort(), [201, 409]);
  reservationId = results.find((r) => r.status === 201).body.reservation.id;
  assert.equal(
    db
      .prepare(
        "SELECT count(*) AS n FROM reservations WHERE status='confirmada'",
      )
      .get().n,
    1,
  );
  assert.ok(
    !(
      await request(`/api/slots?service=1&professional=1&date=${date}`)
    ).body.slots.includes("09:00"),
  );
});
test("respeta duración y evita superposición de bloques", () => {
  db.prepare("UPDATE reservations SET duration=120 WHERE id=?").run(
    reservationId,
  );
  assert.ok(!availableSlots(db, 1, date, 50).includes("10:00"));
  assert.ok(availableSlots(db, 1, date, 50).includes("11:00"));
});
test("cancelar libera horario y otro cliente no puede cancelar", async () => {
  const owner = db
    .prepare("SELECT user_id FROM reservations WHERE id=?")
    .get(reservationId).user_id;
  const nonOwner =
    owner === (await request("/api/me", { cookie: client })).body.user.id
      ? other
      : client;
  assert.equal(
    (
      await request(`/api/reservations/${reservationId}/cancel`, {
        method: "POST",
        cookie: nonOwner,
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await request(`/api/reservations/${reservationId}/cancel`, {
        method: "POST",
        cookie: admin,
      })
    ).status,
    200,
  );
  assert.ok(availableSlots(db, 1, date, 50).includes("09:00"));
});
test("gestiona servicios y conserva pedidos históricos", async () => {
  const original = (await request("/api/catalog")).body.services[0];
  assert.equal(
    (
      await request("/api/admin/services/1", {
        method: "PATCH",
        cookie: client,
        body: {},
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await request("/api/admin/services/1", {
        method: "PATCH",
        cookie: admin,
        body: { ...original, price: 36000, active: false },
      })
    ).status,
    200,
  );
  assert.ok(
    !(await request("/api/catalog")).body.services.some((s) => s.id === 1),
  );
  assert.equal(
    (await request("/api/orders", { cookie: client })).body.orders[0].total,
    70000,
  );
  assert.equal(
    (
      await request("/api/orders", {
        method: "POST",
        cookie: client,
        body: {
          requestKey: "request-disabled-001",
          items: [{ serviceId: 1, quantity: 1 }],
        },
      })
    ).status,
    400,
  );
});
test("bloquea solicitudes desde otro origen", async () =>
  assert.equal(
    (
      await request("/api/logout", {
        method: "POST",
        cookie: client,
        headers: { Origin: "https://externo.example" },
      })
    ).status,
    403,
  ));
test("los datos persisten al abrir otra conexión", () => {
  const persisted = openDatabase(file);
  assert.equal(
    persisted.prepare("SELECT total FROM orders WHERE id=?").get(orderId).total,
    70000,
  );
  assert.equal(
    persisted
      .prepare("SELECT status FROM reservations WHERE id=?")
      .get(reservationId).status,
    "cancelada",
  );
  persisted.close();
});
test("cerrar sesión invalida la cookie anterior", async () => {
  assert.equal(
    (await request("/api/logout", { method: "POST", cookie: client })).status,
    200,
  );
  assert.equal((await request("/api/me", { cookie: client })).body.user, null);
  assert.equal((await request("/api/orders", { cookie: client })).status, 401);
});
test("el perfil requiere sesión y no permite modificar rol ni otro usuario", async () => {
  assert.equal((await request("/api/me", { method: "PATCH", body: profileCredentials })).status, 401);
  profileCookie = (await request("/api/register", { method: "POST", body: profileCredentials })).cookie;
  const r = await request("/api/me", { method: "PATCH", cookie: profileCookie, body: { ...profileCredentials, name: "Nombre actualizado", role: "admin", id: 1 } });
  assert.equal(r.status, 200); assert.equal(r.body.user.name, "Nombre actualizado"); assert.equal(r.body.user.role, "cliente"); assert.equal(r.body.user.password, undefined);
  assert.equal((await request("/api/me", { cookie: profileCookie })).body.user.name, "Nombre actualizado");
});
test("el perfil rechaza nombre, correo y RUN inválidos sin cambiar los datos", async () => {
  for (const change of [{ name: " " }, { email: "incorrecto" }, { run: "12345678-4" }]) {
    assert.equal((await request("/api/me", { method: "PATCH", cookie: profileCookie, body: { ...profileCredentials, ...change } })).status, 400);
  }
  assert.equal((await request("/api/me", { cookie: profileCookie })).body.user.name, "Nombre actualizado");
});
test("cambiar correo exige contraseña y rechaza correo duplicado", async () => {
  for (const currentPassword of [undefined, "incorrecta"]) {
    assert.equal((await request("/api/me", { method: "PATCH", cookie: profileCookie, body: { ...profileCredentials, email: "nuevo@example.test", currentPassword } })).status, 401);
  }
  assert.equal((await request("/api/me", { method: "PATCH", cookie: profileCookie, body: { ...profileCredentials, email: credentials.email, currentPassword: profileCredentials.password } })).status, 409);
});
test("el correo actualizado permite ingresar y se conserva al reabrir SQLite", async () => {
  const updated = { ...profileCredentials, email: "nuevo@example.test", currentPassword: profileCredentials.password };
  assert.equal((await request("/api/me", { method: "PATCH", cookie: profileCookie, body: updated })).status, 200);
  assert.equal((await request("/api/login", { method: "POST", body: profileCredentials })).status, 401);
  assert.equal((await request("/api/login", { method: "POST", body: updated })).status, 200);
  const reopened = openDatabase(file); assert.ok(reopened.prepare("SELECT id FROM users WHERE email=?").get(updated.email)); reopened.close();
});
test("cambio de contraseña rechaza contraseña actual incorrecta y nueva inválida", async () => {
  for (const body of [{ currentPassword: "incorrecta", password: "NuevaPrueba2026" }, { currentPassword: profileCredentials.password, password: "123" }, { currentPassword: profileCredentials.password, password: profileCredentials.password }]) {
    assert.ok([400,401].includes((await request("/api/me/password", { method: "POST", cookie: profileCookie, body })).status));
  }
});
test("cambiar contraseña invalida todas las sesiones y permite el nuevo acceso", async () => {
  const second = await request("/api/login", { method: "POST", body: { ...profileCredentials, email: "nuevo@example.test" } });
  const r = await request("/api/me/password", { method: "POST", cookie: profileCookie, body: { currentPassword: profileCredentials.password, password: "NuevaPrueba2026" } });
  assert.equal(r.status, 200);
  for (const cookie of [profileCookie, second.cookie]) assert.equal((await request("/api/me", { cookie })).body.user, null);
  assert.equal((await request("/api/login", { method: "POST", body: { email: "nuevo@example.test", password: profileCredentials.password } })).status, 401);
  assert.equal((await request("/api/login", { method: "POST", body: { email: "nuevo@example.test", password: "NuevaPrueba2026" } })).status, 200);
});
