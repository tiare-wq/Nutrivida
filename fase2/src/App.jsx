import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { Navbar, Nav, Container, Button, Alert } from "react-bootstrap";
import { Provider, useApp } from "./context";
import { Home, Catalog, Detail, Cart } from "./pages/Shop";
import Auth from "./pages/Auth";
import Reservation from "./pages/Reservation";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
function Guard({ children, admin = false }) {
  const { user } = useApp();
  const location = useLocation();
  if (!user)
    return (
      <Navigate
        to={
          "/login?next=" +
          encodeURIComponent(location.pathname + location.search)
        }
        replace
      />
    );
  if (admin && user.role !== "admin")
    return <Navigate to="/cuenta" replace />;
  return children;
}
function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
function Shell() {
  const { user, items, notice, setNotice, logout, loading, error, refresh } =
    useApp();
  return (
    <>
      <ScrollTop />
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Navbar expand="lg" className="site-nav">
        <Container>
          <Navbar.Brand as={Link} to="/">
            NutriVida{" "}
            <span className="brand-leaf" aria-hidden="true">
              🍃
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/" end>
                Inicio
              </Nav.Link>
              <Nav.Link as={NavLink} to="/servicios">
                Servicios
              </Nav.Link>
              <Nav.Link as={NavLink} to="/reserva">
                Reservar
              </Nav.Link>
              {user?.role === "admin" && (
                <Nav.Link as={NavLink} to="/admin">
                  Administración
                </Nav.Link>
              )}
            </Nav>
            <Nav>
              <Nav.Link as={NavLink} to="/carrito" className="cart-nav">
                Carrito{" "}
                <span className="cart-badge">
                  {items.reduce((n, i) => n + i.quantity, 0)}
                </span>
              </Nav.Link>
              {user ? (
                <>
                  <Nav.Link as={NavLink} to="/cuenta">
                    Mi cuenta
                  </Nav.Link>
                  <Button variant="outline-success" size="sm" onClick={logout}>
                    Salir
                  </Button>
                </>
              ) : (
                <Nav.Link as={NavLink} to="/login">
                  Ingresar
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="site-notice" role="status">
        {notice && (
          <>
            <span>{notice}</span>
            <button aria-label="Cerrar aviso" onClick={() => setNotice("")}>
              ×
            </button>
          </>
        )}
      </div>
      <main id="contenido" tabIndex="-1">
        {loading ? (
          <section className="page">
            <p role="status">Cargando NutriVida…</p>
          </section>
        ) : error ? (
          <section className="page">
            <h1>No pudimos cargar NutriVida</h1>
            <Alert variant="danger">{error}</Alert>
            <Button variant="success" onClick={refresh}>
              Reintentar
            </Button>
          </section>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inicio" element={<Navigate to="/" replace />} />
            <Route path="/servicios" element={<Catalog />} />
            <Route
              path="/planes"
              element={<Navigate to="/servicios?categoria=plan" replace />}
            />
            <Route path="/servicio/:id" element={<Detail />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/login" element={<Auth />} />
            <Route
              path="/registro"
              element={<Auth key="registro" registerMode />}
            />
            <Route path="/reserva" element={<Reservation />} />
            <Route
              path="/cuenta"
              element={
                <Guard>
                  <Account />
                </Guard>
              }
            />
            <Route
              path="/admin"
              element={
                <Guard admin>
                  <Admin />
                </Guard>
              }
            />
            <Route
              path="*"
              element={
                <section className="page">
                  <h1>Esta página no existe</h1>
                  <Link to="/">Volver al inicio</Link>
                </section>
              }
            />
          </Routes>
        )}
      </main>
      <footer className="site-footer">
        <Container>
          <div>
            <Link to="/" className="footer-brand">
              NutriVida
            </Link>
            <p>Nutrición y bienestar, a tu medida.</p>
          </div>
          <div>
            <Link to="/servicios">Servicios</Link>
            <Link to="/reserva">Reservar una atención</Link>
            <Link to="/cuenta">Mi cuenta</Link>
          </div>
          <p>
            NutriVida © 2026
            <br />
            Proyecto académico · Sin cobros en línea
          </p>
        </Container>
      </footer>
    </>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Provider>
        <Shell />
      </Provider>
    </BrowserRouter>
  );
}
