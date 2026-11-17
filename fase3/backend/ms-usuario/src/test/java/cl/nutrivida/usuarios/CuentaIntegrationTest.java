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
import tools.jackson.databind.ObjectMapper;

@SpringBootTest(
    properties = {
        "app.jwt-secret=clave-de-pruebas-solamente-12345678901234567890",
        "spring.datasource.url=jdbc:h2:mem:cuenta;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "ADMIN_EMAIL=admin@nutrivida.cl",
        "ADMIN_PASSWORD=ClaveInicial123",
        "CARGAR_DATOS_INICIALES=true",
    }
)
@ActiveProfiles("test")
@AutoConfigureMockMvc
class CuentaIntegrationTest {

    private static final String CLAVE = "ClaveInicial123";

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper json;

    private String cuerpoLogin(String correo, String clave) throws Exception {
        return json.writeValueAsString(Map.of("correo", correo, "password", clave));
    }

    private String login(String correo) throws Exception {
        var respuesta = mvc
            .perform(
                post("/api/auth/login")
                    .contentType("application/json")
                    .content(cuerpoLogin(correo, CLAVE))
            )
            .andExpect(status().isOk())
            .andReturn()
            .getResponse();
        return (
            "Bearer " + json.readTree(respuesta.getContentAsString()).get("accessToken").asString()
        );
    }

    private long idPaciente(String token, String nombre) throws Exception {
        var respuesta = mvc
            .perform(
                get("/api/profesionales/pacientes")
                    .param("buscar", nombre)
                    .header("Authorization", token)
            )
            .andExpect(status().isOk())
            .andReturn()
            .getResponse();
        return json.readTree(respuesta.getContentAsString()).get(0).get("id").asLong();
    }

    private long idMedicion(String token, long pacienteId) throws Exception {
        var respuesta = mvc
            .perform(
                get("/api/profesionales/pacientes/" + pacienteId + "/mediciones").header(
                    "Authorization",
                    token
                )
            )
            .andExpect(status().isOk())
            .andReturn()
            .getResponse();
        return json.readTree(respuesta.getContentAsString()).get(0).get("id").asLong();
    }

    private String medida(String peso) throws Exception {
        return json.writeValueAsString(
            Map.of(
                "fecha",
                LocalDate.now().toString(),
                "estaturaCm",
                178,
                "pesoKg",
                new java.math.BigDecimal(peso),
                "cinturaCm",
                116,
                "caderaCm",
                122
            )
        );
    }

    @Test
    void profesionalEditaYEliminaMedicionesDeSuPacienteYNoLasAjenas() throws Exception {
        String valentina = login("valentina.rojas@nutrivida.cl");
        String matias = login("matias.fuentes@nutrivida.cl");
        long estebanId = idPaciente(valentina, "Esteban");
        long medicionId = idMedicion(valentina, estebanId);
        String ruta = "/api/profesionales/pacientes/" + estebanId + "/mediciones/" + medicionId;

        mvc.perform(
            put(ruta)
                .header("Authorization", matias)
                .contentType("application/json")
                .content(medida("127.50"))
        ).andExpect(status().isForbidden());
        mvc.perform(delete(ruta).header("Authorization", matias)).andExpect(status().isForbidden());

        mvc.perform(
            put(ruta)
                .header("Authorization", valentina)
                .contentType("application/json")
                .content(medida("127.50"))
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.pesoKg").value(127.5));
        mvc.perform(
            put(ruta)
                .header("Authorization", valentina)
                .contentType("application/json")
                .content(medida("-1"))
        ).andExpect(status().isBadRequest());
        mvc.perform(
            put("/api/profesionales/pacientes/" + estebanId + "/mediciones/999999")
                .header("Authorization", valentina)
                .contentType("application/json")
                .content(medida("127.50"))
        ).andExpect(status().isNotFound());

        mvc.perform(delete(ruta).header("Authorization", valentina)).andExpect(
            status().isNoContent()
        );
        mvc.perform(
            get("/api/profesionales/pacientes/" + estebanId).header("Authorization", valentina)
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.mediciones.length()").value(0));
    }

    @Test
    void cambiarPasswordExigeLaActualCierraLasSesionesAnterioresYAceptaLaNueva() throws Exception {
        String token = login("juan.lopez@nutrivida.cl");
        String cuerpoMala = json.writeValueAsString(
            Map.of("actual", "ClaveEquivocada1", "nueva", "NuevaClave456")
        );
        mvc.perform(
            put("/api/cuenta/password")
                .header("Authorization", token)
                .contentType("application/json")
                .content(cuerpoMala)
        ).andExpect(status().isBadRequest());

        String cuerpoDebil = json.writeValueAsString(
            Map.of("actual", CLAVE, "nueva", "soloLetras")
        );
        mvc.perform(
            put("/api/cuenta/password")
                .header("Authorization", token)
                .contentType("application/json")
                .content(cuerpoDebil)
        ).andExpect(status().isBadRequest());

        String cuerpo = json.writeValueAsString(Map.of("actual", CLAVE, "nueva", "NuevaClave456"));
        mvc.perform(
            put("/api/cuenta/password")
                .header("Authorization", token)
                .contentType("application/json")
                .content(cuerpo)
        ).andExpect(status().isNoContent());

        mvc.perform(get("/api/pacientes/me").header("Authorization", token)).andExpect(
            status().isUnauthorized()
        );
        mvc.perform(
            post("/api/auth/login")
                .contentType("application/json")
                .content(cuerpoLogin("juan.lopez@nutrivida.cl", CLAVE))
        ).andExpect(status().isUnauthorized());
        mvc.perform(
            post("/api/auth/login")
                .contentType("application/json")
                .content(cuerpoLogin("juan.lopez@nutrivida.cl", "NuevaClave456"))
        ).andExpect(status().isOk());
    }

    @Test
    void soloAdministracionRestableceLaPasswordDeOtraCuenta() throws Exception {
        String admin = login("admin@nutrivida.cl");
        String valentina = login("valentina.rojas@nutrivida.cl");
        String camilo = login("camilo.calderon@nutrivida.cl");
        long camiloId = idPaciente(login("matias.fuentes@nutrivida.cl"), "Camilo");
        String cuerpo = json.writeValueAsString(Map.of("nueva", "Restablecida789"));
        String ruta = "/api/admin/usuarios/" + camiloId + "/password";

        mvc.perform(
            put(ruta)
                .header("Authorization", valentina)
                .contentType("application/json")
                .content(cuerpo)
        ).andExpect(status().isForbidden());
        mvc.perform(
            put(ruta).header("Authorization", admin).contentType("application/json").content(cuerpo)
        ).andExpect(status().isNoContent());

        mvc.perform(get("/api/pacientes/me").header("Authorization", camilo)).andExpect(
            status().isUnauthorized()
        );
        mvc.perform(
            post("/api/auth/login")
                .contentType("application/json")
                .content(cuerpoLogin("camilo.calderon@nutrivida.cl", "Restablecida789"))
        ).andExpect(status().isOk());
    }

    @Test
    void despuesDeCincoIntentosFallidosElLoginSeBloquea() throws Exception {
        String correo = "intruso@nutrivida.cl";
        for (int i = 0; i < 5; i++) {
            mvc.perform(
                post("/api/auth/login")
                    .contentType("application/json")
                    .content(cuerpoLogin(correo, "ClaveIncorrecta1"))
            ).andExpect(status().isUnauthorized());
        }
        mvc.perform(
            post("/api/auth/login")
                .contentType("application/json")
                .content(cuerpoLogin(correo, "ClaveIncorrecta1"))
        ).andExpect(status().isTooManyRequests());
    }
}
