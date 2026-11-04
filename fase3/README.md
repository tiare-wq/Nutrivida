# NutriVida · Fase 3

Usuarios, pacientes, profesionales, medidas y administración con **React + Spring Boot + PostgreSQL**. Toma la interfaz de la fase 2 (que se conserva aparte como respaldo) y la conecta a un backend real.

## Qué incluye

| Rol | Funciones |
| --- | --- |
| Administración | Nombre, ID y cargo. CRUD de pacientes y profesionales, asignación paciente-profesional, cuentas y permisos. |
| Profesional | ID, nombre, especialidad, correo y contraseña. Busca por ID o nombre a sus pacientes asignados, ve su informe, edita su información y registra estatura, peso, cintura y cadera. |
| Paciente | Registro, perfil e informe propio con historial de medidas. |

Seguridad: contraseñas BCrypt, JWT HS256 de 15 minutos, renovación con cookie HttpOnly de 7 días, permisos por rol verificados en el servidor, cambio y restablecimiento de contraseña, y bloqueo del login (429) tras 5 intentos fallidos durante 15 minutos.

Mediciones: el profesional registra, corrige y elimina las medidas de sus pacientes asignados.

## Estructura

```text
fase3/
  backend/
    usuarios-service/          Spring Boot 8081: cuentas, profesionales, asignaciones, medidas
    administracion-service/    Spring Boot 8082: API administrativa
  frontend/                    React + Vite 5173
  documentacion/               Guía de estudio, Anexos 2, 3 y 4, VERIFICACION.md
  Iniciar.ps1 / Detener.ps1    Arranque y cierre en Windows
  compose.yaml, .env.example   Alternativa con Docker
```

Las clases Java están organizadas por capa. `usuarios-service` tiene paquetes
`controller`, `dto`, `entity`, `repository`, `service`, `config` y `exception`; por ejemplo,
`PacienteController.java` está en `usuarios-service/.../usuarios/controller/`
y `UsuariosService.java` en `usuarios-service/.../usuarios/service/`. Sus DTO
se agrupan en `Datos.java` y `DatosClinicos.java`. `administracion-service`
tiene `controller`, `service`, `config` y `exception`, ya que delega las operaciones al
servicio de usuarios y no mantiene entidades ni repositorios propios.

## Documentación (empieza aquí)

1. `documentacion/Anexo_2_Integracion.docx` · arquitectura, datos, seguridad e integración.
2. `documentacion/Anexo_3_APIs.xlsx` · inventario de endpoints.
3. `documentacion/Anexo_4_Manual.docx` · manual de uso.
4. `documentacion/Incidentes_y_soluciones.pdf` · incidencias de configuración y sus soluciones.
5. `documentacion/VERIFICACION.md` · resultados de la comprobación actual y límites.
6. `documentacion/RESULTADO_VERIFICACION_2026-11-03.md` · registro histórico de la revisión del ZIP.
7. `documentacion/evidencias/` · capturas disponibles de registro y Swagger.

## Requisitos

Java JDK 21 LTS, Maven 3.9, Node.js 24 LTS y PostgreSQL en ejecución.

Los scripts de Windows seleccionan un **JDK 21 completo** (con `java` y `javac`)
para la sesión actual. Buscan primero en `JAVA_HOME`, después en
`.local/tools/jdk-21*`, en las instalaciones de Java de `Program Files`, en
`../../herramientas` y en el `PATH`. No cambian la configuración global de Windows.

