package cl.nutrivida.usuarios;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest(
    properties = {
        "app.jwt-secret=clave-de-pruebas-solamente-12345678901234567890",
        "spring.datasource.url=jdbc:h2:mem:profesionales;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "ADMIN_EMAIL=admin@clinica.test",
        "ADMIN_PASSWORD=AdminPrueba123",
    }
)
@ActiveProfiles("test")
@AutoConfigureMockMvc
class ProfesionalesIntegrationTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper json;

    private String login(String correo, String password) throws Exception {
        var response = mvc
            .perform(
                post("/api/auth/login")
                    .contentType("application/json")
                    .content(
                        json.writeValueAsString(Map.of("correo", correo, "password", password))
                    )
            )
            .andExpect(status().isOk())
            .andReturn()
            .getResponse();
        return (
            "Bearer " + json.readTree(response.getContentAsString()).get("accessToken").asString()
        );
    }

    private JsonNode paciente(String rut, String correo) throws Exception {
        String body = json.writeValueAsString(
            Map.of(
                "nombre",
                "Esteban Zavala",
                "rut",
                rut,
                "fechaNac",
                "2000-01-01",
                "telefono",
                "912345678",
                "correo",
                correo,
                "password",
                "Paciente123"
            )
        );
        var response = mvc
            .perform(post("/api/auth/registro").contentType("application/json").content(body))
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse();
        return json.readTree(response.getContentAsString());
    }

    private long profesional(String authorization, String correo) throws Exception {
        String body = json.writeValueAsString(
            Map.of(
                "nombre",
                "Valentina Rojas",
                "especialidad",
                "Nutrición",
                "correo",
                correo,
                "password",
                "Profesional123"
            )
        );
        var response = mvc
            .perform(
                post("/api/admin/profesionales")
                    .header("Authorization", authorization)
                    .contentType("application/json")
                    .content(body)
            )
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.rol").value("PROFESIONAL"))
            .andExpect(jsonPath("$.passwordHash").doesNotExist())
            .andReturn()
            .getResponse();
        return json.readTree(response.getContentAsString()).get("id").asLong();
    }

    @Test
    void profesionalSoloAccedeAPacientesAsignadosYRegistraMediciones() throws Exception {
        JsonNode registro = paciente("12345678-5", "paciente@clinica.test");
        long pacienteId = registro.get("usuario").get("id").asLong();
        String pacienteToken = "Bearer " + registro.get("accessToken").asString();
        long otroPacienteId = paciente("22222222-2", "otro@clinica.test")
            .get("usuario")
            .get("id")
            .asLong();
        String admin = login("admin@clinica.test", "AdminPrueba123");
        long profesionalId = profesional(admin, "profesional@clinica.test");
        profesional(admin, "otro-profesional@clinica.test");
        String token = login("profesional@clinica.test", "Profesional123");
        String otroToken = login("otro-profesional@clinica.test", "Profesional123");

        mvc.perform(
            put("/api/admin/pacientes/" + pacienteId + "/profesional")
                .header("Authorization", admin)
                .contentType("application/json")
                .content("{\"profesionalId\":" + profesionalId + "}")
        ).andExpect(status().isOk());

        mvc.perform(
            get("/api/profesionales/pacientes")
                .param("buscar", String.valueOf(pacienteId))
                .header("Authorization", token)
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(1));
        mvc.perform(
            get("/api/profesionales/pacientes/" + pacienteId).header("Authorization", otroToken)
        ).andExpect(status().isForbidden());
        mvc.perform(
            get("/api/profesionales/pacientes/" + otroPacienteId).header("Authorization", token)
        ).andExpect(status().isForbidden());
        mvc.perform(
            get("/api/profesionales/pacientes/" + pacienteId).header("Authorization", admin)
        ).andExpect(status().isForbidden());
        mvc.perform(get("/api/admin/profesionales").header("Authorization", token)).andExpect(
            status().isForbidden()
        );

        String medicion = json.writeValueAsString(
            Map.of(
                "fecha",
                LocalDate.now().toString(),
                "estaturaCm",
                170.5,
                "pesoKg",
                72.4,
                "cinturaCm",
                80,
                "caderaCm",
                95
            )
        );
        mvc.perform(
            post("/api/profesionales/pacientes/" + pacienteId + "/mediciones")
                .header("Authorization", token)
                .contentType("application/json")
                .content(medicion)
        )
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.pesoKg").value(72.4));
        mvc.perform(get("/api/pacientes/me/informe").header("Authorization", pacienteToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.mediciones[0].cinturaCm").value(80))
            .andExpect(jsonPath("$.profesional.id").value(profesionalId));

        mvc.perform(
            post("/api/profesionales/pacientes/" + pacienteId + "/mediciones")
                .header("Authorization", token)
                .contentType("application/json")
                .content(medicion.replace("72.4", "-1"))
        ).andExpect(status().isBadRequest());
        mvc.perform(
            get("/api/profesionales/pacientes/" + pacienteId).header("Authorization", pacienteToken)
        ).andExpect(status().isForbidden());

        mvc.perform(
            delete("/api/admin/profesionales/" + profesionalId).header("Authorization", admin)
        ).andExpect(status().isNoContent());
        mvc.perform(get("/api/profesionales/pacientes").header("Authorization", token)).andExpect(
            status().isUnauthorized()
        );
        mvc.perform(get("/api/pacientes/me/informe").header("Authorization", pacienteToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.mediciones.length()").value(1));
        mvc.perform(
            delete("/api/admin/pacientes/" + pacienteId).header("Authorization", admin)
        ).andExpect(status().isNoContent());
    }

    @Test
    void documentacionIncluyeLosNuevosRecursos() throws Exception {
        mvc.perform(get("/v3/api-docs"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.paths['/api/pacientes/me/informe']").exists())
            .andExpect(
                jsonPath("$.paths['/api/profesionales/pacientes/{id}/mediciones']").exists()
            );
    }
}
