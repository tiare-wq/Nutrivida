# NutriVida — código final para subir

Esta carpeta es la raíz del proyecto React y su servidor Node/SQLite.

Requiere Node.js 22.13 o superior. Ejecuta INICIAR.cmd en Windows: la primera vez instala y compila con Internet. Abre http://127.0.0.1:4387.

También puedes ejecutar desde esta carpeta:

    npm ci
    npm run build
    npm start

Para desarrollar, abre dos terminales: npm run server y npm run dev. Vite usa 5187 y la API usa 4387.

Crea el administrador con npm run admin -- tu-correo@dominio.cl y sigue las indicaciones. No hay usuarios ni contraseñas predeterminados.

Sube el contenido de esta carpeta al repositorio. Incluye package-lock.json. No subas node_modules, dist, coverage, data, contraseñas, claves ni archivos .env. La base se crea al ejecutar; conserva data si ya tienes información.

Pruebas del código: npm run test:coverage y npm run test:api.

Consulta el README de la raíz del repositorio. Los informes académicos se entregan por separado. AWS todavía debe desplegarse en el laboratorio.
