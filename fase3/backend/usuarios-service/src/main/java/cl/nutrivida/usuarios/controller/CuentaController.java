package cl.nutrivida.usuarios.controller;

import static org.springframework.http.HttpStatus.NO_CONTENT;

import cl.nutrivida.usuarios.dto.Datos;
import cl.nutrivida.usuarios.entity.Usuario;
import cl.nutrivida.usuarios.service.Sesiones;
import cl.nutrivida.usuarios.service.UsuariosService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Operaciones de la cuenta propia, disponibles para cualquier rol autenticado. */
@RestController
@RequestMapping("/api/cuenta")
@SecurityRequirement(name = "bearerAuth")
public class CuentaController {

    private final UsuariosService usuarios;
    private final Sesiones sesiones;

    public CuentaController(UsuariosService usuarios, Sesiones sesiones) {
        this.usuarios = usuarios;
        this.sesiones = sesiones;
    }

    @PutMapping("/password")
    @ResponseStatus(NO_CONTENT)
    public void cambiarPassword(
        @AuthenticationPrincipal Jwt token,
        @Valid @RequestBody Datos.CambioPassword datos
    ) {
        Usuario usuario = sesiones.actual(token);
        usuarios.cambiarPassword(usuario.id, datos.actual(), datos.nueva());
    }
}
