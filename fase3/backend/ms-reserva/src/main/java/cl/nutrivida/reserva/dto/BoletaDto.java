package cl.nutrivida.reserva.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BoletaDto {

    @NotNull
    private Long id;

    @NotNull
    private LocalDate fecha;

    @NotNull
    private LocalTime hora;

    @NotBlank
    private String nombreServicio;

    @NotBlank
    private String nombreProfesional;

    @NotNull
    private Double precio;
}
