import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './css/styles.css';
import './css/private.css';
import './css/perfil.css';
import './css/servicios.css';
import './css/formulario.css';
import './css/calendario.css';
import './css/login.css';
import './css/confirmacion.css'
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
