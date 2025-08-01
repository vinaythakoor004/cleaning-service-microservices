package com.cleaningApp.gateway_service.config; // Ensure this package name matches your project structure

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter; // Import from reactive package
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource; // Import from reactive package

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("http://frontend-app:4200", "http://localhost:4200"));

        config.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization", "Accept", "X-Requested-With")); // Include common headers
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Include OPTIONS for preflight requests

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply CORS configuration to all paths (your API routes)
        source.registerCorsConfiguration("/**", config);
        return new CorsWebFilter(source);
    }
}