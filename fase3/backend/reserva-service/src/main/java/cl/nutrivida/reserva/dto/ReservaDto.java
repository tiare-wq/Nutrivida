package cl.nutrivida.reserva.dto;

import cl.nutrivida.reserva.entity.TipoPaciente;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import cl.nutrivida.reserva.entity.TipoAtencion;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class ReservaDto {

    private Long id;

    @NotNull(message = "Seleccione un tipo de atención")
    private TipoAtencion tipoAtencion;

    @NotBlank(message = "El nombre del servicio no puede venir en blanco")
    private String nombreServicio;

    private String nombrePaciente;

    @Pattern(
            regexp = "^\\d{7,8}-[0-9Kk]$",
            message = "Ingrese un run sin puntos y con guión"
    )
    String runPaciente;

    @NotBlank(message = "El nombre del profesional no puede venir en blanco")
    private String nombreProfesional;

    @NotBlank(message = "El run del profesional no puede venir en blanco")
    @Pattern(
            regexp = "^\\d{7,8}-[0-9Kk]$",
            message = "Ingrese un run sin puntos y con guión"
    )
    private String runProfesional;

    @NotNull(message = "Seleccione una fecha")
    private LocalDateTime fecha;

    @NotNull(message = "El tipo de paciente es obligatorio")
    private TipoPaciente tipoPaciente;
}
