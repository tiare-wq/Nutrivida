package cl.nutrivida.administracion.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class Errors {

    @ExceptionHandler(ResponseStatusException.class)
    ResponseEntity<?> status(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatusCode()).body(
            java.util.Map.of(
                "message",
                e.getReason() == null ? "Solicitud rechazada" : e.getReason()
            )
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<?> validation(MethodArgumentNotValidException e) {
        return ResponseEntity.badRequest().body(
            java.util.Map.of(
                "message",
                "Datos inválidos",
                "fields",
                e
                    .getBindingResult()
                    .getFieldErrors()
                    .stream()
                    .map(x -> x.getField() + ": " + x.getDefaultMessage())
                    .toList()
            )
        );
    }

    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    ResponseEntity<?> malformed() {
        return ResponseEntity.badRequest().body(
            java.util.Map.of("message", "JSON o fecha inválida")
        );
    }
}
