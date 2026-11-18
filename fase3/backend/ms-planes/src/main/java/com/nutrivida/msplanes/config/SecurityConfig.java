
package com.nutrivida.msplanes.config;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public JwtDecoder jwtDecoder(
            @Value("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9") String secret) {

        if (secret.length() < 32) {
            throw new IllegalStateException(
                "JWT_SECRET debe contener al menos 32 caracteres"
            );
        }

        var decoder = NimbusJwtDecoder.withSecretKey(
            new SecretKeySpec(
                secret.getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
            )
        )
        .macAlgorithm(MacAlgorithm.HS256)
        .build();

        decoder.setJwtValidator(
            JwtValidators.createDefaultWithIssuer("nutrivida-usuarios")
        );

        return decoder;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        var roles = new JwtGrantedAuthoritiesConverter();
        roles.setAuthoritiesClaimName("roles");
        roles.setAuthorityPrefix("ROLE_");

        var converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(roles);

        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )
            .authorizeHttpRequests(auth -> auth

                // Consultas públicas
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/v1/planes",
                    "/api/v1/planes/**"
                ).permitAll()

                // Administración de planes
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/v1/planes"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/v1/planes/**"
                ).hasRole("ADMIN")

                // Cualquier otra operación
                .anyRequest().denyAll()
            )
            .oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwt ->
                    jwt.jwtAuthenticationConverter(converter)
                )
            )
            .build();
    }
}
