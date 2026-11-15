package cl.nutrivida.usuarios.controller;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import cl.nutrivida.usuarios.dto.Datos;
import cl.nutrivida.usuarios.entity.Usuario;
import cl.nutrivida.usuarios.service.Sesiones;
import cl.nutrivida.usuarios.service.UsuariosService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin/usuarios")
@SecurityRequirement(name = "bearerAuth")
public class CuentasController {

    final UsuariosService usuarios;
    final Sesiones sesiones;

    public CuentasController(UsuariosService u, Sesiones s) {
        usuarios = u;
        sesiones = s;
    }

    @PutMapping("/{id}/administracion")
    public Datos.Vista editarAdministrador(
        @AuthenticationPrincipal Jwt token,
        @PathVariable Long id,
        @Valid @RequestBody Datos.PerfilAdministracion datos
    ) {
        admin(token);
        return usuarios.editarAdministrador(id, datos);
    }

    @PutMapping("/{id}/password")
    @ResponseStatus(NO_CONTENT)
    public void restablecerPassword(
        @AuthenticationPrincipal Jwt token,
        @PathVariable Long id,
        @Valid @RequestBody Datos.NuevaPassword datos
    ) {
        admin(token);
        usuarios.restablecerPassword(id, datos.nueva());
    }

    Usuario admin(Jwt token) {
        Usuario u = sesiones.actual(token);
        if (!u.rol.equals("ADMIN")) {
            throw new ResponseStatusException(FORBIDDEN, "Requiere administrador");
        }
        return u;
    }

    @GetMapping
    public Object lista(@AuthenticationPrincipal Jwt token) {
        admin(token);
        return usuarios.todos();
    }

    @PatchMapping("/{id}/permisos")
    public Datos.Vista permisos(
        @AuthenticationPrincipal Jwt token,
        @PathVariable Long id,
        @Valid @RequestBody Datos.Permisos datos
    ) {
        return usuarios.permisos(admin(token).id, id, datos);
    }
}
