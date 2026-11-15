import React from "react";
import { useReducer } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, expect } from "vitest";
import { cartReducer } from "../cart";
import CartView from "./CartView";
function Harness() {
  const [items, dispatch] = useReducer(cartReducer, [
    { id: 1, name: "Consulta", price: 35000, quantity: 1 },
    { id: 2, name: "Evaluación", price: 18000, quantity: 1 },
  ]);
  return <CartView items={items} dispatch={dispatch} />;
}
it("actualiza el total cuando cambia la cantidad", async () => {
  const user = userEvent.setup();
  render(<Harness />);
  const field = screen.getAllByLabelText("Cantidad")[0];
  await user.clear(field);
  await user.type(field, "2");
  expect(screen.getByText("$88.000")).toBeInTheDocument();
});
it("quita solo el servicio seleccionado", async () => {
  const user = userEvent.setup();
  render(<Harness />);
  await user.click(screen.getByRole("button", { name: "Quitar Consulta" }));
  expect(
    screen.queryByRole("heading", { name: "Consulta" }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Evaluación" }),
  ).toBeInTheDocument();
});
