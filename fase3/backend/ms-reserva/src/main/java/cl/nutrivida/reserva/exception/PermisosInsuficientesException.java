package cl.nutrivida.reserva.exception;

public class PermisosInsuficientesException extends RuntimeException {
    public PermisosInsuficientesException() {
        super();
    }

    public PermisosInsuficientesException(String mensaje) {
        super(mensaje);
    }
}
