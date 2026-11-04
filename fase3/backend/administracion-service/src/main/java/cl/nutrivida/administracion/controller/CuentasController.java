package cl.nutrivida.administracion.controller;

import cl.nutrivida.administracion.service.UsuariosGateway;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpMethod;
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

    private final UsuariosGateway gateway;

    public CuentasController(UsuariosGateway gateway) {
        this.gateway = gateway;
    }

    @PutMapping("/{id}/administracion")
    public ResponseEntity<String> editarAdministrador(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id,
        @RequestBody String cuerpo
    ) {
        return gateway.enviar(
            HttpMethod.PUT,
            "/api/admin/usuarios/" + id + "/administracion",
            authorization,
            cuerpo
        );
    }

    private ResponseEntity<String> enviar(
        HttpMethod metodo,
        String ruta,
        String authorization,
        String cuerpo
    ) {
        return gateway.enviar(metodo, "/api/admin/usuarios" + ruta, authorization, cuerpo);
    }

    @GetMapping
    public ResponseEntity<String> lista(@RequestHeader("Authorization") String authorization) {
        return enviar(HttpMethod.GET, "", authorization, null);
    }

    @PatchMapping("/{id}/permisos")
    public ResponseEntity<String> permisos(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id,
        @RequestBody String cuerpo
    ) {
        return enviar(HttpMethod.PATCH, "/" + id + "/permisos", authorization, cuerpo);
    }
}
