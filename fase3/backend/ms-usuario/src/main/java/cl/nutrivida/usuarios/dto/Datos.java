package cl.nutrivida.usuarios.dto;

import cl.nutrivida.usuarios.constantes.Rut;
import cl.nutrivida.usuarios.entity.Usuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class Datos {

    public record Perfil(
        @NotBlank @Size(min = 3, max = 120) String nombre,
        @NotBlank @Size(max = Rut.LARGO_MAXIMO) String rut,
        @NotNull @Past LocalDate fechaNac,
        @NotBlank String telefono,
        @NotBlank @Email @Size(max = 254) String correo
    ) {}

    public record Registro(
        @NotBlank @Size(min = 3, max = 120) String nombre,
        @NotBlank @Size(max = Rut.LARGO_MAXIMO) String rut,
        @NotNull @Past LocalDate fechaNac,
        @NotBlank String telefono,
        @NotBlank @Email @Size(max = 254) String correo,
        @NotBlank @Size(min = 8, max = 72) String password
    ) {}

    public record CambioPassword(
        @NotBlank @Size(max = 72) String actual,
        @NotBlank @Size(min = 8, max = 72) String nueva
    ) {}

    public record NuevaPassword(@NotBlank @Size(min = 8, max = 72) String nueva) {}

    public record Login(@NotBlank @Email String correo, @NotBlank String password) {}

    public record Vista(
        Long id,
        String nombre,
        String rut,
        LocalDate fechaNac,
        String telefono,
        String correo,
        String rol,
        boolean activo,
        String especialidad,
        String cargo
    ) {}

    public record Permisos(
        @NotBlank @Pattern(regexp = "PACIENTE|ADMIN|PROFESIONAL") String rol,
        @NotNull Boolean activo,
        @Size(max = 120) String especialidad,
        @Size(max = 120) String cargo
    ) {}

    public record AltaProfesional(
        @NotBlank @Size(min = 3, max = 120) String nombre,
        @NotBlank @Size(max = 120) String especialidad,
        @NotBlank @Email @Size(max = 254) String correo,
        @NotBlank @Size(min = 8, max = 72) String password
    ) {}

    public record PerfilProfesional(
        @NotBlank @Size(min = 3, max = 120) String nombre,
        @NotBlank @Size(max = 120) String especialidad,
        @NotBlank @Email @Size(max = 254) String correo
    ) {}

    public record AsignarProfesional(@NotNull Long profesionalId) {}

    public record PerfilAdministracion(
        @NotBlank @Size(min = 3, max = 120) String nombre,
        @NotBlank @Size(max = 120) String cargo
    ) {}

    public static Vista vista(Usuario usuario) {
        return new Vista(
            usuario.id,
            usuario.nombre,
            usuario.rut,
            usuario.fechaNac,
            usuario.telefono,
            usuario.correo,
            usuario.rol,
            usuario.activo,
            usuario.especialidad,
            usuario.cargo
        );
    }
}
