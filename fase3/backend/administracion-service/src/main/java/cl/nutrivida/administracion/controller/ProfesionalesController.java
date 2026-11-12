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
@RequestMapping("/api/admin")
@SecurityRequirement(name = "bearerAuth")
public class ProfesionalesController {

    private final UsuariosClient usuariosClient;

    public ProfesionalesController(UsuariosClient usuariosClient) {
        this.usuariosClient = usuariosClient;
    }

    @GetMapping("/profesionales")
    public ResponseEntity<String> listar(@RequestHeader("Authorization") String authorization) {
        return usuariosClient.listarProfesionales(authorization);
    }

    @GetMapping("/profesionales/{id}")
    public ResponseEntity<String> ver(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id
    ) {
        return usuariosClient.verProfesional(authorization, id);
    }

    @PostMapping("/profesionales")
    public ResponseEntity<String> crear(
        @RequestHeader("Authorization") String authorization,
        @RequestBody String cuerpo
    ) {
        return usuariosClient.crearProfesional(authorization, cuerpo);
    }

    @PutMapping("/profesionales/{id}")
    public ResponseEntity<String> editar(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id,
        @RequestBody String cuerpo
    ) {
        return usuariosClient.editarProfesional(authorization, id, cuerpo);
    }

    @DeleteMapping("/profesionales/{id}")
    public ResponseEntity<String> desactivar(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id
    ) {
        return usuariosClient.desactivarProfesional(authorization, id);
    }

    @GetMapping("/pacientes/{id}/profesional")
    public ResponseEntity<String> consultarAsignacion(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id
    ) {
        return usuariosClient.consultarAsignacion(authorization, id);
    }

    @PutMapping("/pacientes/{id}/profesional")
    public ResponseEntity<String> asignar(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id,
        @RequestBody String cuerpo
    ) {
        return usuariosClient.asignarProfesional(authorization, id, cuerpo);
    }
}
