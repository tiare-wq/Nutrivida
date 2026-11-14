# NutriVida

Aplicación web desarrollada con **React y JavaScript**, con pruebas automatizadas realizadas mediante **Vitest**.

NutriVida es una plataforma que simula el funcionamiento de una clínica de nutrición, orientada principalmente a un público adulto y adulto joven. Su propósito es facilitar el acceso y la gestión de servicios relacionados con la salud nutricional, incluyendo consultas, evaluaciones, planes de alimentación y talleres grupales.

## Funcionalidades principales

- Consulta de atenciones y servicios disponibles.
- Reserva de horas.
- Compra de planes y servicios.
- **Perfil de cliente:** edición de datos personales, consulta de reservas e historial de compras.
- **Perfil de administrador:** gestión del catálogo de planes y servicios.
- Autenticación de usuarios y protección de rutas según el acceso correspondiente.

## Desarrollo del proyecto

### Fase 1: Implementación inicial

Primera versión de la aplicación desarrollada utilizando **HTML, CSS y JavaScript**. Se implementó una interfaz de usuario con las funcionalidades básicas y las principales vistas del sistema:

- Inicio.
- Servicios.
- Reserva.
- Inicio de sesión.

### Fase 2: Migración a React

En esta etapa se realizó una segunda implementación utilizando **React**, incorporando una arquitectura basada en componentes para organizar y reutilizar los elementos de la interfaz.

Se utilizaron diferentes herramientas y funcionalidades de React, entre ellas:

- `useState` y `useEffect` para la gestión del estado y los efectos secundarios.
- React Router mediante `BrowserRouter`, `Navigate`, `Outlet` y `useLocation` para gestionar la navegación, las rutas protegidas y el acceso a las distintas vistas.

Para la persistencia de información se implementó **localStorage**, permitiendo conservar los datos de la aplicación entre sesiones del navegador. Sin embargo, esta solución presenta limitaciones en cuanto a la centralización y sincronización de la información entre distintos dispositivos.

### Fase 3: Proyección de mejoras

Como siguiente etapa, se contempla implementar una conexión con una base de datos **PostgreSQL**, incorporando una arquitectura con almacenamiento centralizado y persistencia en servidor.

Esta mejora permitirá gestionar la información de manera más consistente y ofrecer una experiencia personalizada, con acceso a los datos del usuario desde distintos dispositivos.
Inclusive, utilizaremos SpringBoot para backend y microservicios

## Pruebas automatizadas

Se implementaron pruebas utilizando **Vitest** para verificar el comportamiento de los distintos módulos y componentes de la aplicación.

Se desarrollaron un total de **80 tests distribuidos en 8 archivos de prueba (JS y JSX)**.
