# NutriVida --- Informe de implementación · Fase 3

> **Versión:** Fase 3\
> **Proyecto:** Clínica Nutricional NutriVida\
> **Stack principal:** React, Spring Boot, Java 21 y PostgreSQL 17\
> **Estado:** backend y módulo de usuarios integrados; otros módulos del
> sitio conservan parte de su funcionamiento de la fase 2.

## 1. ¿Qué cambia en esta fase?

En las primeras versiones, NutriVida fue tomando forma como una
plataforma web para una clínica nutricional. La fase 1 permitió
construir las vistas y funcionalidades iniciales con HTML, CSS y
JavaScript. En la fase 2, la interfaz se reorganizó con React,
componentes reutilizables, navegación mediante React Router, rutas
protegidas y almacenamiento local con `localStorage`.

La fase 3 da un paso importante: incorpora un backend real y una base de
datos PostgreSQL para gestionar cuentas, pacientes, profesionales,
asignaciones y mediciones. La información de estos módulos deja de
depender del almacenamiento del navegador y pasa a administrarse desde
el servidor.

El objetivo de esta etapa es que los distintos tipos de usuario trabajen
sobre información centralizada, con operaciones REST y permisos que se
comprueban en el backend, no solamente en la interfaz.

## 2. Funcionalidades incorporadas

### Administración

La cuenta con rol `ADMIN` puede:

-   Consultar, crear, editar y eliminar pacientes.
-   Consultar, crear, editar y desactivar profesionales.
-   Asignar un profesional a cada paciente o cambiar su asignación.
-   Consultar las cuentas registradas y administrar sus permisos.
-   Cambiar el rol o estado de una cuenta, respetando las restricciones
    del sistema.
-   Restablecer la contraseña de otra cuenta.
-   Editar el nombre y cargo de las cuentas administrativas.

Al desactivar a un profesional se revocan sus sesiones y se eliminan sus
asignaciones activas. Las mediciones que ya registró se conservan.

### Profesional

La cuenta con rol `PROFESIONAL` puede:

-   Consultar su perfil y especialidad.
-   Buscar pacientes que tenga asignados, por identificador o nombre.
-   Abrir el informe de un paciente asignado.
-   Consultar y editar la información personal de sus pacientes.
-   Registrar mediciones de estatura, peso, cintura y cadera.
-   Corregir o eliminar mediciones del historial.

El acceso a las fichas no depende solo de ocultar opciones en pantalla.
El backend comprueba la asignación y rechaza con `403 Forbidden` los
intentos de consultar pacientes que pertenecen a otro profesional.

### Paciente

La cuenta con rol `PACIENTE` puede:

-   Registrarse desde el sitio.
-   Iniciar sesión y consultar su perfil.
-   Editar sus propios datos personales.
-   Consultar su informe, el profesional asignado y su historial de
    mediciones.
-   Cambiar su contraseña o eliminar su cuenta.

El registro público crea siempre una cuenta de paciente. No permite
elegir ni elevar el rol desde los datos enviados por el navegador.

## 3. Arquitectura del sistema

La fase 3 separa la interfaz, las reglas de negocio y el almacenamiento:

``` text
Navegador
   │
   ▼
Frontend React + Vite
   │  Peticiones HTTP / JSON
   ▼
Proxy de Vite o Nginx
   ├── /api/       ──► usuarios-service (Spring Boot)
   └── /api/admin/ ─► administracion-service (Spring Boot)
                            │
                            ▼
                       PostgreSQL
```

### Frontend

Se utiliza React con JavaScript y Vite. La interfaz mantiene la
navegación y las vistas del proyecto, mientras que las operaciones de
los módulos incorporados en esta fase se realizan mediante llamadas HTTP
al backend.

El archivo `src/api/usuarios.js` centraliza las solicitudes relacionadas
con usuarios. Allí se gestionan las peticiones privadas, el envío del
token de acceso y el intento de renovación de sesión cuando el servidor
responde `401`.

En desarrollo, Vite redirige las rutas de API a los servicios
correspondientes. En Docker, Nginx realiza esa misma función.

### Backend

