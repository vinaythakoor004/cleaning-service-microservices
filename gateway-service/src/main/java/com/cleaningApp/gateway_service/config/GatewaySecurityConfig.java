package com.cleaningApp.gateway_service.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class GatewaySecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(GatewaySecurityConfig.class);
    
    @Value("${spring.security.oauth2.resourceserver.jwt.secret-key}")
    private String jwtSecret;

    private static final String COOKIE_NAME = "jwt";

    @PostConstruct
    public void logSecretInfo() {
        log.info("API-Gateway JWT Secret (raw): {}", jwtSecret);
        byte[] decoded = Base64.getDecoder().decode(jwtSecret);
        log.info("API-Gateway JWT Secret (decoded bytes length): {}", decoded.length);
    }

    /**
     * Extracts JWT from `jwt` cookie and injects into Authorization header
     */
    @Bean
    @Order(-1)
    public WebFilter jwtCookieFilter() {
        return (ServerWebExchange exchange, WebFilterChain chain) -> {
            HttpCookie cookie = exchange.getRequest().getCookies().getFirst(COOKIE_NAME);
            if (cookie != null && cookie.getValue() != null && !cookie.getValue().isEmpty()) {
                log.debug("Found JWT in cookie. Adding to Authorization header.");
                ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + cookie.getValue())
                    .build();
                return chain.filter(exchange.mutate().request(mutatedRequest).build());
            }
            log.debug("No JWT cookie found or it was empty.");
            return chain.filter(exchange);
        };
    }

    /**
     * Configure route access and JWT auth
     */
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            // Add your custom WebFilter before Spring Security's authentication filters
            .addFilterAt(jwtCookieFilter(), SecurityWebFiltersOrder.AUTHENTICATION)
            .authorizeExchange(exchange -> exchange
                .pathMatchers("/auth2/**", "/api/auth/logout").permitAll()
                .anyExchange().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
            .build();
    }

    /**
     * Configure JWT decoder using Base64 secret
     */
    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
        // Use HmacSHA256 if auth-service signs with HS256
        SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "HmacSHA256");
        return NimbusReactiveJwtDecoder.withSecretKey(secretKey).build();
    }
}