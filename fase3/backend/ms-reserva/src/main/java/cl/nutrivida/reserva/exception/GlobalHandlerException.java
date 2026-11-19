package cl.nutrivida.reserva.exception;

import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalHandlerException {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorDto> handlerResourceNotFoundException(ResourceNotFoundException e) {
        ErrorDto error = new ErrorDto(
            "Resource Not Found",
            404,
            e.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(PermisosInsuficientesException.class)
    public ResponseEntity<ErrorDto> handlerPermsisosInsuficientesException(PermisosInsuficientesException e) {
        ErrorDto error = new ErrorDto(
            "Permisos Insuficientes",
            401,
            e.getMessage()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorDto> handlerIllegalArgumentException(IllegalArgumentException e) {
        ErrorDto error = new ErrorDto(
            "Illegal Argument Exception",
            400,
            e.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDto> handlerMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        String mensaje = e.getBindingResult()
            .getAllErrors()
            .stream()
            .map(DefaultMessageSourceResolvable::getDefaultMessage)
            .findFirst()
            .orElse("Al menos uno de los campos no es válido");
        ErrorDto error = new ErrorDto(
            "Method Argument Not Valid",
            400,
            mensaje
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDto> handlerException(Exception e) {
        ErrorDto error = new ErrorDto(
            "Internal Server Error",
            500,
            "Ha ocurrido un error interno. Inténtelo de nuevo más tarde" + e.getMessage());
        return ResponseEntity.internalServerError().body(error);
    }
}
