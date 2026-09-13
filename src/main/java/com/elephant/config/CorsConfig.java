package com.elephant.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/**
 * CORS configuration for the /api/** REST layer.
 * Allows requests from the React + Vite dev server at localhost:5173.
 * The Thymeleaf frontend runs on the same origin (port 8080) and does not need CORS.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow the React dev server
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",   // Vite dev server
                "http://127.0.0.1:5173"   // alternative localhost
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        config.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "X-Requested-With"
        ));

        config.setExposedHeaders(List.of("Authorization"));

        // JWT does not use cookies — credentials not needed
        config.setAllowCredentials(false);

        // Preflight cache duration (10 minutes)
        config.setMaxAge(600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Only apply to /api/** — Thymeleaf routes are same-origin and unaffected
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
