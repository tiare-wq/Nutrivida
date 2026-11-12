package cl.nutrivida.reserva.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${jwt.secret}")
    private String secretBase64;

    @Bean
    public JwtDecoder jwtDecoder() {

        byte[] keyBytes = Base64.getDecoder()
            .decode(secretBase64);

        SecretKey secretKey = new SecretKeySpec(
            keyBytes,
            "HmacSHA256"
        );

        NimbusJwtDecoder decoder =
            NimbusJwtDecoder.withSecretKey(secretKey)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();

        decoder.setJwtValidator(
            JwtValidators.createDefaultWithIssuer(
                "nutrivida-usuarios"
            )
        );

        return decoder;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
        HttpSecurity http) throws Exception {

        return http
            // API sin sesiones HTTP tradicionales
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // Configuración de autorización
            .authorizeHttpRequests(auth -> auth

                // Reservas públicas para invitados
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/v1/reservas/publicas"
                ).permitAll()

                // Consultar reservas propias
                .requestMatchers(
                    "/api/v1/reservas/me/**"
                ).authenticated()

                // Cualquier otra ruta requiere autenticación
                .anyRequest().authenticated()
            )

            // Validación de JWT
            .oauth2ResourceServer(oauth ->
                oauth.jwt(Customizer.withDefaults())
            )

            .build();
    }
}
