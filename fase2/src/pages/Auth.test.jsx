import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { it, expect, vi } from "vitest";
import Auth from "./Auth";
// Aislamiento del contexto: estas pruebas comprueban el formulario, no la API.
vi.mock("../context", () => ({
  useApp: () => ({ user: null, setUser: vi.fn() }),
}));
const show = (registerMode = false) =>
  render(
    <MemoryRouter>
      <Auth registerMode={registerMode} />
    </MemoryRouter>,
  );
it("muestra campos de inicio de sesión asociados a sus etiquetas", () => {
  show();
  expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
  expect(screen.getByLabelText("Contraseña")).toHaveAttribute(
    "type",
    "password",
  );
});
it("rechaza correo inválido y contraseña corta antes de enviar", async () => {
  const user = userEvent.setup();
  show();
  await user.type(screen.getByLabelText("Correo electrónico"), "correo");
  await user.type(screen.getByLabelText("Contraseña"), "12");
  await user.click(screen.getByRole("button", { name: "Ingresar" }));
  expect(
    await screen.findByText("Introduce un correo válido."),
  ).toBeInTheDocument();
  expect(screen.getByText("Usa al menos 8 caracteres.")).toBeInTheDocument();
});
it("valida RUN y nombre en el registro", async () => {
  const user = userEvent.setup();
  show(true);
  await user.type(screen.getByLabelText("RUN"), "12345678-4");
  await user.click(screen.getByRole("button", { name: "Crear cuenta" }));
  expect(
    await screen.findByText("Introduce un RUN válido, sin puntos y con guion."),
  ).toBeInTheDocument();
  expect(screen.getByText("Escribe tu nombre.")).toBeInTheDocument();
});
