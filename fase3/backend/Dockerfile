FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /build
COPY . .
RUN mvn -B package -DskipTests
FROM eclipse-temurin:25-jre
ARG SERVICE=usuarios
WORKDIR /app
COPY --from=build /build/${SERVICE}-service/target/${SERVICE}-service-1.0.0.jar app.jar
RUN mkdir data && chown -R 10001:10001 /app
USER 10001
ENTRYPOINT ["java","-jar","/app/app.jar"]
