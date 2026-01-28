FROM maven:3.9.12-eclipse-temurin-17-alpine AS builder
WORKDIR  /app

COPY  pom.xml .
RUN  mvn dependency:go-offline -B

COPY  src ./src

RUN  mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk-alpine
LABEL maintainer="letsplay@example.com"
RUN addgroup -S spring && adduser -S spring -G spring

WORKDIR /app

COPY --from=builder /app/target/*.jar  app.jar  
RUN  chown -R spring:spring /app


USER  spring:spring
EXPOSE  8083


HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --spider http://localhost:8083/actuator/health || exit 1
  
ENV JAVA_OPTS="-Xmx512m -Xms256m"

ENTRYPOINT [ "java" , "-jar", "app.jar" ]
