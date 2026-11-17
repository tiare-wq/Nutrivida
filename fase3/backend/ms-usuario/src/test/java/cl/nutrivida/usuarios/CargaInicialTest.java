package cl.nutrivida.usuarios;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest(
    properties = {
        "app.jwt-secret=clave-de-pruebas-solamente-12345678901234567890",
        "spring.datasource.url=jdbc:h2:mem:carga;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "ADMIN_EMAIL=admin@nutrivida.cl",
        "ADMIN_PASSWORD=ClaveInicial123",
        "CLAVE_INICIAL_VALENTINA=ClaveValentina123",
        "CLAVE_INICIAL_MATIAS=ClaveMatias123",
        "CLAVE_INICIAL_ESTEBAN=ClaveEsteban123",
        "CLAVE_INICIAL_JUAN=ClaveJuan123",
        "CLAVE_INICIAL_CAMILO=ClaveCamilo123",
        "CARGAR_DATOS_INICIALES=true",
    }
)
@ActiveProfiles("test")
@AutoConfigureMockMvc
class CargaInicialTest {

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

    private long idPaciente(String token, String nombre) throws Exception {
        var response = mvc
            .perform(
                get("/api/profesionales/pacientes")
                    .param("buscar", nombre)
                    .header("Authorization", token)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(1))
            .andReturn()
            .getResponse();
        return json.readTree(response.getContentAsString()).get(0).get("id").asLong();
    }

    @Test
    void cadaProfesionalVeSoloSusPacientesYEstebanTiene129Kilos() throws Exception {
        String valentina = login("valentina.rojas@nutrivida.cl", "ClaveValentina123");
        String matias = login("matias.fuentes@nutrivida.cl", "ClaveMatias123");

        mvc.perform(get("/api/profesionales/pacientes").header("Authorization", valentina))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(2));
        mvc.perform(get("/api/profesionales/pacientes").header("Authorization", matias))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].correo").value("camilo.calderon@nutrivida.cl"));

        long camiloId = idPaciente(matias, "Camilo");
        mvc.perform(
            get("/api/profesionales/pacientes/" + camiloId).header("Authorization", valentina)
        ).andExpect(status().isForbidden());
        mvc.perform(get("/api/profesionales/pacientes/" + camiloId).header("Authorization", matias))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.mediciones.length()").value(3));

        mvc.perform(
            get("/api/pacientes/me/informe").header(
                "Authorization",
                login("esteban.zavala@nutrivida.cl", "ClaveEsteban123")
            )
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.mediciones[0].pesoKg").value(129.0))
            .andExpect(jsonPath("$.profesional.nombre").value("Valentina Rojas"));
    }
}
