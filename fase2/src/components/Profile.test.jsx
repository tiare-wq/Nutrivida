import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { it, expect, vi, beforeEach } from "vitest";
import Profile from "./Profile";
const mocks = vi.hoisted(() => ({ api: vi.fn(), setUser: vi.fn(), setNotice: vi.fn() }));
vi.mock("../api", () => ({ api: mocks.api }));
vi.mock("../context", () => ({ useApp: () => ({ user: { name: "Cliente", email: "cliente@example.test", run: "12345678-5", role: "cliente" }, setUser: mocks.setUser, setNotice: mocks.setNotice }) }));
beforeEach(() => vi.clearAllMocks());
const show = () => render(<MemoryRouter><Profile /></MemoryRouter>);
it("guarda los datos y muestra confirmación sin enviar una contraseña", async () => {
  const user = userEvent.setup(); show();
  mocks.api.mockResolvedValue({ user: { name: "Cliente actualizado", email: "cliente@example.test", run: "12345678-5", role: "cliente" } });
  await user.clear(screen.getByLabelText("Nombre completo")); await user.type(screen.getByLabelText("Nombre completo"), "Cliente actualizado");
  await user.click(screen.getByRole("button", { name: "Guardar datos" }));
  expect(await screen.findByText("Tus datos se guardaron correctamente.")).toBeInTheDocument();
  expect(mocks.api).toHaveBeenCalledWith("/me", expect.objectContaining({ method: "PATCH", body: expect.objectContaining({ name: "Cliente actualizado" }) }));
});
it("exige contraseña al editar correo antes de enviar a la API", async () => {
  const user = userEvent.setup(); show();
  await user.clear(screen.getByLabelText("Correo electrónico")); await user.type(screen.getByLabelText("Correo electrónico"), "nuevo@example.test");
  await user.click(screen.getByRole("button", { name: "Guardar datos" }));
  expect(await screen.findByText("Ingresa tu contraseña actual")).toBeInTheDocument(); expect(mocks.api).not.toHaveBeenCalled();
});
it("impide cambiar la contraseña cuando la confirmación no coincide", async () => {
  const user = userEvent.setup(); show();
  await user.type(screen.getByLabelText("Contraseña actual", { exact: true }), "ActualPrueba2026");
  await user.type(screen.getByLabelText("Nueva contraseña", { exact: true }), "NuevaPrueba2026");
  await user.type(screen.getByLabelText("Repetir nueva contraseña"), "OtraPrueba2026");
  await user.click(screen.getByRole("button", { name: "Actualizar contraseña" }));
  expect(await screen.findByText("Las contraseñas no coinciden")).toBeInTheDocument(); expect(mocks.api).not.toHaveBeenCalled();
});
