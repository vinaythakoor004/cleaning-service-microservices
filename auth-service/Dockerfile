# Stage 1: Build the application (using Maven/JDK)
# You can use a specific Maven version with JDK 17
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set the working directory inside this build stage
WORKDIR /app

# Copy the Maven project files (pom.xml) first. This helps Docker cache this layer.
# If pom.xml doesn't change, Docker can reuse the 'mvn clean install' layer.
COPY pom.xml .

# Copy the rest of your source code
COPY src ./src

# Build your Spring Boot application
# -DskipTests is often used in Docker builds to speed them up. Remove if you want tests to run.
RUN mvn clean install -DskipTests

# Stage 2: Create the final lightweight runtime image
# Use a smaller base image that only contains the JRE (Java Runtime Environment)
# or openjdk:17-jre-slim-buster for Debian-based slim
FROM eclipse-temurin:17-jre-focal

# Set the working directory for the final application
WORKDIR /app

# Copy the built JAR file from the 'build' stage into the final image
# 'auth-service-0.0.1-SNAPSHOT.jar' should match the name Maven builds
COPY --from=build /app/target/auth-service-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your Spring Boot app runs on
EXPOSE 8083

# Define the command to run your application
ENTRYPOINT ["java", "-jar", "app.jar"]