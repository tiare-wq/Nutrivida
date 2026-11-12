package cl.nutrivida.administracion.controller;

import cl.nutrivida.administracion.client.UsuariosClient;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/pacientes")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final UsuariosClient usuariosClient;

    public AdminController(UsuariosClient usuariosClient) {
        this.usuariosClient = usuariosClient;
    }

    @GetMapping
    public ResponseEntity<String> lista(@RequestHeader("Authorization") String authorization) {
        return usuariosClient.listarPacientes(authorization);
    }

    @GetMapping("/{id}")
    public ResponseEntity<String> ver(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id
    ) {
        return usuariosClient.verPaciente(authorization, id);
    }

    @PostMapping
    public ResponseEntity<String> crear(
        @RequestHeader("Authorization") String authorization,
        @RequestBody String cuerpo
    ) {
        return usuariosClient.crearPaciente(authorization, cuerpo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> editar(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id,
        @RequestBody String cuerpo
    ) {
        return usuariosClient.editarPaciente(authorization, id, cuerpo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id
    ) {
        return usuariosClient.eliminarPaciente(authorization, id);
    }
}
