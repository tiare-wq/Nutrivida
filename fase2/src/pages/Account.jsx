import React from "react";
import { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { api } from "../api";
import { money } from "../cart";
import { Link } from "react-router-dom";
import Profile from "../components/Profile";
export function OrderList({ orders, admin = false, onStatus, busy }) {
  return !orders.length ? (
    <p className="empty-state">Todavía no hay pedidos.</p>
  ) : (
    <div className="records">
      {orders.map((o) => (
        <article className="record" key={o.id}>
          <div className="record-heading">
            <h3>{o.id}</h3>
            <span className={`status ${o.status}`}>{o.status}</span>
          </div>
          <p>
            {new Date(o.created).toLocaleString("es-CL", {
              timeZone: "America/Santiago",
            })}
            {admin ? ` · ${o.customer} · ${o.email}` : ""}
          </p>
          <ul>
            {o.items.map((i) => (
              <li key={i.serviceId}>
                {i.quantity} × {i.name}{" "}
                <strong>{money(i.price * i.quantity)}</strong>
              </li>
            ))}
          </ul>
          <div className="record-heading">
            <strong>Total: {money(o.total)}</strong>
            {admin && (
              <div className="actions">
                {(
                  {
                    pendiente: ["confirmado", "cancelado"],
                    confirmado: ["completado", "cancelado"],
                  }[o.status] || []
                ).map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={
                      s === "cancelado" ? "outline-danger" : "outline-success"
                    }
                    disabled={busy}
                    onClick={() => onStatus(o.id, s)}
                  >
                    {s === "cancelado"
                      ? "Cancelar"
                      : s === "confirmado"
                        ? "Confirmar"
                        : "Completar"}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
export function ReservationList({ reservations, admin = false, cancel, busy }) {
  return !reservations.length ? (
    <p className="empty-state">Todavía no hay reservas.</p>
  ) : (
    <div className="records">
      {reservations.map((r) => (
        <article className="record" key={r.id}>
          <div className="record-heading">
            <h3>{r.service}</h3>
            <span className={`status ${r.status}`}>{r.status}</span>
          </div>
          <p>
            {r.date} · {r.time} · {r.professional}
          </p>
          {admin && <p>Cliente: {r.customer}</p>}
          <div className="record-heading">
            <span>
              {r.id} · {money(r.price)}
            </span>
            {r.status === "confirmada" && (
              <Button
                variant="outline-danger"
                size="sm"
                disabled={busy}
                onClick={() => cancel(r.id)}
              >
                Cancelar reserva
              </Button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
export default function Account() {
  const [orders, setOrders] = useState([]),
    [reservations, setReservations] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false);
  async function load() {
    setError("");
    try {
      const [o, r] = await Promise.all([api("/orders"), api("/reservations")]);
      setOrders(o.orders);
      setReservations(r.reservations);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function cancel(id) {
    if (!window.confirm("¿Cancelar esta reserva? El horario quedará libre."))
      return;
    setBusy(true);
    try {
      await api(`/reservations/${id}/cancel`, { method: "POST" });
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="page">
      <h1>Mi cuenta</h1>
      <p>Tu historial de pedidos y atenciones, en un solo lugar.</p>
      <Profile />
      {error && (
        <Alert variant="danger">
          {error}
          <Button variant="link" onClick={load}>
            Reintentar
          </Button>
        </Alert>
      )}
      {loading ? (
        <p role="status">Cargando tu historial…</p>
      ) : (
        <div className="account-columns">
          <section>
            <div className="section-heading">
              <h2>Mis reservas</h2>
              <Link to="/reserva">Nueva reserva</Link>
            </div>
            <ReservationList
              reservations={reservations}
              cancel={cancel}
              busy={busy}
            />
          </section>
          <section>
            <div className="section-heading">
              <h2>Mis pedidos</h2>
              <Link to="/servicios">Ver servicios</Link>
            </div>
            <OrderList orders={orders} />
          </section>
        </div>
      )}
    </section>
  );
}
