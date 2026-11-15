import { describe, expect, it } from "vitest";
import { progresoPlan } from "./planProgress";

describe("progresoPlan", () => {
  it("calcula los días transcurridos y restantes para un plan vigente", () => {
    const ahora = new Date("2026-11-08T12:00:00.000Z");
    const progreso = progresoPlan("2026-10-25T12:00:00.000Z", 1, ahora);

    expect(progreso).toMatchObject({
      transcurridos: 14,
      restantes: 17,
      total: 31,
    });
  });

  it("no muestra progreso para pedidos vencidos o inválidos", () => {
    const ahora = new Date("2026-11-08T12:00:00.000Z");

    expect(progresoPlan("2026-09-01T12:00:00.000Z", 1, ahora)).toBeNull();
    expect(progresoPlan("fecha inválida", 1, ahora)).toBeNull();
    expect(progresoPlan("2026-10-25T12:00:00.000Z", 0, ahora)).toBeNull();
  });
});
