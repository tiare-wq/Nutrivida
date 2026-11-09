package org.nutrivida.backend.client.model;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ProfesionalClient {
    @NotBlank(message = "El nombre del profesional no puede venir en blanco")
    private String nombre;

    @NotBlank(message = "El run del profesional no puede venir en blanco")
    private String run;
}
