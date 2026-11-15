import { describe, it, expect } from "vitest";
import { CART_KEY, cartReducer, readCart, totalCart, money } from "./cart";
describe("Carrito: reglas de negocio", () => {
  it("agrega un servicio con cantidad uno", () =>
    expect(cartReducer([], { type: "add", id: 1 })).toEqual([
      { id: 1, quantity: 1 },
    ]));
  it("agrupa el mismo servicio", () =>
    expect(
      cartReducer([{ id: 1, quantity: 2 }], { type: "add", id: 1 }),
    ).toEqual([{ id: 1, quantity: 3 }]));
  it("mantiene otros servicios al agregar", () =>
    expect(
      cartReducer([{ id: 1, quantity: 1 }], { type: "add", id: 2 }),
    ).toHaveLength(2));
  it("impide cantidades negativas y decimales", () => {
    expect(
      cartReducer([{ id: 1, quantity: 2 }], {
        type: "quantity",
        id: 1,
        quantity: -1,
      })[0].quantity,
    ).toBe(1);
    expect(
      cartReducer([{ id: 1, quantity: 2 }], {
        type: "quantity",
        id: 1,
        quantity: 2.8,
      })[0].quantity,
    ).toBe(2);
  });
  it("limita la cantidad a 99", () => {
    expect(
      cartReducer([{ id: 1, quantity: 99 }], { type: "add", id: 1 })[0]
        .quantity,
    ).toBe(99);
    expect(
      cartReducer([{ id: 1, quantity: 1 }], {
        type: "quantity",
        id: 1,
        quantity: 1000,
      })[0].quantity,
    ).toBe(99);
  });
  it("elimina un servicio sin borrar el resto", () =>
    expect(
      cartReducer(
        [
          { id: 1, quantity: 1 },
          { id: 2, quantity: 3 },
        ],
        { type: "remove", id: 1 },
      ),
    ).toEqual([{ id: 2, quantity: 3 }]));
  it("vacía el carrito", () =>
    expect(cartReducer([{ id: 1, quantity: 1 }], { type: "clear" })).toEqual(
      [],
    ));
  it("calcula total en pesos enteros", () =>
    expect(
      totalCart([
        { price: 18000, quantity: 2 },
        { price: 12000, quantity: 1 },
      ]),
    ).toBe(48000));
  it("recupera la selección persistida", () => {
    localStorage.setItem(CART_KEY, JSON.stringify([{ id: 1, quantity: 3 }]));
    expect(readCart()).toEqual([{ id: 1, quantity: 3 }]);
  });
  it("descarta almacenamiento corrupto o inválido", () => {
    for (const value of ["{", "null", "{}", '[{"id":1,"quantity":-1}]']) {
      localStorage.setItem(CART_KEY, value);
      expect(readCart()).toEqual([]);
    }
  });
  it("formatea dinero chileno", () => expect(money(18000)).toContain("18.000"));
});
