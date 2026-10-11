import { createServer } from "node:http";
import { randomBytes, randomUUID } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { hashToken, passwordHash, passwordMatches } from "./db.js";
import {
  ensure,
  ApiError,
  emailValid,
  runValid,
  availableSlots,
  orderLines,
} from "./domain.js";
const safeUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  run: u.run,
  role: u.role,
});
export function createApp(
  db,
  {
    dist = fileURLToPath(new URL("../dist", import.meta.url)),
    secureCookie = process.env.COOKIE_SECURE === "true",
  } = {},
) {
  const attempts = new Map();
  function session(req) {
    const token = (req.headers.cookie || "")
      .split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith("nv_session="))
      ?.slice(11);
    return token
      ? db
          .prepare(
            "SELECT u.* FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.token=? AND s.expires>?",
          )
          .get(hashToken(token), Date.now())
      : null;
  }
  const requireUser = (req) => {
    const u = session(req);
    ensure(u, 401, "Inicia sesión para continuar.");
    return u;
  };
  const requireAdmin = (req) => {
    const u = requireUser(req);
    ensure(
      u.role === "admin",
      403,
      "Esta acción requiere una cuenta administradora.",
    );
    return u;
  };
  const serializeService = (s) => ({
    ...s,
    specialties: JSON.parse(s.specialties),
  });
  function orders(user, admin) {
    return db
      .prepare(
        `SELECT o.*,u.name AS customer,u.email FROM orders o JOIN users u ON u.id=o.user_id ${admin ? "" : "WHERE o.user_id=?"} ORDER BY created DESC`,
      )
      .all(...(admin ? [] : [user.id]))
      .map((o) => ({
        ...o,
        items: db
          .prepare(
            "SELECT service_id AS serviceId,name,price,quantity FROM order_items WHERE order_id=?",
          )
          .all(o.id),
      }));
  }
  const reservationList = (user, admin) =>
    db
      .prepare(
        `SELECT r.*,s.name AS service,p.name AS professional,u.name AS customer FROM reservations r JOIN services s ON s.id=r.service_id JOIN professionals p ON p.id=r.professional_id JOIN users u ON u.id=r.user_id ${admin ? "" : "WHERE r.user_id=?"} ORDER BY date DESC,time`,
      )
      .all(...(admin ? [] : [user.id]));
  return createServer(async (req, res) => {
    const json = (status, payload) => {
      res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
      res.end(JSON.stringify(payload));
    };
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "same-origin");
    try {
      const url = new URL(req.url, "http://localhost");
      const path = url.pathname;
      const method = req.method;
      if (path.startsWith("/api/")) {
        if (!["GET", "HEAD"].includes(method)) {
          const origin = req.headers.origin;
          ensure(
            req.headers["sec-fetch-site"] !== "cross-site" &&
              (!origin || new URL(origin).host === req.headers.host),
            403,
            "Origen de solicitud no permitido.",
          );
        }
        let data = {};
        if (["POST", "PATCH"].includes(method)) {
          ensure(
            req.headers["content-type"]?.startsWith("application/json"),
            415,
            "Usa contenido JSON.",
          );
          let raw = "";
          for await (const chunk of req) {
            raw += chunk;
            ensure(
              Buffer.byteLength(raw) <= 32768,
              413,
              "La solicitud es demasiado grande.",
            );
          }
          try {
            data = JSON.parse(raw || "{}");
          } catch {
            throw new ApiError(400, "El contenido JSON no es válido.");
          }
          ensure(
            data && typeof data === "object" && !Array.isArray(data),
            400,
            "Los datos no son válidos.",
          );
        }
        if (method === "GET" && path === "/api/health")
          return json(200, { ok: true });
        if (method === "GET" && path === "/api/catalog")
          return json(200, {
            services: db
              .prepare("SELECT * FROM services WHERE active=1 ORDER BY id")
              .all()
              .map(serializeService),
            professionals: db.prepare("SELECT * FROM professionals").all(),
          });
        if (method === "GET" && path === "/api/me")
          return json(200, {
            user: session(req) ? safeUser(session(req)) : null,
          });
        if (method === "PATCH" && path === "/api/me") {
          const user = requireUser(req);
          ensure(typeof data.name === "string" && data.name.trim().length >= 2 && data.name.trim().length <= 100, 400, "El nombre debe tener entre 2 y 100 caracteres.");
          ensure(emailValid(data.email), 400, "Introduce un correo válido.");
          ensure(runValid(data.run), 400, "Introduce un RUN válido, sin puntos y con guion.");
          const email = data.email.trim().toLowerCase();
          if (email !== user.email) {
            ensure(typeof data.currentPassword === "string" && data.currentPassword.length <= 128 && passwordMatches(data.currentPassword, user.password), 401, "La contraseña actual es incorrecta.");
            ensure(!db.prepare("SELECT id FROM users WHERE email=? AND id<>?").get(email, user.id), 409, "Ya existe una cuenta con ese correo.");
          }
          db.prepare("UPDATE users SET name=?,email=?,run=? WHERE id=?").run(data.name.trim(), email, data.run.toUpperCase(), user.id);
          return json(200, { user: safeUser(db.prepare("SELECT * FROM users WHERE id=?").get(user.id)) });
        }
        if (method === "POST" && path === "/api/me/password") {
          const user = requireUser(req);
          ensure(typeof data.currentPassword === "string" && data.currentPassword.length <= 128 && passwordMatches(data.currentPassword, user.password), 401, "La contraseña actual es incorrecta.");
          ensure(typeof data.password === "string" && data.password.length >= 8 && data.password.length <= 128, 400, "La contraseña debe tener entre 8 y 128 caracteres.");
          ensure(data.password !== data.currentPassword, 400, "La nueva contraseña debe ser diferente de la actual.");
          db.prepare("UPDATE users SET password=? WHERE id=?").run(passwordHash(data.password), user.id);
          db.prepare("DELETE FROM sessions WHERE user_id=?").run(user.id);
          res.setHeader("Set-Cookie", `nv_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureCookie ? "; Secure" : ""}`);
          return json(200, { ok: true });
        }
        if (
          method === "POST" &&
          (path === "/api/register" || path === "/api/login")
        ) {
          const key = req.socket.remoteAddress;
          const entry = attempts.get(key);
          const count =
            entry && entry.until > Date.now()
              ? entry
              : { count: 0, until: Date.now() + 600000 };
          count.count++;
          attempts.set(key, count);
          ensure(
            count.count <= 30,
            429,
            "Demasiados intentos. Vuelve a intentarlo en diez minutos.",
          );
          ensure(emailValid(data.email), 400, "Introduce un correo válido.");
          const email = data.email.trim().toLowerCase();
          ensure(
            typeof data.password === "string" &&
              data.password.length >= 8 &&
              data.password.length <= 128,
            400,
            "La contraseña debe tener entre 8 y 128 caracteres.",
          );
          let user;
          if (path === "/api/register") {
            ensure(
              typeof data.name === "string" &&
                data.name.trim().length >= 2 &&
                data.name.trim().length <= 100,
              400,
              "El nombre debe tener entre 2 y 100 caracteres.",
            );
            ensure(
              runValid(data.run),
              400,
              "Introduce un RUN válido, sin puntos y con guion.",
            );
            ensure(
              !db.prepare("SELECT id FROM users WHERE email=?").get(email),
              409,
              "Ya existe una cuenta con ese correo.",
            );
            const result = db
              .prepare(
                "INSERT INTO users(name,email,run,password) VALUES(?,?,?,?)",
              )
              .run(
                data.name.trim(),
                email,
                data.run.toUpperCase(),
                passwordHash(data.password),
              );
            user = db
              .prepare("SELECT * FROM users WHERE id=?")
              .get(result.lastInsertRowid);
          } else {
            user = db.prepare("SELECT * FROM users WHERE email=?").get(email);
            const valid = passwordMatches(
              data.password,
              user?.password || passwordHash("invalid-password"),
            );
            ensure(
              user && valid,
              401,
              "El correo o la contraseña son incorrectos.",
            );
          }
          const token = randomBytes(32).toString("hex");
          db.prepare("DELETE FROM sessions WHERE expires<=?").run(Date.now());
          db.prepare("INSERT INTO sessions VALUES(?,?,?)").run(
            hashToken(token),
            user.id,
            Date.now() + 8 * 3600000,
          );
          res.setHeader(
            "Set-Cookie",
            `nv_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800${secureCookie ? "; Secure" : ""}`,
          );
          return json(path === "/api/register" ? 201 : 200, {
            user: safeUser(user),
          });
        }
        if (method === "POST" && path === "/api/logout") {
          const token = (req.headers.cookie || "")
            .split(";")
            .map((s) => s.trim())
            .find((s) => s.startsWith("nv_session="))
            ?.slice(11);
          if (token)
            db.prepare("DELETE FROM sessions WHERE token=?").run(
              hashToken(token),
            );
          res.setHeader(
            "Set-Cookie",
            "nv_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
          );
          return json(200, { ok: true });
        }
        if (method === "GET" && path === "/api/orders") {
          const u = requireUser(req);
          return json(200, { orders: orders(u, false) });
        }
        if (method === "POST" && path === "/api/orders") {
          const user = requireUser(req);
          ensure(
            typeof data.requestKey === "string" &&
              /^[\w-]{16,80}$/.test(data.requestKey),
            400,
            "Falta el identificador de la solicitud.",
          );
          const existing = db
            .prepare("SELECT id FROM orders WHERE user_id=? AND request_key=?")
            .get(user.id, data.requestKey);
          if (existing)
            return json(200, {
              order: orders(user, false).find((o) => o.id === existing.id),
            });
          const lines = orderLines(db, data.items);
          const total = lines.reduce((n, i) => n + i.price * i.quantity, 0);
          const id = "NV-" + randomUUID().slice(0, 8).toUpperCase();
          db.exec("BEGIN IMMEDIATE");
          try {
            db.prepare(
              "INSERT INTO orders(id,user_id,created,total,request_key) VALUES(?,?,?,?,?)",
            ).run(
              id,
              user.id,
              new Date().toISOString(),
              total,
              data.requestKey,
            );
            for (const i of lines)
              db.prepare("INSERT INTO order_items VALUES(?,?,?,?,?)").run(
                id,
                i.serviceId,
                i.name,
                i.price,
                i.quantity,
              );
            db.exec("COMMIT");
          } catch (error) {
            db.exec("ROLLBACK");
            throw error;
          }
          return json(201, {
            order: orders(user, false).find((o) => o.id === id),
          });
        }
        if (method === "GET" && path === "/api/slots") {
          const service = db
            .prepare("SELECT * FROM services WHERE id=? AND active=1")
            .get(Number(url.searchParams.get("service")));
          const professional = db
            .prepare("SELECT * FROM professionals WHERE id=?")
            .get(Number(url.searchParams.get("professional")));
          ensure(
            service &&
              professional &&
              JSON.parse(service.specialties).includes(professional.specialty),
            400,
            "Selecciona un servicio y profesional compatibles.",
          );
          return json(200, {
            slots: availableSlots(
              db,
              professional.id,
              url.searchParams.get("date"),
              service.duration,
            ),
          });
        }
        if (method === "GET" && path === "/api/reservations") {
          const u = requireUser(req);
          return json(200, { reservations: reservationList(u, false) });
        }
          if (method === "POST" && path === "/api/reservations") {
            const u = requireUser(req);
            ensure(Number.isInteger(data.serviceId) && Number.isInteger(data.professionalId),400,"Selecciona un servicio y profesional válidos.");
          const service = db
            .prepare("SELECT * FROM services WHERE id=? AND active=1")
            .get(data.serviceId);
          const pro = db
            .prepare("SELECT * FROM professionals WHERE id=?")
            .get(data.professionalId);
          ensure(
            service &&
              pro &&
              JSON.parse(service.specialties).includes(pro.specialty),
            400,
            "Selecciona un servicio y profesional compatibles.",
          );
          db.exec("BEGIN IMMEDIATE");
          const id = "RS-" + randomUUID().slice(0, 8).toUpperCase();
          try {
            ensure(
              availableSlots(db, pro.id, data.date, service.duration).includes(
                data.time,
              ),
              409,
              "Ese horario ya no está disponible. Selecciona otro.",
            );
            db.prepare(
              "INSERT INTO reservations(id,user_id,service_id,professional_id,date,time,duration,price,created) VALUES(?,?,?,?,?,?,?,?,?)",
            ).run(
              id,
              u.id,
              service.id,
              pro.id,
              data.date,
              data.time,
              service.duration,
              service.price,
              new Date().toISOString(),
            );
            db.exec("COMMIT");
          } catch (error) {
            db.exec("ROLLBACK");
            throw error;
          }
          return json(201, {
            reservation: reservationList(u, false).find((r) => r.id === id),
          });
        }
        const cancel = path.match(/^\/api\/reservations\/([^/]+)\/cancel$/);
        if (method === "POST" && cancel) {
          const u = requireUser(req);
          const r = db
            .prepare("SELECT * FROM reservations WHERE id=?")
            .get(cancel[1]);
          ensure(r, 404, "La reserva no existe.");
          ensure(
            r.user_id === u.id || u.role === "admin",
            403,
            "No puedes modificar esta reserva.",
          );
          ensure(
            r.status === "confirmada",
            409,
            "La reserva ya está cancelada.",
          );
          db.prepare(
            "UPDATE reservations SET status='cancelada' WHERE id=?",
          ).run(r.id);
          return json(200, { ok: true });
        }
        if (method === "GET" && path === "/api/admin/orders") {
          const u = requireAdmin(req);
          return json(200, { orders: orders(u, true) });
        }
        if (method === "GET" && path === "/api/admin/reservations") {
          const u = requireAdmin(req);
          return json(200, { reservations: reservationList(u, true) });
        }
        const orderPatch = path.match(/^\/api\/admin\/orders\/([^/]+)$/);
        if (method === "PATCH" && orderPatch) {
          requireAdmin(req);
          const o = db
            .prepare("SELECT * FROM orders WHERE id=?")
            .get(orderPatch[1]);
          ensure(o, 404, "El pedido no existe.");
          const next = {
            pendiente: ["confirmado", "cancelado"],
            confirmado: ["completado", "cancelado"],
            completado: [],
            cancelado: [],
          };
          ensure(
            next[o.status].includes(data.status),
            409,
            "El cambio de estado no está permitido.",
          );
          db.prepare("UPDATE orders SET status=? WHERE id=?").run(
            data.status,
            o.id,
          );
          return json(200, { ok: true });
        }
        if (method === "GET" && path === "/api/admin/services") {
          requireAdmin(req);
          return json(200, {
            services: db
              .prepare("SELECT * FROM services ORDER BY id")
              .all()
              .map(serializeService),
          });
        }
        const servicePatch = path.match(/^\/api\/admin\/services\/(\d+)$/);
        if (
          (method === "POST" && path === "/api/admin/services") ||
          (method === "PATCH" && servicePatch)
        ) {
          requireAdmin(req);
          ensure(
            typeof data.name === "string" &&
              data.name.trim().length >= 3 &&
              data.name.length <= 150,
            400,
            "Introduce un nombre de servicio de 3 a 150 caracteres.",
          );
          ensure(
            ["consulta", "evaluacion", "plan", "taller"].includes(
              data.category,
            ),
            400,
            "Selecciona una categoría válida.",
          );
          ensure(
            Number.isInteger(data.price) &&
              data.price > 0 &&
              data.price <= 10000000,
            400,
            "Introduce un precio entero positivo.",
          );
          ensure(
            Number.isInteger(data.duration) &&
              data.duration >= 15 &&
              data.duration <= 180,
            400,
            "La duración debe estar entre 15 y 180 minutos.",
          );
          ensure(
            ["Presencial", "Online", "Presencial (grupal)"].includes(
              data.modality,
            ),
            400,
            "Selecciona una modalidad válida.",
          );
          ensure(
            typeof data.description === "string" &&
              data.description.length >= 5 &&
              data.description.length <= 1000,
            400,
            "La descripción debe tener entre 5 y 1000 caracteres.",
          );
          ensure(
            Array.isArray(data.specialties) &&
              data.specialties.length > 0 &&
              data.specialties.every((s) =>
                ["clinica", "deportiva", "veg"].includes(s),
              ),
            400,
            "Selecciona al menos una especialidad.",
          );
          const params = [
            data.name.trim(),
            data.category,
            data.price,
            data.description.trim(),
            data.duration,
            data.modality,
            JSON.stringify(data.specialties),
            data.active === false || data.active === 0 ? 0 : 1,
          ];
          if (servicePatch) {
            ensure(
              db
                .prepare("SELECT id FROM services WHERE id=?")
                .get(Number(servicePatch[1])),
              404,
              "El servicio no existe.",
            );
            db.prepare(
              "UPDATE services SET name=?,category=?,price=?,description=?,duration=?,modality=?,specialties=?,active=? WHERE id=?",
            ).run(...params, Number(servicePatch[1]));
          } else
            db.prepare(
              "INSERT INTO services(name,category,price,description,duration,modality,specialties,active) VALUES(?,?,?,?,?,?,?,?)",
            ).run(...params);
          return json(200, { ok: true });
        }
        return json(404, { error: "La operación solicitada no existe." });
      }
      ensure(["GET", "HEAD"].includes(method), 405, "Método no permitido.");
      const base = resolve(dist);
      let target = resolve(base, "." + decodeURIComponent(path));
      ensure(
        target === base || target.startsWith(base + sep),
        403,
        "Ruta no permitida.",
      );
      const info = await stat(target).catch(() => null);
      if (!info?.isFile()) {
        ensure(!extname(path), 404, "El archivo no existe.");
        target = resolve(base, "index.html");
      }
      const bytes = await readFile(target).catch(() => null);
      ensure(
        bytes,
        404,
        "Compila el frontend con npm run build o abre Vite en el puerto 5173.",
      );
      const types = {
        ".html": "text/html; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".png": "image/png",
        ".webp": "image/webp",
        ".svg": "image/svg+xml",
        ".ico": "image/x-icon",
      };
      res.writeHead(200, {
        "Content-Type": types[extname(target)] || "application/octet-stream",
        "Cache-Control":
          extname(target) === ".html" ? "no-cache" : "public, max-age=3600",
      });
      res.end(method === "HEAD" ? undefined : bytes);
    } catch (error) {
      if (!error.status) console.error("Error interno:", error.message);
      json(error.status || 500, {
        error: error.status
          ? error.message
          : "Ocurrió un error. Intenta nuevamente.",
      });
    }
  });
}
