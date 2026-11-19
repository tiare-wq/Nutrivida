package cl.nutrivida.reserva.client.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class UsuarioClient {

    private Long id;
    @NotBlank(message = "El nombre del paciente no puede venir en blanco")
    private String nombre;

    @NotBlank(message = "El run del paciente no puede venir en blanco")
    private String run;
}
