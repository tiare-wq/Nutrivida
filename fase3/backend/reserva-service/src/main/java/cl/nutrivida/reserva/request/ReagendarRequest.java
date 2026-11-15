package cl.nutrivida.reserva.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReagendarRequest {
    @NotNull(message = "Ingrese una fecha")
    @FutureOrPresent(message = "La fecha no puede ser anterior a la actual")
    private LocalDateTime fecha;
}
