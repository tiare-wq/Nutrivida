# Verificación del ZIP recibido — 3 de noviembre de 2026

Origen: fase3-completa.zip. Revisado en copia independiente, sin sobrescribir la versión anterior.

## Resultado comprobado

- Maven verify: compilación y empaquetado correctos; 14 pruebas Java, cero fallos y cero errores (10 usuarios y 4 administración).
- Frontend: instalación, lint y compilación aprobados; 15 pruebas Vitest aprobadas.
- Formato: Prettier aprobado para todos los archivos incluidos en format:check.
- PostgreSQL 17 real: dos microservicios ejecutados en puertos aislados 18081/18082 con una base exclusiva de revisión. Se verificaron tres roles, comunicación entre servicios, pacientes asignados, denegación 403 a pacientes ajenos, creación/edición/eliminación de medidas, cambio de contraseña y bloqueo 429 después de cinco fallos.
- Swagger disponible en ambos servicios; usuarios expone 34 operaciones.

## Correcciones aplicadas

Rutas de tres imágenes CSS cambiadas a /img/... para que funcionen desde las rutas de la aplicación y no generen advertencias de compilación. Se aplicó el formato acordado a seis archivos Java y JSX.

## Pendientes que impiden declarar entrega completa

1. Anexos 2 y 4 conservan recuadros «Insertar captura». Se inspeccionó su estructura y texto; no se hizo revisión visual página por página en esta comprobación. Falta incorporar capturas actuales y revisar la presentación final.
2. El informe VERIFICACION.md y el checklist originales contienen cifras antiguas o contradictorias; este informe registra los resultados realmente ejecutados. Deben actualizarse también las versiones Word antes de entregar.
3. La pauta solicita enlaces públicos de GitHub para frontend y backend, además de sus comprimidos separados. No se publicaron repositorios ni se comprobaron enlaces en esta revisión.
4. Catálogo, reservas, carrito y planes conservan almacenamiento del navegador: el backend comprobado cubre usuarios, pacientes, administración, profesionales y medidas. El equipo debe completar los demás módulos que le correspondan.
5. No se ejecutó Docker ni un recorrido completo en navegador de esta nueva versión. Las pruebas frontend usan jsdom; la integración real comprobada se hizo mediante HTTP contra PostgreSQL.
6. La presentación individual representa el 60 % de la nota. Ninguna comprobación automática garantiza 100/100.

Eureka no figura como requisito en la pauta compartida. No se agregó una API externa, de acuerdo con el alcance solicitado.

Los registros y resultados técnicos se conservan fuera del ZIP, en revision-zip-actual. El ZIP corregido excluye dependencias, compilados, registros, credenciales y archivos locales.