El backend está desarrollado con Spring Boot y Java 21. Se divide en dos
servicios:

  -----------------------------------------------------------------------------
  Servicio                                   Puerto local Responsabilidad
  -------------------------- ---------------------------- ---------------------
  `usuarios-service`                               `8081` Cuentas,
                                                          autenticación,
                                                          pacientes,
                                                          profesionales,
                                                          asignaciones y
                                                          mediciones.

  `administracion-service`                         `8082` Endpoints
                                                          administrativos;
                                                          delega las
                                                          operaciones de datos
                                                          al servicio de
                                                          usuarios.
  -----------------------------------------------------------------------------

Las clases de cada servicio se organizan por responsabilidades. En
`usuarios-service` se utilizan capas como `controller`, `service`,
`repository`, `entity`, `dto`, `mapper`, `config` y `exception`. El
servicio administrativo contiene controladores, servicios, configuración
y manejo de errores; no mantiene una segunda copia de las entidades ni
repositorios.

### Base de datos

PostgreSQL almacena los datos gestionados por `usuarios-service`. Entre
las entidades principales se encuentran las cuentas de usuario, las
asignaciones entre pacientes y profesionales, y las mediciones.

La base de datos es responsabilidad del servicio de usuarios. El
frontend no se conecta directamente a PostgreSQL: todas las operaciones
pasan por las APIs.

## 4. Comunicación REST y documentación

Los servicios exponen endpoints REST que reciben y entregan información
en formato JSON. Las rutas se organizan bajo `/api/` y contemplan
operaciones para:

-   Registro, inicio y cierre de sesión y renovación de sesión.
-   Consulta y edición del perfil del paciente.
-   Consulta de perfil y pacientes asignados del profesional.
-   Registro, consulta, corrección y eliminación de mediciones.
-   Administración de pacientes, profesionales, asignaciones, cuentas y
    permisos.
-   Cambio y restablecimiento de contraseñas.
-   Comprobación del estado de los servicios.

La documentación interactiva está disponible mediante Swagger:

-   Usuarios: `http://localhost:8081/swagger-ui/index.html`
-   Administración: `http://localhost:8082/swagger-ui/index.html`

El inventario de rutas, métodos, parámetros, respuestas y requisitos de
autenticación se encuentra en `documentacion/Anexo_3_APIs.xlsx`. La
explicación de la arquitectura y de la comunicación con el frontend está
en `documentacion/Anexo_2_Integracion.docx`.

## 5. Seguridad y control de acceso

La seguridad se implementa en el servidor mediante Spring Security y
JWT. La interfaz puede adaptar los menús según el rol, pero la
autorización real se vuelve a comprobar en cada operación privada.

Los mecanismos incorporados son:

-   **Roles:** `ADMIN`, `PROFESIONAL` y `PACIENTE`.
-   **Contraseñas:** almacenamiento mediante hash BCrypt; no se
    devuelven contraseñas ni hashes en las respuestas de la API.
-   **Token de acceso:** JWT firmado con HS256, con una duración de 15
    minutos.
-   **Renovación:** cookie `HttpOnly` de renovación con duración de 7
    días. El proceso renueva el token y rota la cookie.
-   **Cierre de sesión:** revoca la sesión de renovación.
-   **Permisos por asignación:** un profesional solo puede consultar y
    modificar pacientes que tenga asignados.
-   **Protección contra intentos repetidos:** después de cinco intentos
    fallidos para un correo, el login queda bloqueado durante 15 minutos
    y responde `429`.
-   **Cambio de contraseña:** cierra las sesiones activas de la cuenta,
    por lo que el usuario debe iniciar sesión nuevamente.

Las validaciones también se realizan en el backend. Por ejemplo, el
registro comprueba el RUT, la edad mínima definida, el teléfono y la
contraseña. Las mediciones deben contener valores positivos y no pueden
tener una fecha futura.

## 6. Ejecución del proyecto

### Requisitos

Para ejecutar la modalidad local se necesita:

-   Windows 10 u 11.
-   JDK 21.
-   Maven 3.9 o compatible.
-   Node.js 24 LTS.
-   PostgreSQL en ejecución.

También se puede utilizar Docker Desktop con Docker Compose v2, sin
instalar PostgreSQL por separado.

### Opción A: ejecución local en Windows

