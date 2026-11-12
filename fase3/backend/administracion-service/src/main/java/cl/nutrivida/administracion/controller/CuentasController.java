package cl.nutrivida.administracion.controller;

import cl.nutrivida.administracion.client.UsuariosClient;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/usuarios")
@SecurityRequirement(name = "bearerAuth")
public class CuentasController {

    private final UsuariosClient usuariosClient;

    public CuentasController(UsuariosClient usuariosClient) {
        this.usuariosClient = usuariosClient;
    }

    @PutMapping("/{id}/administracion")
    public ResponseEntity<String> editarAdministrador(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id,
        @RequestBody String cuerpo
    ) {
        return usuariosClient.editarAdministrador(authorization, id, cuerpo);
    }

    @GetMapping
    public ResponseEntity<String> lista(@RequestHeader("Authorization") String authorization) {
        return usuariosClient.listarUsuarios(authorization);
    }

    @PatchMapping("/{id}/permisos")
    public ResponseEntity<String> permisos(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id,
        @RequestBody String cuerpo
    ) {
        return usuariosClient.actualizarPermisos(authorization, id, cuerpo);
    }
}
