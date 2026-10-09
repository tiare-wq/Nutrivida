import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminServicios from './pages/admin/AdminServicios'
import Inicio from './pages/Inicio'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Planes from './pages/Planes'

function App() {
  return (
    <BrowserRouter>
      <header>
        <div class="head-header"> 
            <div>
                <h1>NutriVida 🍃</h1>
            </div>

            <nav class="nav-main">
              <a className='btn-nutrivida'>
                <img src="../img/carrito.png" alt="Carrito" />
              </a>

              <a id="btn-login" className="justify-content-center btn-nutrivida" href="/login">
                  <img src="../img/usuarioIcono2.webp" alt="Iniciar sesión" />
                  <span>Iniciar sesión</span>
              </a>
            </nav>
            
        </div>
      </header>

      <Navbar />

      <Routes>
        <Route path="/admin-servicios" element={<AdminServicios />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/planes" element={<Planes />} />
      </Routes>

      <footer>
        <p>Nutrivida © 2026 Nutrivida SpA</p>
      </footer>

    </BrowserRouter>
  )
}
export default App
