import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Provider, useApp } from "../context";

import Guard from "./routes/Guard";
import ScrollTop from "./routes/ScrollTop";

import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";

// Páginas públicas - NutriVida
import Inicio from "./pages/publico/Inicio";
import Cart from "./pages/publico/Cart";
import Consultas from "./pages/publico/Consultas";
import Confirmacion from "./pages/publico/Confirmacion";
import Evaluaciones from "./pages/publico/Evaluaciones";
import Planes from "./pages/publico/Planes";
import Reserva from "./pages/publico/Reserva";
import Talleres from "./pages/publico/Talleres";

// Autenticación
import Auth from "./pages/publico/Auth";
import Login from "./pages/publico/Login";

// Páginas privadas
import PerfilPaciente from "./pages/privado/PerfilPaciente";
import MisReservas from "./pages/privado/MisReservas";

// Administración
import Admin from "./pages/privado/Admin";
import AdminServicios from "./pages/privado/AdminServicios";

function AppContent() {
  const { loading, error, refresh } = useApp();

  return (
    <>
      <ScrollTop />

      {loading ? (
        <section className="page">
          <p role="status">Cargando NutriVida...</p>
        </section>
      ) : error ? (
        <section className="page">
          <h1>No pudimos cargar NutriVida</h1>

          <p role="alert">{error}</p>

          <button onClick={refresh}>
            Reintentar
          </button>
        </section>
      ) : (
        <Routes>

          {/* ==================================
              RUTAS PÚBLICAS
          ================================== */}

          <Route element={<PublicLayout />}>

            {/* Inicio */}
            <Route path="/" element={<Inicio />} />
            <Route path="/inicio" element={<Inicio />} />

            {/* Planes y servicios */}
            <Route path="/servicios/consultas" element={<Consultas />} />
            <Route path="/servicios/evaluaciones" element={<Evaluaciones />} />
            <Route path="/servicios/talleres" element={<Talleres />} />
            <Route path="/servicios/planes" element={<Planes />} />

            {/* Reservas */}
            <Route path="/reserva" element={<Reserva />} />

            <Route path="/confirmacion-reserva" element={<Confirmacion />} />

            {/* Carrito */}
            <Route path="/carrito" element={<Cart />} />

            {/* Autenticación */}
            <Route path="/login" element={<Login />} />

            <Route path="/registro" element={<Auth key="registro" registerMode />} />

          </Route>


          {/* ==================================
              RUTAS PRIVADAS
          ================================== */}

          <Route element={<PrivateLayout />}>

            {/* Perfil del paciente */}
            <Route path="/perfil" element={ <Guard> <PerfilPaciente /> </Guard> } />

            {/* Reservas del usuario */}
            <Route path="/mis-reservas" element={ <Guard> <MisReservas /> </Guard> } />

            {/* Administración */}
            <Route path="/admin" element={ <Guard admin> <Admin /> </Guard> } />

            <Route path="/admin-servicios" element={ <Guard admin> <AdminServicios /> </Guard> } />

          </Route>


          {/* ==================================
              RUTA NO ENCONTRADA
          ================================== */}

          <Route path="*"
            element={
              <section className="page">
                <h1>Esta página no existe</h1>
                <Link to="/">Volver al inicio</Link>
              </section>
            }
          />

        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Provider>
        <AppContent />
      </Provider>
    </BrowserRouter>
  );
}
export default App;