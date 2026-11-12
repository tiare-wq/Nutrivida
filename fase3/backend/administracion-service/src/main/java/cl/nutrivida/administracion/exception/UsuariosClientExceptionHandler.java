package cl.nutrivida.administracion.exception;

import feign.FeignException;
import java.nio.charset.StandardCharsets;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class UsuariosClientExceptionHandler {

    private static final String SERVICE_UNAVAILABLE =
        "{\"message\":\"Servicio de usuarios no disponible\"}";

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<String> manejarErrorFeign(FeignException error) {
        int status = error.status();

        if (status < 100) {
            return ResponseEntity.status(503)
                .contentType(MediaType.APPLICATION_JSON)
                .body(SERVICE_UNAVAILABLE);
        }

        String responseBody = error.responseBody()
            .map(body -> StandardCharsets.UTF_8.decode(body).toString())
            .orElse("");

        return ResponseEntity.status(status)
            .contentType(MediaType.APPLICATION_JSON)
            .body(responseBody);
    }
}
