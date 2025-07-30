package com.cleaning.auth_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

import com.cleaning.auth_service.service.CustomOAuth2UserService;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final OAuth2LoginSuccessHandler successHandler;
    private final CustomOAuth2UserService customOAuth2UserService;

    public SecurityConfig(OAuth2LoginSuccessHandler successHandler,
                          CustomOAuth2UserService customOAuth2UserService) {
        this.successHandler = successHandler;
        this.customOAuth2UserService = customOAuth2UserService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
            		.requestMatchers("/api/auth/status").permitAll()
                    .requestMatchers("/api/auth/logout").permitAll()
            		.anyRequest().authenticated())
            .oauth2Login(oauth -> oauth
                .userInfoEndpoint(user -> user.userService(customOAuth2UserService))
                .successHandler(successHandler)
            );

        return http.build();
    }
}
