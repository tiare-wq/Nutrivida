export const CART_KEY = "nutrivida-full-cart-v2";
export const money = (n) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
export function readCart(storage = localStorage) {
  try {
    const value = JSON.parse(storage.getItem(CART_KEY) || "[]");
    return Array.isArray(value)
      ? value.filter(
          (i) =>
            Number.isInteger(i.id) &&
            Number.isInteger(i.quantity) &&
            i.quantity >= 1 &&
            i.quantity <= 99,
        )
      : [];
  } catch {
    return [];
  }
}
export function cartReducer(items, action) {
  if (action.type === "clear") return [];
  if (action.type === "remove") return items.filter((i) => i.id !== action.id);
  if (action.type === "quantity")
    return items.map((i) =>
      i.id === action.id
        ? {
            ...i,
            quantity: Math.max(
              1,
              Math.min(99, Math.trunc(Number(action.quantity) || 1)),
            ),
          }
        : i,
    );
  if (action.type === "add")
    return items.some((i) => i.id === action.id)
      ? items.map((i) =>
          i.id === action.id
            ? { ...i, quantity: Math.min(99, i.quantity + 1) }
            : i,
        )
      : [...items, { id: action.id, quantity: 1 }];
  return items;
}
export const totalCart = (items) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0);
