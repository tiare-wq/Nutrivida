# Frontend NutriVida · Fase 3

React 19 + Vite a partir de la fase 2.

```text
npm ci
npm run dev        # http://localhost:5173
npm run lint
npm run build
npm test
```

El proxy de `vite.config.js` envía `/api/admin` al puerto 8082 y el resto de `/api` al 8081; en contenedores lo hace `nginx.conf`. Toda comunicación con el backend pasa por `src/api/usuarios.js`; la sesión y las rutas protegidas están en `src/components/Sesion.jsx` y `src/context/sesion.js`.

| Carpeta | Contenido |
| --- | --- |
| `src/pages/usuarios` | Registro, acceso, perfil, mis medidas y administración de pacientes |
| `src/pages/profesionales` | Atención de pacientes (búsqueda, informe, medidas, edición) |
| `src/pages/administracion` | Profesionales y asignaciones |
| `src/pages/accesoPublico`, `src/pages/accesoPrivado`, `src/data` | Pantallas de la fase 2 que siguen usando almacenamiento local |

No incluir claves ni contraseñas en el frontend. Las pruebas de esta fase tienen sufijo `.fase3.test`.
