package cl.nutrivida.usuarios.controller;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import cl.nutrivida.usuarios.dto.Datos;
import cl.nutrivida.usuarios.entity.Usuario;
import cl.nutrivida.usuarios.service.Sesiones;
import cl.nutrivida.usuarios.service.UsuariosService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
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
@RequestMapping("/api/admin/pacientes")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    final UsuariosService usuarios;
    final Sesiones sesiones;

    public AdminController(UsuariosService u, Sesiones s) {
        usuarios = u;
        sesiones = s;
    }

    void admin(Jwt token) {
        if (!sesiones.actual(token).rol.equals("ADMIN")) {
            throw new ResponseStatusException(FORBIDDEN, "Requiere administrador");
        }
    }

    Usuario paciente(Long id) {
        Usuario u = usuarios.buscar(id);
        if (!u.rol.equals("PACIENTE")) {
            throw new ResponseStatusException(NOT_FOUND, "Paciente no encontrado");
        }
        return u;
    }

    @GetMapping
    public Object lista(@AuthenticationPrincipal Jwt token) {
        admin(token);
        return usuarios.listar();
    }

    @GetMapping("/{id}")
    public Datos.Vista ver(@AuthenticationPrincipal Jwt token, @PathVariable Long id) {
        admin(token);
        return Datos.vista(paciente(id));
    }

    @PostMapping
    @ResponseStatus(CREATED)
    public Datos.Vista crear(
        @AuthenticationPrincipal Jwt token,
        @Valid @RequestBody Datos.Registro datos
    ) {
        admin(token);
        return Datos.vista(usuarios.registrar(datos));
    }

    @PutMapping("/{id}")
    public Datos.Vista editar(
        @AuthenticationPrincipal Jwt token,
        @PathVariable Long id,
        @Valid @RequestBody Datos.Perfil datos
    ) {
        admin(token);
        paciente(id);
        return Datos.vista(usuarios.editar(id, datos));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(NO_CONTENT)
    public void eliminar(@AuthenticationPrincipal Jwt token, @PathVariable Long id) {
        admin(token);
        paciente(id);
        usuarios.eliminar(id);
    }
}
