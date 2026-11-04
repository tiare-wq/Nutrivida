package cl.nutrivida.usuarios.dto;

import cl.nutrivida.usuarios.entity.Medicion;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class DatosClinicos {

    public record NuevaMedicion(
        @NotNull @PastOrPresent LocalDate fecha,
        @NotNull @Positive @Digits(integer = 3, fraction = 2) BigDecimal estaturaCm,
        @NotNull @Positive @Digits(integer = 3, fraction = 2) BigDecimal pesoKg,
        @NotNull @Positive @Digits(integer = 3, fraction = 2) BigDecimal cinturaCm,
        @NotNull @Positive @Digits(integer = 3, fraction = 2) BigDecimal caderaCm
    ) {}

    public record VistaMedicion(
        Long id,
        LocalDate fecha,
        BigDecimal estaturaCm,
        BigDecimal pesoKg,
        BigDecimal cinturaCm,
        BigDecimal caderaCm,
        Long profesionalId,
        String profesionalNombre
    ) {}

    public record ProfesionalAsignado(Long id, String nombre, String especialidad) {}

    public record InformePaciente(
        Datos.Vista paciente,
        ProfesionalAsignado profesional,
        List<VistaMedicion> mediciones
    ) {}

    public static VistaMedicion vista(Medicion medicion) {
        return new VistaMedicion(
            medicion.id,
            medicion.fecha,
            medicion.estaturaCm,
            medicion.pesoKg,
            medicion.cinturaCm,
            medicion.caderaCm,
            medicion.profesional.id,
            medicion.profesional.nombre
        );
    }
}
