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
@RequestMapping("/api/admin/pacientes")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final UsuariosGateway gateway;

    public AdminController(UsuariosGateway gateway) {
        this.gateway = gateway;
    }

    private ResponseEntity<String> enviar(
        HttpMethod metodo,
        String ruta,
        String authorization,
        String cuerpo
    ) {
        return gateway.enviar(metodo, "/api/admin/pacientes" + ruta, authorization, cuerpo);
    }

    @GetMapping
    public ResponseEntity<String> lista(@RequestHeader("Authorization") String authorization) {
        return enviar(HttpMethod.GET, "", authorization, null);
    }

    @GetMapping("/{id}")
    public ResponseEntity<String> ver(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id
    ) {
        return enviar(HttpMethod.GET, "/" + id, authorization, null);
    }

    @PostMapping
    public ResponseEntity<String> crear(
        @RequestHeader("Authorization") String authorization,
        @RequestBody String cuerpo
    ) {
        return enviar(HttpMethod.POST, "", authorization, cuerpo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> editar(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id,
        @RequestBody String cuerpo
    ) {
        return enviar(HttpMethod.PUT, "/" + id, authorization, cuerpo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id
    ) {
        return enviar(HttpMethod.DELETE, "/" + id, authorization, null);
    }
}
