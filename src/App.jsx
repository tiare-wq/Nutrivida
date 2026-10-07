import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Inicio from './pages/Inicio'
import Planes from './pages/Planes'
import Login from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <header>
        <div class="head-header"> 
            <div>
                <h1>NutriVida 🍃</h1>
            </div>
            <a id="btn-logging" className="justify-content-center btn-nutrivida" href="logging.html">
                <img src="../img/usuarioIcono2.webp" alt="Iniciar sesión"/>
                <span>Iniciar sesión</span>
            </a>
        </div>
      </header>

      <Navbar />

      <Routes>
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/planes" element={<Planes />} />
        <Route path="/login" element={<Login />} />
      </Routes>

    </BrowserRouter>
  )
}
export default App
