# Start with an official OpenJDK image
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set working directory inside the container
WORKDIR /app

# Copy Maven wrapper and pom.xml to leverage Docker caching for dependencies
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download all dependencies (without building the project)
RUN ./mvnw dependency:go-offline -B

# Now copy the rest of the source code
COPY src ./src

# Build the project (package the JAR, skip tests)
RUN ./mvnw clean package -DskipTests -B

# Expose the port your Spring Boot app runs on
EXPOSE 8087

# Run the application
ENTRYPOINT ["java", "-jar", "target/gateway-service-0.0.1-SNAPSHOT.jar"]
