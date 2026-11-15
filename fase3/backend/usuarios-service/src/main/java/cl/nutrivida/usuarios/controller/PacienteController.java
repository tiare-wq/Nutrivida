package cl.nutrivida.usuarios.controller;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import cl.nutrivida.usuarios.dto.Datos;
import cl.nutrivida.usuarios.dto.DatosClinicos;
import cl.nutrivida.usuarios.entity.Usuario;
import cl.nutrivida.usuarios.service.ClinicaService;
import cl.nutrivida.usuarios.service.Sesiones;
import cl.nutrivida.usuarios.service.UsuariosService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/pacientes")
@SecurityRequirement(name = "bearerAuth")
public class PacienteController {

    final Sesiones sesiones;
    final UsuariosService usuarios;
    final ClinicaService clinica;

    public PacienteController(Sesiones sesiones, UsuariosService usuarios, ClinicaService clinica) {
        this.sesiones = sesiones;
        this.usuarios = usuarios;
        this.clinica = clinica;
    }

    Usuario paciente(Jwt token) {
        Usuario usuario = sesiones.actual(token);
        if (!usuario.rol.equals("PACIENTE")) {
            throw new ResponseStatusException(FORBIDDEN, "Requiere rol PACIENTE");
        }
        return usuario;
    }

    @GetMapping("/me")
    public Datos.Vista me(@AuthenticationPrincipal Jwt token) {
        return Datos.vista(paciente(token));
    }

    @GetMapping("/me/informe")
    public DatosClinicos.InformePaciente informe(@AuthenticationPrincipal Jwt token) {
        return clinica.informe(paciente(token).id);
    }

    @PutMapping("/me")
    public Datos.Vista editar(
        @AuthenticationPrincipal Jwt token,
        @Valid @RequestBody Datos.Perfil datos
    ) {
        return Datos.vista(usuarios.editar(paciente(token).id, datos));
    }

    @DeleteMapping("/me")
    @ResponseStatus(NO_CONTENT)
    public void eliminar(@AuthenticationPrincipal Jwt token) {
        usuarios.eliminar(paciente(token).id);
    }
}
