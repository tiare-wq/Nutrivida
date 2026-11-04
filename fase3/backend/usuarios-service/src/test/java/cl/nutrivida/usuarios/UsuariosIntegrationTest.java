package cl.nutrivida.usuarios;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cl.nutrivida.usuarios.repository.Usuarios;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest(
    properties = {
        "app.jwt-secret=clave-de-pruebas-solamente-12345678901234567890",
        "spring.datasource.url=jdbc:h2:mem:test;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "ADMIN_EMAIL=admin@test.cl",
        "ADMIN_PASSWORD=AdminPrueba123",
    }
)
@org.springframework.test.context.ActiveProfiles("test")
@AutoConfigureMockMvc
class UsuariosIntegrationTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper json;

    @Autowired
    Usuarios usuarios;

    String registro = """
    {"nombre":"Esteban Zavala","rut":"12.345.678-5","fechaNac":"2000-01-01","telefono":"912345678","correo":"paciente@test.cl","password":"Paciente123"}
    """;

    String token(String correo, String password) throws Exception {
        String body = mvc
            .perform(
                post("/api/auth/login")
                    .contentType("application/json")
                    .content(
                        json.writeValueAsString(
                            java.util.Map.of("correo", correo, "password", password)
                        )
                    )
            )
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
        return json.readTree(body).get("accessToken").asString();
    }

    @SuppressWarnings("null")
    @Test
    void flujoCompletoYSeguridad() throws Exception {
        var creado = mvc
            .perform(post("/api/auth/registro").contentType("application/json").content(registro))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.usuario.rol").value("PACIENTE"))
            .andExpect(jsonPath("$.usuario.password").doesNotExist())
            .andExpect(jsonPath("$.usuario.passwordHash").doesNotExist())
            .andReturn()
            .getResponse();
        String access = json.readTree(creado.getContentAsString()).get("accessToken").asString();
        var cookie = creado.getCookie("nv_refresh");
        assertNotNull(cookie);
        assertTrue(cookie.isHttpOnly());
        assertTrue(creado.getHeader("Set-Cookie").contains("SameSite=Strict"));
        String auth = "Bearer " + access;
        mvc.perform(get("/api/pacientes/me")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/pacientes/me").header("Authorization", auth))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.correo").value("paciente@test.cl"));
        mvc.perform(get("/api/admin/pacientes").header("Authorization", auth)).andExpect(
            status().isForbidden()
        );
        mvc.perform(
            post("/api/auth/registro").contentType("application/json").content(registro)
        ).andExpect(status().isConflict());
        mvc.perform(
            post("/api/auth/login")
                .contentType("application/json")
                .content("{\"correo\":\"paciente@test.cl\",\"password\":\"mala\"}")
        ).andExpect(status().isUnauthorized());
        mvc.perform(
            put("/api/pacientes/me")
                .header("Authorization", auth)
                .contentType("application/json")
                .content(registro.replace("Esteban Zavala", "Esteban Zavala Soto"))
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.nombre").value("Esteban Zavala Soto"));
        assertTrue(
            usuarios.findByCorreo("paciente@test.cl").orElseThrow().passwordHash.startsWith("$2a$")
        );
        var renovada = mvc
            .perform(post("/api/auth/refresh").cookie(cookie))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse();
        mvc.perform(post("/api/auth/refresh").cookie(cookie)).andExpect(status().isUnauthorized());
        mvc.perform(post("/api/auth/logout").cookie(renovada.getCookie("nv_refresh"))).andExpect(
            status().isNoContent()
        );
        mvc.perform(get("/api/pacientes/me").header("Authorization", auth)).andExpect(
            status().isUnauthorized()
        );
        mvc.perform(post("/api/auth/refresh").cookie(renovada.getCookie("nv_refresh"))).andExpect(
            status().isUnauthorized()
        );
        String admin = "Bearer " + token("admin@test.cl", "AdminPrueba123");
        mvc.perform(get("/api/admin/pacientes").header("Authorization", admin)).andExpect(
            status().isOk()
        );
        long id = usuarios.findByCorreo("paciente@test.cl").orElseThrow().id;
        mvc.perform(
            patch("/api/admin/usuarios/" + id + "/permisos")
                .header("Authorization", admin)
                .contentType("application/json")
                .content("{\"rol\":\"PACIENTE\",\"activo\":false}")
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.activo").value(false));
        mvc.perform(
            post("/api/auth/login")
                .contentType("application/json")
                .content("{\"correo\":\"paciente@test.cl\",\"password\":\"Paciente123\"}")
        ).andExpect(status().isUnauthorized());
        mvc.perform(
            patch("/api/admin/usuarios/" + id + "/permisos")
                .header("Authorization", admin)
                .contentType("application/json")
                .content("{\"rol\":\"ADMIN\",\"activo\":true}")
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.rol").value("ADMIN"));
        mvc.perform(
            get("/api/admin/usuarios").header(
                "Authorization",
                "Bearer " + token("paciente@test.cl", "Paciente123")
            )
        ).andExpect(status().isOk());
        mvc.perform(
            patch("/api/admin/usuarios/" + id + "/permisos")
                .header("Authorization", admin)
                .contentType("application/json")
                .content("{\"rol\":\"PACIENTE\",\"activo\":true}")
        ).andExpect(status().isOk());
        long adminId = usuarios.findByCorreo("admin@test.cl").orElseThrow().id;
        mvc.perform(
            patch("/api/admin/usuarios/" + adminId + "/permisos")
                .header("Authorization", admin)
                .contentType("application/json")
                .content("{\"rol\":\"PACIENTE\",\"activo\":false}")
        ).andExpect(status().isConflict());
        mvc.perform(delete("/api/admin/pacientes/" + id).header("Authorization", admin)).andExpect(
            status().isNoContent()
        );
        mvc.perform(get("/api/admin/pacientes/" + id).header("Authorization", admin)).andExpect(
            status().isNotFound()
        );
    }

    @Test
    void validacionesYSwagger() throws Exception {
        mvc.perform(
            post("/api/auth/registro")
                .contentType("application/json")
                .content(registro.replace("12.345.678-5", "12.345.678-9"))
        ).andExpect(status().isBadRequest());
        mvc.perform(
            post("/api/auth/registro")
                .contentType("application/json")
                .content(registro.replace("2000-01-01", "2020-01-01"))
        ).andExpect(status().isBadRequest());
        mvc.perform(
            post("/api/auth/registro")
                .contentType("application/json")
                .content(registro.replace("912345678", "123"))
        ).andExpect(status().isBadRequest());
        mvc.perform(
            post("/api/auth/registro")
                .contentType("application/json")
                .content(registro.replace("Paciente123", "sinNumeros"))
        ).andExpect(status().isBadRequest());
        mvc.perform(
            get("/api/pacientes/me").header("Authorization", "Bearer token-falso")
        ).andExpect(status().isUnauthorized());
        mvc.perform(get("/v3/api-docs"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.paths['/api/pacientes/me']").exists());
    }
}
