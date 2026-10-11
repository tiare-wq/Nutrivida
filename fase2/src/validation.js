export const emailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export function runValid(value) {
  if (!/^\d{7,8}-[\dkK]$/.test(value || "")) return false;
  const [body, dv] = value.toUpperCase().split("-");
  let sum = 0,
    factor = 2;
  for (const n of [...body].reverse()) {
    sum += Number(n) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const check = 11 - (sum % 11);
  return (check === 11 ? "0" : check === 10 ? "K" : String(check)) === dv;
}
export function localDate(date = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
