import { createContext, useContext, useEffect, useReducer, useState, } from "react";
import { api } from "./api";
import { CART_KEY, cartReducer, readCart } from "./src/cart";

const Context = createContext(null);

export const useApp = () => useContext(Context);

export function Provider({ children }) {
  const [user, setUser] = useState(null),
    [planes, setPlanes] = useState(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [notice, setNotice] = useState("");
  const [items, dispatch] = useReducer(cartReducer, undefined, () =>
    readCart(),
  );
  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const [s, u] = await Promise.all([api("/servicios/planes"), api("/me")]);
      setPlanes(s);
      setUser(u.user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      setNotice(
        "El carrito solo se conservará mientras esta página siga abierta: el almacenamiento está bloqueado.",
      );
    }
  }, [items]);
  const add = (service) => {
    dispatch({ type: "add", id: service.id });
    setNotice(`${service.nombre} se agregó al carrito.`);
  };
  async function logout() {
    try {
      await api("/logout", { method: "POST" });
      setUser(null);
      dispatch({ type: "clear" });
      setNotice("Has cerrado tu sesión.");
    } catch (e) {
      setNotice(e.message);
    }
  }
  return (
    <Context.Provider
      value={{
        user,
        setUser,
        planes,
        error,
        loading,
        refresh,
        items,
        dispatch,
        add,
        notice,
        setNotice,
        logout,
      }}
    >
      {children}
    </Context.Provider>
  );
}
