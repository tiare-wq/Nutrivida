package cl.nutrivida.reserva.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorDto {
    String nombre;
    int codigo;
    String mensaje;
}
