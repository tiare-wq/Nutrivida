import { describe, it, expect } from "vitest";
import { runValid, emailValid, localDate } from "./validation";
describe("Validación de registro", () => {
  it("comprueba el dígito verificador del RUN", () => {
    expect(runValid("12345678-5")).toBe(true);
    expect(runValid("12345678-4")).toBe(false);
  });
  it("rechaza RUN incompleto, con puntos o vacío", () => {
    for (const run of ["12.345.678-5", "12345678", undefined, ""])
      expect(runValid(run)).toBe(false);
  });
  it("acepta K minúscula o mayúscula", () => {
    expect(runValid("10000013-k")).toBe(true);
    expect(runValid("10000013-K")).toBe(true);
  });
  it("rechaza correos sin dominio y espacios", () => {
    expect(emailValid("usuario@ejemplo.cl")).toBe(true);
    for (const email of ["usuario", "a@", "a b@c.cl"])
      expect(emailValid(email)).toBe(false);
  });
  it("calcula fecha en Santiago, incluso al cambiar de día UTC", () =>
    expect(localDate(new Date("2026-10-10T01:00:00Z"))).toBe("2026-10-09"));
});
