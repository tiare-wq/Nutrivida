import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import AdminServicios from './pages/admin/AdminServicios';
import Confirmacion from './pages/publico/Confirmacion';
import Consultas from './pages/publico/Consultas';
import Evaluaciones from './pages/publico/Evaluaciones';
import Inicio from './pages/publico/Inicio';
import Login from './pages/publico/Login';
import Planes from './pages/publico/Planes';
import Reserva from './pages/publico/Reserva';
import Talleres from './pages/publico/Talleres';

function App() {
  return (
    <BrowserRouter>
      <header>
        <div class="head-header"> 
            <div>
                <h1>NutriVida 🍃</h1>
            </div>

            <nav class="nav-main">
              <Link className='btn-nutrivida'>
                <img src="../img/carrito.png" alt="Carrito" />
              </Link>

              <Link id="btn-login" className="justify-content-center btn-nutrivida" to="/login">
                  <img src="../img/usuarioIcono2.webp" alt="Iniciar sesión" />
                  <span>Iniciar sesión</span>
              </Link>
            </nav>
            
        </div>
      </header>

      <Navbar />

      <Routes>
        <Route path="/admin-servicios" element={<AdminServicios />} />
        <Route path="/consultas" element={<Consultas />} />
        <Route path="/confirmacion-reserva" element={<Confirmacion />} />
        <Route path="/evaluaciones" element={<Evaluaciones />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/planes" element={<Planes />} />
        <Route path="/reservas" element={<Reserva />} />
        <Route path="/talleres" element={<Talleres />} />
      </Routes>

      <footer>
        <p>Nutrivida © 2026 Nutrivida SpA</p>
      </footer>

    </BrowserRouter>
  )
}
export default App