Puedes instalar [Eclipse Temurin JDK 21](https://adoptium.net/temurin/releases/?version=21)
y configurar `JAVA_HOME`, o extraer su ZIP portable de Windows en
`.local/tools/`, conservando la carpeta `jdk-21...` y su subcarpeta `bin`.
La carpeta `.local` está excluida de Git. Para seleccionar Java 21 antes de
ejecutar Maven manualmente desde esta terminal:

```powershell
. .\Configurar-Java.ps1
java --version
javac --version
```

## Abrir y ejecutar en Visual Studio Code

1. Descomprime el zip y usa **Archivo > Abrir carpeta** sobre `fase3` (la carpeta que contiene `backend`, `frontend` y `Iniciar.ps1`).
2. Acepta instalar las extensiones recomendadas (Java, Spring Boot, PowerShell, ESLint, Prettier, PostgreSQL).
3. Crea la base `nutrivida` en PostgreSQL (ver más abajo) y comprueba que el servicio esté iniciado.
4. Pulsa **Ctrl+Shift+P**, elige **Tasks: Run Task** y ejecuta **NutriVida: iniciar todo (con datos iniciales)**. Escribe las dos claves en la terminal que se abre.
5. Para verificar el código: tareas **Backend: compilar y probar** y **Frontend: pruebas**. Para cerrar: **NutriVida: detener**.

## Ejecutar en Windows

1. Crear la base (una vez):

   ```sql
   CREATE USER nutrivida WITH PASSWORD 'elige-una-clave';
   CREATE DATABASE nutrivida OWNER nutrivida;
   ```

2. En PowerShell, dentro de `fase3`:

   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File .\Iniciar.ps1 -DatosIniciales -Abrir
   ```

   El script pide la clave de PostgreSQL y la del administrador. `-DatosIniciales` crea una vez dos nutricionistas y tres pacientes con su historial de medidas; las cuentas iniciales usan la clave indicada por el script.

| Cuenta | Correo |
| --- | --- |
| Administración | `admin@nutrivida.cl` (cambiable con `-AdminEmail`) |
| Profesional | `valentina.rojas@nutrivida.cl`, `matias.fuentes@nutrivida.cl` |
| Paciente | `esteban.zavala@nutrivida.cl` (129 kg), `juan.lopez@nutrivida.cl`, `camilo.calderon@nutrivida.cl` |

- Aplicación: <http://localhost:5173>
- Swagger: <http://localhost:8081/swagger-ui/index.html> y <http://localhost:8082/swagger-ui/index.html>
- Detener: `.\Detener.ps1`

En la configuración Docker de este equipo ya se crearon estas cinco cuentas de prueba, cada una con una contraseña distinta. Las contraseñas están en el archivo local `.cuentas-prueba.txt`; no lo compartas ni lo subas a Git. La carga inicial no cambia las contraseñas ni los datos de cuentas que ya existan.

Esteban y Juan son pacientes de Valentina; Camilo, de Matías. Los datos están en `backend/usuarios-service/src/main/java/cl/nutrivida/usuarios/config/CargaInicial.java`.

## Ejecución manual

Define `JWT_SECRET` (mínimo 32 caracteres, igual en ambos servicios), `DB_URL`, `DB_USER`, `DB_PASSWORD`, `ADMIN_EMAIL` y `ADMIN_PASSWORD`; opcionalmente `CARGAR_DATOS_INICIALES=true`.

```text
cd backend
mvn clean package
java -jar usuarios-service/target/usuarios-service-1.0.0.jar
java -jar administracion-service/target/administracion-service-1.0.0.jar   (otra terminal)

cd frontend
npm ci
npm run dev                                                               (otra terminal)
```

## Docker y PostgreSQL (alternativa)

Esta modalidad ejecuta el frontend, los dos servicios Spring Boot y PostgreSQL en contenedores. No es necesario instalar PostgreSQL por separado para usar esta opción.

### Requisitos

- Docker Desktop instalado y abierto, con el motor en ejecución. En Windows, Docker Desktop debe tener habilitado el backend WSL 2.
- Docker Compose v2, incluido en Docker Desktop.

Comprueba que el motor responda:

```powershell
docker version
docker compose version
```

Si `docker version` solo muestra la sección `Client` y falla al conectar con el servidor, abre Docker Desktop y espera a que indique que el motor está iniciado antes de continuar.

### Configuración inicial

Desde PowerShell, en la carpeta `fase3`, crea la configuración local una sola vez:

```powershell
Copy-Item .env.example .env
```

Edita `.env` y sustituye los valores `REEMPLAZAR` por secretos propios. `JWT_SECRET` debe tener al menos 32 caracteres y `DB_PASSWORD` y `ADMIN_PASSWORD` no deben quedar con los valores de ejemplo. Conserva `.env` solo en tu equipo: contiene contraseñas y no se debe subir a Git ni compartir. La cuenta administrativa se crea al iniciar el servicio usando `ADMIN_EMAIL` y `ADMIN_PASSWORD`. La carga de datos de demostración se activa con `CARGAR_DATOS_INICIALES=true`; puedes dar una contraseña única a cada una de las cinco cuentas con las variables opcionales `CLAVE_INICIAL_VALENTINA`, `CLAVE_INICIAL_MATIAS`, `CLAVE_INICIAL_ESTEBAN`, `CLAVE_INICIAL_JUAN` y `CLAVE_INICIAL_CAMILO`. Si no se especifican, se usa `ADMIN_PASSWORD`.

Si un puerto ya está ocupado, cambia el puerto del lado izquierdo de la publicación en `.env`; las opciones son `USUARIOS_HOST_PORT`, `ADMIN_HOST_PORT` y `FRONTEND_HOST_PORT`. El lado derecho de cada mapeo es el puerto interno del contenedor y no se cambia.

### Qué configura Compose

- `postgres` usa la imagen oficial `postgres:17-alpine`, crea la base `nutrivida` y el usuario `nutrivida`. El backend se conecta a `postgres:5432` dentro de la red privada de Compose; PostgreSQL no publica un puerto en Windows.
- El volumen nombrado `usuarios-db` conserva la base aunque se detengan o eliminen los contenedores. `docker compose down` no borra los datos. No uses `docker compose down -v` salvo que quieras eliminar permanentemente la base y su volumen.
- El health check de PostgreSQL espera a que la base acepte conexiones antes de iniciar `usuarios`. La API administrativa llama al servicio de usuarios por la red interna de Docker.
- Nginx sirve el frontend y enruta `/api/` al servicio de usuarios y `/api/admin/` al servicio administrativo.
- Los puertos publicados se limitan a `127.0.0.1`, por lo que estos servicios quedan accesibles desde el propio equipo y no se exponen directamente a la red local.

### Iniciar, comprobar y detener

```powershell
docker compose up --build -d
docker compose ps
docker compose logs -f
```

Abre el frontend Docker en <http://127.0.0.1:5173>. Los puertos predeterminados de las API son `8081` (usuarios) y `8082` (administración); usa los valores configurados en tu `.env` si los cambiaste. Por ejemplo, si el archivo define `USUARIOS_HOST_PORT=8083` y `ADMIN_HOST_PORT=8084`, Swagger queda en <http://127.0.0.1:8083/swagger-ui/index.html> y <http://127.0.0.1:8084/swagger-ui/index.html>.

En la configuración local actual, los puertos publicados son `5173` para el frontend, `8083` para usuarios y `8084` para administración. Usa `127.0.0.1` para abrir el frontend de Docker: si hay un servidor Vite local activo, Windows puede dirigir `localhost:5173` a ese servidor en vez del contenedor.

Para detener los contenedores sin borrar la base:

```powershell
docker compose down
```

Para revisar un servicio en particular, reemplaza `usuarios` por `postgres`, `administracion` o `frontend`:

```powershell
docker compose logs -f usuarios
```

## Pruebas

Desde la raíz `fase3`, en PowerShell:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\Verificar-Backend.ps1
cd frontend
npm ci
npm run format:check
npm run lint
npm run build
npm test
```

`Verificar-Backend.ps1` selecciona Java 21 y ejecuta `mvn -f backend/pom.xml clean verify`.
También se usa en la tarea **Backend: compilar y probar** de Visual Studio Code.
Las pruebas de Java usan H2 en memoria; la ejecución normal usa PostgreSQL.

## Alcance y límites

- Catálogo, reservas, carrito y planes siguen guardándose en el navegador (fase 2).
- No hay API externa, pagos, mapas ni despliegue en AWS.
- No se implementaron Eureka ni API Gateway; el proxy de Vite o Nginx cumple la función de puerta de entrada.
- Para publicar: HTTPS y `COOKIE_SECURE=true`, migraciones versionadas en lugar de `ddl-auto=update` y copias de seguridad. No subir `.env`, `.local/` ni `node_modules`.
