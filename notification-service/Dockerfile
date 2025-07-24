# Use a multi-stage build for efficiency
# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build the JAR file
RUN mvn clean package -DskipTests

# Stage 2: Create the final image
FROM eclipse-temurin:17-jre-focal
# Set the timezone if your app needs it (e.g., for time-sensitive operations/logs)
ENV TZ=Asia/Kolkata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app
# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar
# Expose the port your Spring Boot app runs on
EXPOSE 8082
# Adjust this port for each service if they use different ports

# Command to run the application
ENTRYPOINT ["java","-jar","app.jar"]