Primero, crea el usuario y la base de datos en PostgreSQL:

``` sql
CREATE USER nutrivida WITH PASSWORD 'elige-una-clave';
CREATE DATABASE nutrivida OWNER nutrivida;
```

Desde PowerShell, ubicado en la carpeta `fase3`, ejecuta:

``` powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\Iniciar.ps1 -DatosIniciales -Abrir
```

El script solicita la contraseña de PostgreSQL y la contraseña de
administración. Con `-DatosIniciales` también carga cuentas de
demostración y mediciones iniciales. Al terminar, la aplicación queda
disponible en:

-   Frontend: `http://localhost:5173`
-   Swagger de usuarios: `http://localhost:8081/swagger-ui/index.html`
-   Swagger de administración:
    `http://localhost:8082/swagger-ui/index.html`

Para detener los servicios:

``` powershell
.\Detener.ps1
```

### Opción B: ejecución con Docker

Crea la configuración local:

``` powershell
Copy-Item .env.example .env
```

Edita `.env` y reemplaza los valores de ejemplo por contraseñas y
secretos propios. `JWT_SECRET` debe tener al menos 32 caracteres. No
compartas ni subas `.env` a Git.

Luego, desde `fase3`, ejecuta:

``` powershell
docker compose up --build -d
```

Comprueba el estado:

``` powershell
docker compose ps
docker compose logs -f
```

Abre el frontend en `http://127.0.0.1:5173`. Para detener los
contenedores sin eliminar la base de datos:

``` powershell
docker compose down
```

Compose utiliza PostgreSQL 17, dos servicios Spring Boot y un contenedor
Nginx para servir el frontend y enrutar las llamadas a las APIs. Los
datos de PostgreSQL se conservan en el volumen `usuarios-db`. No
utilices `docker compose down -v` si necesitas conservar esa
información.

## 7. Pruebas y verificaciones

La fase 3 incorpora pruebas automatizadas tanto en el backend como en el
frontend.

### Backend

Desde la carpeta `fase3`:

``` powershell
.\Verificar-Backend.ps1
```

El script selecciona Java 21 y ejecuta `mvn clean verify`. Según el
registro de verificación incluido en `documentacion/VERIFICACION.md`, la
compilación y el empaquetado de ambos servicios fueron aprobados. Se
registraron 14 pruebas Java aprobadas: 10 de usuarios y 4 de
administración.

Las pruebas utilizan H2 en memoria y cubren, entre otros puntos,
autenticación, permisos por rol, perfiles, profesionales, asignaciones,
mediciones, contraseñas y renovación de sesiones.

### Frontend

Desde `fase3/frontend`:

``` powershell
npm ci
npm run format:check
npm run lint
npm run build
npm test
```

El registro de verificación informa que el formato, el análisis estático
y la compilación fueron aprobados, junto con 16 pruebas Vitest en 3
archivos.

**Importante:** estos resultados corresponden a las comprobaciones
documentadas en `VERIFICACION.md` (4 de noviembre de 2026). Ese registro
indica expresamente que en esa revisión no se repitió el recorrido
completo en navegador ni la ejecución contra PostgreSQL. Por eso, no se
presenta esa verificación como una prueba integral de todos los
escenarios de despliegue.

## 8. Alcance actual y aspectos pendientes

La fase 3 integra con backend y PostgreSQL los módulos de cuentas,
pacientes, profesionales, asignaciones, mediciones y administración.

No todos los módulos originales de NutriVida se migraron todavía al
backend. Según el README de esta fase, el catálogo, las reservas, el
carrito y los planes mantienen el almacenamiento del navegador heredado
de la fase 2. Por lo tanto, la conexión a PostgreSQL no debe
interpretarse como una migración completa de toda la plataforma.

También hay límites de despliegue que conviene tener presentes:

-   No se implementaron Eureka ni un API Gateway independiente. El proxy
    de Vite y Nginx enrutan las solicitudes.
-   No se incluye integración con pagos ni con una API externa.
-   No se implementó el mapa ni el despliegue en AWS en esta fase.
-   Para una publicación real se debe configurar HTTPS y
    `COOKIE_SECURE=true`, además de incorporar migraciones versionadas y
    copias de seguridad.
