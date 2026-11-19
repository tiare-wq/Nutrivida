package cl.nutrivida.reserva.dto;

import cl.nutrivida.reserva.entity.TipoPaciente;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import cl.nutrivida.reserva.entity.TipoAtencion;

import java.time.LocalDateTime;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class ReservaSave {

    private Long codigo;

    @NotNull(message = "Seleccione un tipo de atención")
    private TipoAtencion tipoAtencion;

    @NotBlank(message = "El nombre del servicio no puede venir en blanco")
    private String nombreServicio;

    @NotBlank(message = "El nombre del profesional no puede venir en blanco")
    private String nombreProfesional;

    @NotNull(message = "El precio no puede estar vacío")
    @Positive(message = "El precio debe ser positivo")
    @Min(
        value = 1000,
        message = "El precio es demasiado bajo. Mínimo $1.000"
    )
    @Max(
        value = 1000000,
        message = "El precio es demasiado alto. Máximo $1.000.000"
    )
    private Double precio;

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

    @NotBlank(message = "El correo es obligatorio")
    private String correo;
}
