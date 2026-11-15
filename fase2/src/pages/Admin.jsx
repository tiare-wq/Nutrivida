import React from "react";
import { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { api } from "../api";
import { useApp } from "../context";
import { money } from "../cart";
import { categories } from "./Shop";
import { OrderList, ReservationList } from "./Account";
const blank = {
  name: "",
  category: "consulta",
  price: "",
  duration: 50,
  description: "",
  modality: "Presencial",
  specialties: ["clinica"],
  active: true,
};
export default function Admin() {
  const { refresh } = useApp();
  const [tab, setTab] = useState("pedidos"),
    [orders, setOrders] = useState([]),
    [reservations, setReservations] = useState([]),
    [services, setServices] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [filter, setFilter] = useState(""),
    [form, setForm] = useState(null),
    [notice, setNotice] = useState("");
  async function load() {
    try {
      const [o, r, s] = await Promise.all([
        api("/admin/orders"),
        api("/admin/reservations"),
        api("/admin/services"),
      ]);
      setOrders(o.orders);
      setReservations(r.reservations);
      setServices(s.services);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function action(fn) {
    setBusy(true);
    setError("");
    try {
      await fn();
      await load();
      setNotice("Cambios guardados.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function status(id, status) {
    if (status === "cancelado" && !window.confirm("¿Cancelar este pedido?"))
      return;
    await action(() =>
      api("/admin/orders/" + id, { method: "PATCH", body: { status } }),
    );
  }
  async function cancel(id) {
    if (!window.confirm("¿Cancelar esta reserva?")) return;
    await action(() => api(`/reservations/${id}/cancel`, { method: "POST" }));
  }
  async function save(e) {
    e.preventDefault();
    await action(async () => {
      await api("/admin/services" + (form.id ? "/" + form.id : ""), {
        method: form.id ? "PATCH" : "POST",
        body: {
          ...form,
          price: Number(form.price),
          duration: Number(form.duration),
          active: !!form.active,
        },
      });
      setForm(null);
      await refresh();
    });
  }
  const change = (key, value) => setForm({ ...form, [key]: value });
  return (
    <section className="page">
      <h1>Administración</h1>
      <p>Gestiona pedidos, agenda y oferta de servicios.</p>
      <div className="tabs" role="group" aria-label="Sección de administración">
        {["pedidos", "reservas", "servicios"].map((t) => (
          <button
            aria-pressed={tab === t}
            className={tab === t ? "selected" : ""}
            key={t}
            onClick={() => {
              setTab(t);
              setFilter("");
              setForm(null);
            }}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <div role="status" className="save-notice">
        {notice}
      </div>
      {loading ? (
        <p role="status">Cargando administración…</p>
      ) : (
        <>
          {tab === "pedidos" && (
            <>
              <Form.Group className="filter-status" controlId="status-filter">
                <Form.Label>Filtrar por estado</Form.Label>
                <Form.Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  {["pendiente", "confirmado", "completado", "cancelado"].map(
                    (s) => (
                      <option key={s}>{s}</option>
                    ),
                  )}
                </Form.Select>
              </Form.Group>
              <OrderList
                orders={orders.filter((o) => !filter || o.status === filter)}
                admin
                onStatus={status}
                busy={busy}
              />
            </>
          )}
          {tab === "reservas" && (
            <ReservationList
              reservations={reservations}
              admin
              cancel={cancel}
              busy={busy}
            />
          )}
          {tab === "servicios" && (
            <>
              <div className="section-heading">
                <h2>Oferta de servicios</h2>
                <Button variant="success" onClick={() => setForm({ ...blank })}>
                  Nuevo servicio
                </Button>
              </div>
              {form ? (
                <Form className="form-surface service-form" onSubmit={save}>
                  <h3>{form.id ? "Editar servicio" : "Nuevo servicio"}</h3>
                  <div className="form-columns">
                    {[
                      ["name", "Nombre", "text"],
                      ["price", "Precio en CLP", "number"],
                      ["duration", "Duración en minutos", "number"],
                    ].map(([key, label, type]) => (
                      <Form.Group controlId={"edit-" + key} key={key}>
                        <Form.Label>{label}</Form.Label>
                        <Form.Control
                          required
                          type={type}
                          min={key === "duration" ? 15 : 1}
                          max={key === "duration" ? 180 : 10000000}
                          value={form[key]}
                          onChange={(e) => change(key, e.target.value)}
                        />
                      </Form.Group>
                    ))}
                    <Form.Group controlId="edit-category">
                      <Form.Label>Categoría</Form.Label>
                      <Form.Select
                        value={form.category}
                        onChange={(e) => change("category", e.target.value)}
                      >
                        {Object.entries(categories).map(([key, name]) => (
                          <option key={key} value={key}>
                            {name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="edit-modality">
                      <Form.Label>Modalidad</Form.Label>
                      <Form.Select
                        value={form.modality}
                        onChange={(e) => change("modality", e.target.value)}
                      >
                        {["Presencial", "Online", "Presencial (grupal)"].map(
                          (m) => (
                            <option key={m}>{m}</option>
                          ),
                        )}
                      </Form.Select>
                    </Form.Group>
                  </div>
                  <Form.Group controlId="edit-description" className="my-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      required
                      as="textarea"
                      minLength={5}
                      maxLength={1000}
                      value={form.description}
                      onChange={(e) => change("description", e.target.value)}
                    />
                  </Form.Group>
                  <fieldset>
                    <legend>Especialidades compatibles</legend>
                    {[
                      ["clinica", "Clínica"],
                      ["deportiva", "Deportiva"],
                      ["veg", "Vegetariana / vegana"],
                    ].map(([key, label]) => (
                      <Form.Check
                        id={"specialty-" + key}
                        key={key}
                        label={label}
                        checked={form.specialties.includes(key)}
                        onChange={(e) =>
                          change(
                            "specialties",
                            e.target.checked
                              ? [...form.specialties, key]
                              : form.specialties.filter((s) => s !== key),
                          )
                        }
                      />
                    ))}
                  </fieldset>
                  <Form.Check
                    id="edit-active"
                    className="my-3"
                    label="Disponible para nuevas compras y reservas"
                    checked={!!form.active}
                    onChange={(e) => change("active", e.target.checked)}
                  />
                  <div className="actions">
                    <Button variant="success" type="submit" disabled={busy}>
                      Guardar servicio
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => setForm(null)}
                    >
                      Volver a la lista
                    </Button>
                  </div>
                </Form>
              ) : (
                <div className="service-admin-list">
                  {services.map((s) => (
                    <article key={s.id}>
                      <div>
                        <h3>{s.name}</h3>
                        <p>
                          {categories[s.category]} · {money(s.price)} ·{" "}
                          {s.active ? "Disponible" : "Desactivado"}
                        </p>
                      </div>
                      <Button
                        variant="outline-success"
                        onClick={() => setForm({ ...s, active: !!s.active })}
                        aria-label={`Editar ${s.name}`}
                      >
                        Editar
                      </Button>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
