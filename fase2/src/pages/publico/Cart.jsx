import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";

import { useApp } from "../../../context";
import { api } from "../../../api";
import CartView from "../../components/CartView";

function Cart() {
  const { items, dispatch, catalog, user } = useApp();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [order, setOrder] = useState(null);
  const lines = items.map((i) => ({
    ...i,
    ...catalog.services.find((s) => s.id === i.id),
  }));
  const invalid = lines.some((i) => !i.name);
  const requestKey = useMemo(() => crypto.randomUUID(), [items]);

  async function checkout() {
    setBusy(true);
    setError("");
    try {
      const result = await api("/orders", {
        method: "POST",
        body: {
          items: items.map((i) => ({ serviceId: i.id, quantity: i.quantity })),
          requestKey,
        },
      });
      setOrder(result.order);
      dispatch({ type: "clear" });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="page">
      <h1>Tu carrito</h1>
      <p>
        Revisa tu selección. El horario de atención se agenda por separado en
        Reservar.
      </p>
      {error && <Alert variant="danger">{error}</Alert>}
      {order && (
        <Alert variant="success">
          <h2>Pedido recibido: {order.id}</h2>
          <p>
            Total: {money(order.precio)}. Estado: pendiente. No se ha realizado
            un cobro.
          </p>
          <Link to="/mis-planes">Consultar mi pedido</Link>
        </Alert>
      )}
      {items.length === 0 ? (
        <div className="empty-state">
          <h2>Tu carrito está vacío</h2>
          <p>Explora nuestros servicios y agrega los que te interesan.</p>
          <Link to="/servicios/planes" className="btn btn-success">
            Explorar servicios
          </Link>
        </div>
      ) : (
        <>
          {invalid ? (
            <Alert variant="warning">
              Un servicio dejó de estar disponible. Vacía el carrito y
              selecciona nuevamente.
            </Alert>
          ) : (
            <CartView items={lines} dispatch={dispatch} busy={busy} />
          )}
          <div className="actions checkout">
            <Link to="/servicios/planes">Seguir eligiendo servicios</Link>
            <Button
              variant="outline-secondary"
              disabled={busy}
              onClick={() => dispatch({ type: "clear" })}
            >
              Vaciar carrito
            </Button>
            {user ? (
              <Button
                variant="success"
                disabled={busy || invalid}
                onClick={checkout}
              >
                {busy ? "Creando pedido…" : "Confirmar pedido"}
              </Button>
            ) : (
              <Link to="/login?next=/carrito" className="btn btn-success">
                Inicia sesión para confirmar
              </Link>
            )}
          </div>
          <p className="small-note">
            El pedido queda registrado para su gestión. Esta aplicación no
            incluye pasarela de pago.
          </p>
        </>
      )}
    </section>
  );
}
export default Cart;