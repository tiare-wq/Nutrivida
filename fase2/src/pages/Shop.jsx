import React from "react";
import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";
import { useApp } from "../context";
import { api } from "../api";
import { money } from "../cart";
import CartView from "../components/CartView";
export const categories = {
  consulta: "Consultas nutricionales",
  evaluacion: "Evaluaciones",
  plan: "Planes de alimentación",
  taller: "Talleres grupales",
};
const images = {
  consulta: "nutricionistaPaciente.png",
  evaluacion: "evaluacion.png",
  plan: "planes.png",
  taller: "taller.png",
};
export function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <h1>
            No todos necesitamos lo mismo.
            <br />
            Tu plan tampoco debería serlo.
          </h1>
          <p>
            Atención nutricional personalizada para acompañarte en cada etapa de
            tu vida.
          </p>
          <div className="actions">
            <Link className="btn btn-success" to="/reserva">
              Agenda tu atención
            </Link>
            <Link className="text-link" to="/servicios">
              Conoce nuestros servicios <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>
            </Link>
          </div>
        </div>
        <img
          src="/img/nutricion.png"
          alt="Alimentación y bienestar NutriVida"
        />
      </section>
      <section className="page home-services">
        <div>
          <h2>Un acompañamiento a tu medida</h2>
          <p>
            Consultas, evaluaciones, planes de alimentación y talleres.
            Encuentra el servicio que responde a tus objetivos.
          </p>
        </div>
        <div className="category-list">
          {Object.entries(categories).map(([key, title]) => (
            <Link key={key} to={`/servicios?categoria=${key}`}>
              <img src={`/img/${images[key]}`} alt="" />
              <span>{title}</span>
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 18 18 6M6 6h12v12" /></svg>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
export function Catalog() {
  const { catalog, add } = useApp();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const category = params.get("categoria") || "";
  const services = catalog.services.filter(
    (s) =>
      (!category || s.category === category) &&
      s.name.toLocaleLowerCase("es").includes(search.toLocaleLowerCase("es")),
  );
  return (
    <section className="page">
      <div className="page-heading">
        <h1>Encuentra tu próximo paso</h1>
        <p>Explora las atenciones de NutriVida. Precios en pesos chilenos.</p>
      </div>
      <div className="catalog-layout">
        <aside className="catalog-filters">
          <h2>Servicios</h2>
          <button
            className={!category ? "selected" : ""}
            onClick={() => setParams({})}
          >
            Todos los servicios
          </button>
          {Object.entries(categories).map(([key, title]) => (
            <button
              className={category === key ? "selected" : ""}
              key={key}
              onClick={() => setParams({ categoria: key })}
            >
              {title}
            </button>
          ))}
          <label htmlFor="search">Buscar por nombre</label>
          <input
            className="form-control"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nombre del servicio"
          />
        </aside>
        <div className="service-results">
          <p className="result-count">
            {services.length} servicios disponibles
          </p>
          {!services.length && (
            <Alert variant="light">
              No hay servicios que coincidan. Prueba otra categoría o búsqueda.
            </Alert>
          )}
          <div className="service-grid">
            {services.map((s) => (
              <article className="service" key={s.id}>
                <img src={`/img/${images[s.category]}`} alt="" loading="lazy" />
                <div className="service-content">
                  <h2>
                    <Link to={`/servicio/${s.id}`}>{s.name}</Link>
                  </h2>
                  <p>{s.description}</p>
                  <p className="service-meta">
                    {s.duration} min · {s.modality}
                  </p>
                  <div className="service-price">
                    <strong>{money(s.price)}</strong>
                    <Button
                      variant="success"
                      onClick={() => add(s)}
                      aria-label={`Agregar ${s.name}`}
                    >
                      Agregar
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
export function Detail() {
  const { id } = useParams();
  const { catalog, add } = useApp();
  const s = catalog.services.find((s) => s.id === Number(id));
  if (!s)
    return (
      <section className="page">
        <h1>Servicio no disponible</h1>
        <Link to="/servicios">Volver al catálogo</Link>
      </section>
    );
  return (
    <section className="page detail">
      <img src={`/img/${images[s.category]}`} alt="" />
      <div>
        <Link to={`/servicios?categoria=${s.category}`}>
          Volver a {categories[s.category].toLowerCase()}
        </Link>
        <h1>{s.name}</h1>
        <p>{s.description}</p>
        <dl>
          <dt>Duración</dt>
          <dd>{s.duration} minutos</dd>
          <dt>Modalidad</dt>
          <dd>{s.modality}</dd>
          <dt>Valor</dt>
          <dd>{money(s.price)}</dd>
        </dl>
        <div className="actions">
          <Button variant="success" onClick={() => add(s)}>
            Agregar al carrito
          </Button>
          <Link
            className="btn btn-outline-success"
            to={`/reserva?servicio=${s.id}`}
          >
            Reservar una atención
          </Link>
        </div>
      </div>
    </section>
  );
}
export function Cart() {
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
            Total: {money(order.total)}. Estado: pendiente. No se ha realizado
            un cobro.
          </p>
          <Link to="/cuenta">Consultar mi pedido</Link>
        </Alert>
      )}
      {items.length === 0 ? (
        <div className="empty-state">
          <h2>Tu carrito está vacío</h2>
          <p>Explora los servicios y agrega los que te interesan.</p>
          <Link to="/servicios" className="btn btn-success">
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
            <Link to="/servicios">Seguir eligiendo servicios</Link>
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
