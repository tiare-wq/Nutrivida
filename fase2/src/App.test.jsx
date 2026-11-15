import React from "react";
import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

const state = vi.hoisted(() => ({
  user: null,
  setNotice: vi.fn(),
  logout: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("./context", () => ({
  Provider: ({ children }) => children,
  useApp: () => ({
    user: state.user,
    items: [],
    notice: "",
    setNotice: state.setNotice,
    logout: state.logout,
    loading: false,
    error: "",
    refresh: state.refresh,
  }),
}));

vi.mock("./pages/Shop", () => ({
  Home: () => <h1>Inicio</h1>,
  Catalog: () => <h1>Servicios</h1>,
  Detail: () => <h1>Detalle de servicio</h1>,
  Cart: () => <h1>Carrito</h1>,
}));

vi.mock("./pages/Auth", () => ({
  default: () => <h1>Inicio de sesión</h1>,
}));

vi.mock("./pages/Reservation", () => ({
  default: () => <h1>Reservar</h1>,
}));

vi.mock("./pages/Account", () => ({
  default: () => <h1>Mi cuenta</h1>,
}));

vi.mock("./pages/Admin", () => ({
  default: () => <h1>Panel administrador</h1>,
}));

beforeEach(() => {
  state.user = null;
  window.history.pushState({}, "", "/");
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

it("permite que un administrador abra la página de administración", () => {
  state.user = { role: "admin" };
  window.history.pushState({}, "", "/admin");

  render(<App />);

  expect(
    screen.getByRole("heading", { name: "Panel administrador" }),
  ).toBeInTheDocument();
  expect(window.location.pathname).toBe("/admin");
});

it("redirige al cliente a su cuenta al intentar abrir administración", () => {
  state.user = { role: "cliente" };
  window.history.pushState({}, "", "/admin");

  render(<App />);

  expect(screen.getByRole("heading", { name: "Mi cuenta" })).toBeInTheDocument();
  expect(window.location.pathname).toBe("/cuenta");
  expect(screen.queryByText("Acceso restringido")).not.toBeInTheDocument();
});

it("redirige al login a quien no tiene sesión al abrir administración", () => {
  window.history.pushState({}, "", "/admin");

  render(<App />);

  expect(
    screen.getByRole("heading", { name: "Inicio de sesión" }),
  ).toBeInTheDocument();
  expect(window.location.pathname).toBe("/login");
  expect(window.location.search).toContain("next=%2Fadmin");
});
