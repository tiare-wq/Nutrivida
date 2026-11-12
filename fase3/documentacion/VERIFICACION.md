# Verificación

Fecha de la verificación base: 4 de noviembre de 2026. Revalidación del backend: 12 de noviembre de 2026.

Este informe describe la versión preparada para la rama `abraham` de
`tiare-wq/Nutrivida`. El informe del 3 de noviembre se conserva como registro
histórico; las cifras actuales son las de este documento.

## Resultados comprobados

| Comprobación | Resultado |
| --- | --- |
| Backend con JDK 21.0.13: `Verificar-Backend.ps1` (`mvn clean verify`), verificación base del 4 de noviembre | Compilación y empaquetado aprobados en ambos microservicios |
| Backend con JDK 25: `mvn -f backend/pom.xml verify` | Compilación aprobada; 14 pruebas de usuarios y 4 de administración aprobadas |
| Administración → usuarios con OpenFeign | Pruebas aprobadas, incluida la respuesta HTTP 503 cuando usuarios no está disponible |
| Pruebas Java | 14 aprobadas: 10 de usuarios y 4 de administración; cero fallos y cero errores |
| Frontend: `npm run lint` | Aprobado |
| Frontend: `npm run build` | Aprobado |
| Frontend: `npm test` | 16 pruebas aprobadas en 3 archivos |
| Formato: `npm run format:check` | Aprobado, incluidos `CargaInicial.java` y `CargaInicialTest.java` |
| Scripts Windows | `Configurar-Java.ps1` seleccionó JDK 25.0.5; `java` y `javac` 25 comprobados |
| Archivos destinados a Git | Se excluyen `.env`, `.cuentas-prueba.txt`, `.local`, dependencias y compilados |

Las pruebas del backend usan H2 en memoria. También comprueban autenticación,
permisos por rol, perfiles, profesionales, asignaciones, medidas, contraseñas,
renovación de sesiones y respuesta 503 cuando usuarios no está disponible.

## Java y versiones anteriores

El backend, las imágenes Docker y los scripts de Windows usan Java 25 LTS.
`Configurar-Java.ps1` selecciona el JDK 25 únicamente para la sesión actual;
no cambia la instalación global de Windows. `Verificar-Backend.ps1` permite
repetir la compilación y las pruebas desde la raíz de `fase3`.

La fase 2 usa JavaScript/Node.js y no depende de la versión Java del backend.
La fase 3 se incorpora como carpeta independiente; las fases anteriores
conservan su código e historial.

## Límites de esta revisión

- No se repitió el recorrido completo en navegador ni la ejecución contra PostgreSQL.
  Las comprobaciones con PostgreSQL del 3 de noviembre están descritas en el
  informe histórico.
- No se ejecutó la construcción de las imágenes Docker; sus imágenes base se
  actualizaron a Java 25.
- Los anexos Word y Excel existentes se conservan. La revisión de publicación
  comprobó texto de documentos y capturas disponibles para evitar incluir
  credenciales locales, pero no reemplaza la revisión académica de los anexos.
- Catálogo, reservas, carrito y planes conservan el alcance documentado en el README.