-   Las variables secretas deben mantenerse fuera del repositorio.

Estos puntos permiten distinguir lo que ya está desarrollado de lo que
queda como mejora, sin presentar funcionalidades planificadas como si
estuvieran terminadas.

## 9. Relación con la Evaluación 3

La pauta de Evaluación 3 solicita una aplicación web que integre Spring
Boot con una base de datos, comunicación REST entre frontend y backend,
lógica de negocio, seguridad, documentación y trabajo con repositorios.

La implementación de esta fase responde a esos ejes de la siguiente
manera:

  -----------------------------------------------------------------------
  Lo que solicita la evaluación       Cómo se aborda en NutriVida
  ----------------------------------- -----------------------------------
  Backend con Spring Boot             Dos servicios Spring Boot
                                      desarrollados con Java 21.

  Base de datos relacional            PostgreSQL 17 para la información
                                      de usuarios y gestión clínica
                                      incluida en esta fase.

  Modelo de datos y persistencia      Entidades, repositorios y
                                      relaciones para cuentas,
                                      asignaciones y mediciones.

  Lógica de negocio                   Servicios para perfiles, pacientes,
                                      profesionales, asignaciones,
                                      mediciones y administración.

  API REST versionada/documentada     Endpoints REST bajo `/api/` y
                                      documentación Swagger.

  Integración con frontend            React realiza peticiones HTTP/JSON;
                                      Vite o Nginx enrutan las
                                      solicitudes.

  Autenticación y autorización        Spring Security, JWT, roles y
                                      comprobación de permisos en el
                                      backend.

  Pruebas                             Pruebas Java y Vitest; resultados
                                      registrados en `VERIFICACION.md`.

  Documentación de entrega            ERS, anexo de integración,
                                      inventario de APIs y manual de
                                      usuario.
  -----------------------------------------------------------------------

La pauta también solicita enlaces públicos de GitHub para frontend y
backend, los proyectos comprimidos por separado y una presentación
funcional con preguntas individuales. Esos elementos deben revisarse
como parte de la preparación de la entrega: el contenido de este ZIP,
por sí solo, no acredita que los repositorios públicos estén publicados
ni reemplaza la presentación.

La pauta incluye un diagrama de ejemplo con entidades de una tienda
(usuario, boleta, detalle de boleta, producto y categoría), además de
roles de administrador, vendedor y cliente. Ese ejemplo no corresponde
al dominio de una clínica nutricional. En NutriVida se utilizan los
roles y datos propios del proyecto: administración, profesional y
paciente.

## 10. Documentos incluidos

Dentro de `fase3/documentacion/` se encuentran:

  ----------------------------------------------------------------------------
  Archivo                                  Para qué sirve
  ---------------------------------------- -----------------------------------
  `Anexo_2_Integracion.docx`               Explica la arquitectura, seguridad,
                                           comunicación y endpoints
                                           principales.

  `Anexo_3_APIs.xlsx`                      Inventario de endpoints y sus
                                           características.

  `Anexo_4_Manual.docx`                    Instrucciones para instalar y
                                           utilizar el sistema según cada rol.

  `VERIFICACION.md`                        Resultados de compilación, pruebas
                                           y límites de la revisión del 4 de
                                           noviembre de 2026.

  `Incidentes_y_soluciones.pdf`            Registro de problemas de
                                           configuración y sus soluciones.

  `RESULTADO_VERIFICACION_2026-11-03.md`   Registro histórico de una revisión
                                           anterior del ZIP.
  ----------------------------------------------------------------------------

## 11. En resumen

La fase 3 transforma una parte importante de NutriVida desde una
aplicación que guardaba información en el navegador hacia una solución
conectada a un backend real y PostgreSQL. La incorporación de servicios
Spring Boot, endpoints REST, autenticación con JWT, permisos por rol y
pruebas automatizadas entrega una base más sólida para gestionar
pacientes, profesionales y sus mediciones.

El avance es concreto, pero el alcance está delimitado: todavía conviven
módulos conectados al backend con otros que conservan el almacenamiento
local de la fase 2. Dejar esa diferencia clara ayuda a entender qué está
integrado, qué se puede probar actualmente y qué queda para una
siguiente etapa.
