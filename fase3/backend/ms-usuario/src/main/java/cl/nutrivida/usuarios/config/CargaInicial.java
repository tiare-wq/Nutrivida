package cl.nutrivida.usuarios.config;

import cl.nutrivida.usuarios.dto.Datos;
import cl.nutrivida.usuarios.dto.DatosClinicos;
import cl.nutrivida.usuarios.entity.Usuario;
import cl.nutrivida.usuarios.service.ClinicaService;
import cl.nutrivida.usuarios.service.UsuariosService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

/**
 * Carga las primeras fichas clínicas: dos nutricionistas, tres pacientes, sus
 * asignaciones y su historial de medidas.
 *
 * Solo se ejecuta si CARGAR_DATOS_INICIALES=true y es idempotente: un paciente
 * cuyo correo ya existe no se vuelve a crear.
 */
@Configuration
@ConditionalOnProperty(name = "CARGAR_DATOS_INICIALES", havingValue = "true")
public class CargaInicial {

    private record Nutricionista(String nombre, String especialidad, String correo) {}

    private record Medida(
        int diasAtras,
        String estaturaCm,
        String pesoKg,
        String cinturaCm,
        String caderaCm
    ) {}

    private record Ficha(
        String nombre,
        String rut,
        LocalDate nacimiento,
        String telefono,
        String correo,
        String correoNutricionista,
        List<Medida> medidas
    ) {}

    private static final List<Nutricionista> NUTRICIONISTAS = List.of(
        new Nutricionista("Valentina Rojas", "Nutrición clínica", "valentina.rojas@nutrivida.cl"),
        new Nutricionista("Matías Fuentes", "Nutrición deportiva", "matias.fuentes@nutrivida.cl")
    );

    private static final List<Ficha> FICHAS = List.of(
        new Ficha(
            "Esteban Zavala",
            "20.456.789-1",
            LocalDate.of(1998, 5, 14),
            "987654321",
            "esteban.zavala@nutrivida.cl",
            "valentina.rojas@nutrivida.cl",
            List.of(new Medida(0, "178.00", "129.00", "118.00", "124.00"))
        ),
        new Ficha(
            "Juan López",
            "18.345.678-4",
            LocalDate.of(1991, 9, 3),
            "976543210",
            "juan.lopez@nutrivida.cl",
            "valentina.rojas@nutrivida.cl",
            List.of(
                new Medida(60, "172.00", "84.50", "92.00", "101.00"),
                new Medida(30, "172.00", "82.20", "90.50", "100.00"),
                new Medida(0, "172.00", "79.80", "88.00", "99.00")
            )
        ),
        new Ficha(
            "Camilo Calderón",
            "17.654.321-3",
            LocalDate.of(1989, 12, 21),
            "965432109",
            "camilo.calderon@nutrivida.cl",
            "matias.fuentes@nutrivida.cl",
            List.of(
                new Medida(45, "181.00", "92.00", "97.00", "104.00"),
                new Medida(20, "181.00", "90.40", "95.00", "103.00"),
                new Medida(0, "181.00", "88.70", "93.50", "102.00")
            )
        )
    );

    @Bean
    @Order(2)
    CommandLineRunner cargarFichasIniciales(
        UsuariosService usuarios,
        ClinicaService clinica,
        @Value(
            "${CLAVE_INICIAL_VALENTINA:${CLAVE_CUENTAS_INICIALES:${ADMIN_PASSWORD:}}}"
        ) String claveValentina,
        @Value(
            "${CLAVE_INICIAL_MATIAS:${CLAVE_CUENTAS_INICIALES:${ADMIN_PASSWORD:}}}"
        ) String claveMatias,
        @Value(
            "${CLAVE_INICIAL_ESTEBAN:${CLAVE_CUENTAS_INICIALES:${ADMIN_PASSWORD:}}}"
        ) String claveEsteban,
        @Value(
            "${CLAVE_INICIAL_JUAN:${CLAVE_CUENTAS_INICIALES:${ADMIN_PASSWORD:}}}"
        ) String claveJuan,
        @Value(
            "${CLAVE_INICIAL_CAMILO:${CLAVE_CUENTAS_INICIALES:${ADMIN_PASSWORD:}}}"
        ) String claveCamilo
    ) {
        return args -> {
            Map<String, String> claves = Map.of(
                "valentina.rojas@nutrivida.cl",
                claveValentina,
                "matias.fuentes@nutrivida.cl",
                claveMatias,
                "esteban.zavala@nutrivida.cl",
                claveEsteban,
                "juan.lopez@nutrivida.cl",
                claveJuan,
                "camilo.calderon@nutrivida.cl",
                claveCamilo
            );

            for (Nutricionista nutricionista : NUTRICIONISTAS) {
                if (usuarios.porCorreo(nutricionista.correo()).isEmpty()) {
                    usuarios.crearProfesional(
                        new Datos.AltaProfesional(
                            nutricionista.nombre(),
                            nutricionista.especialidad(),
                            nutricionista.correo(),
                            claves.get(nutricionista.correo())
                        )
                    );
                }
            }

            for (Ficha ficha : FICHAS) {
                if (usuarios.porCorreo(ficha.correo()).isPresent()) {
                    continue;
                }

                Usuario profesional = usuarios.porCorreo(ficha.correoNutricionista()).orElseThrow();
                Usuario paciente = usuarios.registrar(
                    new Datos.Registro(
                        ficha.nombre(),
                        ficha.rut(),
                        ficha.nacimiento(),
                        ficha.telefono(),
                        ficha.correo(),
                        claves.get(ficha.correo())
                    )
                );
                clinica.asignar(paciente.id, profesional.id);

                for (Medida medida : ficha.medidas()) {
                    clinica.registrarMedicion(
                        profesional,
                        paciente.id,
                        new DatosClinicos.NuevaMedicion(
                            LocalDate.now().minusDays(medida.diasAtras()),
                            new BigDecimal(medida.estaturaCm()),
                            new BigDecimal(medida.pesoKg()),
                            new BigDecimal(medida.cinturaCm()),
                            new BigDecimal(medida.caderaCm())
                        )
                    );
                }
            }
        };
    }
}
