import { DatabaseSync } from "node:sqlite";
import { readFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scryptSync,
  randomBytes,
  timingSafeEqual,
  createHash,
} from "node:crypto";
export const hashToken = (token) =>
  createHash("sha256").update(token).digest("hex");
export function passwordHash(password, salt = randomBytes(16).toString("hex")) {
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
export function passwordMatches(password, stored) {
  const [salt, hex] = stored.split(":");
  return timingSafeEqual(
    scryptSync(password, salt, 64),
    Buffer.from(hex, "hex"),
  );
}
export function openDatabase(file = process.env.DB_PATH || fileURLToPath(new URL('../data/nutrivida.sqlite', import.meta.url))) {
  if (file !== ":memory:") mkdirSync(dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, run TEXT NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'cliente' CHECK(role IN ('cliente','admin')));
    CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY, user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS services(id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, price INTEGER NOT NULL CHECK(price>0), description TEXT NOT NULL, duration INTEGER NOT NULL, modality TEXT NOT NULL, specialties TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1);
    CREATE TABLE IF NOT EXISTS professionals(id INTEGER PRIMARY KEY, name TEXT NOT NULL, specialty TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS orders(id TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), created TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pendiente', total INTEGER NOT NULL, request_key TEXT NOT NULL, UNIQUE(user_id,request_key));
    CREATE TABLE IF NOT EXISTS order_items(order_id TEXT REFERENCES orders(id), service_id INTEGER REFERENCES services(id), name TEXT NOT NULL, price INTEGER NOT NULL, quantity INTEGER NOT NULL CHECK(quantity BETWEEN 1 AND 99), PRIMARY KEY(order_id,service_id));
    CREATE TABLE IF NOT EXISTS reservations(id TEXT PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id), service_id INTEGER NOT NULL REFERENCES services(id),professional_id INTEGER NOT NULL REFERENCES professionals(id), date TEXT NOT NULL,time TEXT NOT NULL,duration INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'confirmada',price INTEGER NOT NULL,created TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS reservation_slot ON reservations(professional_id,date,status);
  `);
  if (!db.prepare("SELECT id FROM services LIMIT 1").get()) {
    const catalog = JSON.parse(
      readFileSync(new URL("./catalog.json", import.meta.url), "utf8"),
    );
    const service = db.prepare(
      "INSERT INTO services(id,name,category,price,description,duration,modality,specialties) VALUES(?,?,?,?,?,?,?,?)",
    );
    for (const s of catalog.services)
      service.run(
        s.id,
        s.name,
        s.category,
        s.price,
        s.description,
        s.duration,
        s.modality,
        JSON.stringify(s.specialties),
      );
    for (const p of catalog.professionals)
      db.prepare("INSERT INTO professionals VALUES(?,?,?)").run(
        p.id,
        p.name,
        p.specialty,
      );
  }
  return db;
}
