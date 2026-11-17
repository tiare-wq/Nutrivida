package cl.nutrivida.administracion;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(
    properties = {
        "app.jwt-secret=clave-de-pruebas-solamente-12345678901234567890",
        "app.usuarios-url=http://localhost:59999",
    }
)
@AutoConfigureMockMvc
class AdministracionTest {

    @Autowired
    MockMvc mvc;

    String adminToken() {
        var encoder = new org.springframework.security.oauth2.jwt.NimbusJwtEncoder(
            new com.nimbusds.jose.jwk.source.ImmutableSecret<>(
                "clave-de-pruebas-solamente-12345678901234567890".getBytes(
                    java.nio.charset.StandardCharsets.UTF_8
                )
            )
        );
        var claims = org.springframework.security.oauth2.jwt.JwtClaimsSet.builder()
            .issuer("nutrivida-usuarios")
            .subject("1")
            .issuedAt(java.time.Instant.now())
            .expiresAt(java.time.Instant.now().plusSeconds(60))
            .claim("roles", java.util.List.of("ADMIN"))
            .build();
        return encoder
            .encode(
                org.springframework.security.oauth2.jwt.JwtEncoderParameters.from(
                    org.springframework.security.oauth2.jwt.JwsHeader.with(
                        org.springframework.security.oauth2.jose.jws.MacAlgorithm.HS256
                    ).build(),
                    claims
                )
            )
            .getTokenValue();
    }

    @Test
    void sinToken() throws Exception {
        mvc.perform(get("/api/admin/pacientes")).andExpect(status().isUnauthorized());
    }

    @Test
    void pacienteNoAdmin() throws Exception {
        mvc.perform(
            get("/api/admin/pacientes").with(
                jwt().authorities(new SimpleGrantedAuthority("ROLE_PACIENTE"))
            )
        ).andExpect(status().isForbidden());
    }

    @Test
    void dependenciaCaida() throws Exception {
        mvc.perform(
            get("/api/admin/pacientes").header("Authorization", "Bearer " + adminToken())
        ).andExpect(status().isServiceUnavailable());
    }

    @Test
    void swagger() throws Exception {
        mvc.perform(get("/v3/api-docs")).andExpect(status().isOk());
    }
}
