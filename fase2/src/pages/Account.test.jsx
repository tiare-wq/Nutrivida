import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OrderList } from "./Account";

afterEach(() => {
  vi.useRealTimers();
});

describe("progreso de planes en la cuenta", () => {
  it("muestra días transcurridos, restantes y barra para un pedido de plan activo", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-08T12:00:00.000Z"));
    render(
      <OrderList
        orders={[
          {
            id: "ORD-1",
            created: "2026-10-25T12:00:00.000Z",
            status: "confirmado",
            total: 65000,
            items: [
              {
                serviceId: 10,
                name: "Plan de pérdida de peso (1 mes)",
                price: 65000,
                quantity: 1,
                category: "plan",
                durationMonths: 1,
              },
            ],
          },
        ]}
      />,
    );

    expect(
      screen.getByText("Llevas 14 días de 31. Te quedan 17 días."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", {
        name: "Progreso de Plan de pérdida de peso (1 mes)",
      }),
    ).toHaveAttribute("aria-valuenow", "14");
  });
});
