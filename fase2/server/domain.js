export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
export const ensure = (condition, status, message) => {
  if (!condition) throw new ApiError(status, message);
};
export const emailValid = (email) =>
  typeof email === "string" &&
  email.length <= 160 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export function runValid(value) {
  if (typeof value !== "string" || !/^\d{7,8}-[\dkK]$/.test(value))
    return false;
  const [body, dv] = value.toUpperCase().split("-");
  let sum = 0,
    factor = 2;
  for (const n of [...body].reverse()) {
    sum += Number(n) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const result = 11 - (sum % 11);
  return (result === 11 ? "0" : result === 10 ? "K" : String(result)) === dv;
}
export function chileNow(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("sv-SE", {
      timeZone: "America/Santiago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
  };
}
export const minutes = (time) =>
  Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
export function validateDay(date, now = new Date()) {
  ensure(
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date),
    400,
    "Selecciona una fecha válida.",
  );
  const day = new Date(`${date}T12:00:00Z`);
  ensure(
    Number.isFinite(day.getTime()) && day.toISOString().slice(0, 10) === date,
    400,
    "Selecciona una fecha válida.",
  );
  const current = chileNow(now);
  ensure(
    date >= current.date && day.getTime() <= now.getTime() + 180 * 86400000,
    400,
    "La fecha debe estar entre hoy y los próximos 180 días.",
  );
  ensure(
    ![0, 6].includes(day.getUTCDay()),
    400,
    "La atención está disponible de lunes a viernes.",
  );
}
export function availableSlots(
  db,
  professionalId,
  date,
  duration,
  now = new Date(),
) {
  validateDay(date, now);
  const booked = db
    .prepare(
      "SELECT time,duration FROM reservations WHERE professional_id=? AND date=? AND status='confirmada'",
    )
    .all(professionalId, date);
  const current = chileNow(now);
  return ["09:00", "10:00", "11:00", "12:00", "15:00", "16:00", "17:00"].filter(
    (time) => {
      const start = minutes(time),
        end = start + duration;
      return (
        (date > current.date || time > current.time) &&
        end <= 18 * 60 &&
        !(start < 15 * 60 && end > 13 * 60) &&
        booked.every(
          (b) =>
            start >= minutes(b.time) + b.duration || end <= minutes(b.time),
        )
      );
    },
  );
}
export function orderLines(db, items) {
  ensure(
    Array.isArray(items) && items.length > 0 && items.length <= 50,
    400,
    "El carrito debe tener entre 1 y 50 servicios.",
  );
  const ids = new Set();
  return items.map((item) => {
    ensure(
      Number.isInteger(item.serviceId) && !ids.has(item.serviceId),
      400,
      "El carrito contiene servicios duplicados o inválidos.",
    );
    ids.add(item.serviceId);
    ensure(
      Number.isInteger(item.quantity) &&
        item.quantity >= 1 &&
        item.quantity <= 99,
      400,
      "La cantidad debe estar entre 1 y 99.",
    );
    const service = db
      .prepare("SELECT * FROM services WHERE id=? AND active=1")
      .get(item.serviceId);
    ensure(service, 400, "Uno de los servicios ya no está disponible.");
    return {
      serviceId: service.id,
      name: service.name,
      price: service.price,
      quantity: item.quantity,
    };
  });
}
