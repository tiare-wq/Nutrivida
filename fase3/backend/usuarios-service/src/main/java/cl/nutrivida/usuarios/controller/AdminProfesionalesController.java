package cl.nutrivida.usuarios.controller;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import cl.nutrivida.usuarios.dto.Datos;
import cl.nutrivida.usuarios.dto.DatosClinicos;
import cl.nutrivida.usuarios.entity.Usuario;
import cl.nutrivida.usuarios.service.ClinicaService;
import cl.nutrivida.usuarios.service.Sesiones;
import cl.nutrivida.usuarios.service.UsuariosService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin")
@SecurityRequirement(name = "bearerAuth")
public class AdminProfesionalesController {

    private final Sesiones sesiones;
    private final UsuariosService usuarios;
    private final ClinicaService clinica;

    public AdminProfesionalesController(
        Sesiones sesiones,
        UsuariosService usuarios,
        ClinicaService clinica
    ) {
        this.sesiones = sesiones;
        this.usuarios = usuarios;
        this.clinica = clinica;
    }

    private void administrador(Jwt token) {
        if (!sesiones.actual(token).rol.equals("ADMIN")) {
            throw new ResponseStatusException(FORBIDDEN, "Requiere rol ADMIN");
        }
    }

    private Datos.Vista profesional(Long id) {
        Usuario usuario = usuarios.buscar(id);
        if (!usuario.rol.equals("PROFESIONAL")) {
            throw new ResponseStatusException(NOT_FOUND, "Profesional no encontrado");
        }
        return Datos.vista(usuario);
    }

    @GetMapping("/profesionales")
    public List<Datos.Vista> listar(@AuthenticationPrincipal Jwt token) {
        administrador(token);
        return usuarios
            .todos()
            .stream()
            .filter(usuario -> usuario.rol().equals("PROFESIONAL"))
            .toList();
    }

    @GetMapping("/profesionales/{id}")
    public Datos.Vista ver(@AuthenticationPrincipal Jwt token, @PathVariable Long id) {
        administrador(token);
        return profesional(id);
    }

    @PostMapping("/profesionales")
    @ResponseStatus(CREATED)
    public Datos.Vista crear(
        @AuthenticationPrincipal Jwt token,
        @Valid @RequestBody Datos.AltaProfesional datos
    ) {
        administrador(token);
        return Datos.vista(usuarios.crearProfesional(datos));
    }

    @PutMapping("/profesionales/{id}")
    public Datos.Vista editar(
        @AuthenticationPrincipal Jwt token,
        @PathVariable Long id,
        @Valid @RequestBody Datos.PerfilProfesional datos
    ) {
        administrador(token);
        return Datos.vista(usuarios.editarProfesional(id, datos));
    }

    @DeleteMapping("/profesionales/{id}")
    @ResponseStatus(NO_CONTENT)
    public void desactivar(@AuthenticationPrincipal Jwt token, @PathVariable Long id) {
        administrador(token);
        usuarios.desactivarProfesional(id);
    }

    @GetMapping("/pacientes/{id}/profesional")
    public DatosClinicos.ProfesionalAsignado consultarAsignacion(
        @AuthenticationPrincipal Jwt token,
        @PathVariable Long id
    ) {
        administrador(token);
        Usuario paciente = usuarios.buscar(id);
        if (!paciente.rol.equals("PACIENTE")) {
            throw new ResponseStatusException(NOT_FOUND, "Paciente no encontrado");
        }
        return clinica.profesionalAsignado(id);
    }

    @PutMapping("/pacientes/{id}/profesional")
    public DatosClinicos.ProfesionalAsignado asignar(
        @AuthenticationPrincipal Jwt token,
        @PathVariable Long id,
        @Valid @RequestBody Datos.AsignarProfesional datos
    ) {
        administrador(token);
        return clinica.asignar(id, datos.profesionalId());
    }
}
