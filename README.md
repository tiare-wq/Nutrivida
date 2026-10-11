# NutriVida — actualización del carrito y perfil

Rama de trabajo: abraham. Se conserva fase1 y se actualiza la aplicación de fase2.

## Probar en Windows

Descarga esta rama como ZIP y extrae todo su contenido. Instala Node.js 22.13 o superior y ejecuta INICIAR.cmd de la raíz. La primera ejecución necesita Internet para instalar y compilar. Abre http://127.0.0.1:4387.

## Ejecutar desde terminal

    cd fase2
    npm ci
    npm run build
    npm start

Para desarrollar: npm run server y npm run dev en dos terminales dentro de fase2. Vite usa 5187 y el servidor 4387.

## Funciones

Catálogo, carrito persistente, registro y sesión, perfil editable, pedidos, reservas e historial y administración. React Bootstrap y React Hook Form declarados en package.json. SQLite crea la base local en fase2/data. No hay usuarios predeterminados ni pagos en línea.

Crea el administrador desde fase2 con npm run admin -- tu-correo@dominio.cl. Guarda data para conservar tus usuarios y pedidos; no se sube al repositorio.

## Verificar

Dentro de fase2: npm run test:coverage y npm run test:api.

Los informes académicos de ERS, pruebas y guías se conservan en la entrega local separada. El despliegue AWS sigue pendiente.
