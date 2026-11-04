package cl.nutrivida.administracion.controller;

import cl.nutrivida.administracion.service.UsuariosGateway;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpMethod;
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

    private final UsuariosGateway gateway;

    public ProfesionalesController(UsuariosGateway gateway) {
        this.gateway = gateway;
    }

    @GetMapping("/profesionales")
    public ResponseEntity<String> listar(@RequestHeader("Authorization") String authorization) {
        return gateway.enviar(HttpMethod.GET, "/api/admin/profesionales", authorization, null);
    }

    @GetMapping("/profesionales/{id}")
    public ResponseEntity<String> ver(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id
    ) {
        return gateway.enviar(
            HttpMethod.GET,
            "/api/admin/profesionales/" + id,
            authorization,
            null
        );
    }

    @PostMapping("/profesionales")
    public ResponseEntity<String> crear(
        @RequestHeader("Authorization") String authorization,
        @RequestBody String cuerpo
    ) {
        return gateway.enviar(HttpMethod.POST, "/api/admin/profesionales", authorization, cuerpo);
    }

    @PutMapping("/profesionales/{id}")
    public ResponseEntity<String> editar(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id,
        @RequestBody String cuerpo
    ) {
        return gateway.enviar(
            HttpMethod.PUT,
            "/api/admin/profesionales/" + id,
            authorization,
            cuerpo
        );
    }

    @DeleteMapping("/profesionales/{id}")
    public ResponseEntity<String> desactivar(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id
    ) {
        return gateway.enviar(
            HttpMethod.DELETE,
            "/api/admin/profesionales/" + id,
            authorization,
            null
        );
    }

    @GetMapping("/pacientes/{id}/profesional")
    public ResponseEntity<String> consultarAsignacion(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id
    ) {
        return gateway.enviar(
            HttpMethod.GET,
            "/api/admin/pacientes/" + id + "/profesional",
            authorization,
            null
        );
    }

    @PutMapping("/pacientes/{id}/profesional")
    public ResponseEntity<String> asignar(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id,
        @RequestBody String cuerpo
    ) {
        return gateway.enviar(
            HttpMethod.PUT,
            "/api/admin/pacientes/" + id + "/profesional",
            authorization,
            cuerpo
        );
    }
}
