# ETAPA 1: Compilación (Necesita el JDK completo y las herramientas de construcción)
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /nutrivida/backend/ms-planes

# Copias obligatorias para descargar dependencias y compilar
COPY pom.xml .
COPY src ./src

# Se ejecuta la compilación que genera el .jar
RUN mvn clean package -DskipTests

# ETAPA 2: Imagen final optimizada (Solo el JRE para ejecución)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /nutrivida/backend/ms-planes

# COPY OBLIGATORIO DE ESTA ETAPA: Copiar el .jar generado en la etapa anterior
COPY --from=build /nutrivida/backend/ms-planes/target/*.jar /nutrivida/backend/ms-planes.jar

ENTRYPOINT ["java", "-jar", "/nutrivida/backend/ms-planes.jar"]