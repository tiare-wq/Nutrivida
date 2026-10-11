import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { openDatabase, passwordHash } from "./db.js";
import { emailValid, runValid } from "./domain.js";
const email = process.argv[2]?.trim().toLowerCase();
if (!emailValid(email)) {
  console.error("Uso: npm run admin -- correo@dominio.cl");
  process.exit(1);
}
const rl = createInterface({ input: stdin, output: stdout });
const name = await rl.question("Nombre del administrador: ");
const run = await rl.question("RUN válido (sin puntos, con guion): ");
const password = await rl.question(
  "Contraseña de al menos 8 caracteres (visible en esta terminal local): ",
);
rl.close();
if (
  name.trim().length < 2 ||
  !runValid(run) ||
  password.length < 8 ||
  password.length > 128
) {
  console.error("Datos inválidos. No se creó la cuenta.");
  process.exit(1);
}
const db = openDatabase();
if (db.prepare("SELECT id FROM users WHERE email=?").get(email)) {
  console.error("El correo ya existe. Usa un correo nuevo.");
  db.close();
  process.exit(1);
}
db.prepare(
  "INSERT INTO users(name,email,run,password,role) VALUES(?,?,?,?,'admin')",
).run(name.trim(), email, run.toUpperCase(), passwordHash(password));
db.close();
console.log("Administrador creado. Inicia sesión desde la aplicación.");
