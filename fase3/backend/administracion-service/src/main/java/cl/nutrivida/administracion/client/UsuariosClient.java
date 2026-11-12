package cl.nutrivida.administracion.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "usuarios-service", url = "${app.usuarios-url:http://localhost:8081}")
public interface UsuariosClient {

    @GetMapping("/api/admin/profesionales")
    ResponseEntity<String> listarProfesionales(
        @RequestHeader("Authorization") String authorization
    );

    @GetMapping("/api/admin/profesionales/{id}")
    ResponseEntity<String> verProfesional(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id
    );

    @PostMapping(value = "/api/admin/profesionales", consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<String> crearProfesional(
        @RequestHeader("Authorization") String authorization,
        @RequestBody String cuerpo
    );

    @PutMapping(
        value = "/api/admin/profesionales/{id}",
        consumes = MediaType.APPLICATION_JSON_VALUE
    )
    ResponseEntity<String> editarProfesional(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id,
        @RequestBody String cuerpo
    );

    @DeleteMapping("/api/admin/profesionales/{id}")
    ResponseEntity<String> desactivarProfesional(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id
    );

    @GetMapping("/api/admin/pacientes")
    ResponseEntity<String> listarPacientes(@RequestHeader("Authorization") String authorization);

    @GetMapping("/api/admin/pacientes/{id}")
    ResponseEntity<String> verPaciente(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id
    );

    @PostMapping(value = "/api/admin/pacientes", consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<String> crearPaciente(
        @RequestHeader("Authorization") String authorization,
        @RequestBody String cuerpo
    );

    @PutMapping(value = "/api/admin/pacientes/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<String> editarPaciente(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id,
        @RequestBody String cuerpo
    );

    @DeleteMapping("/api/admin/pacientes/{id}")
    ResponseEntity<String> eliminarPaciente(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id
    );

    @GetMapping("/api/admin/pacientes/{id}/profesional")
    ResponseEntity<String> consultarAsignacion(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id
    );

    @PutMapping(
        value = "/api/admin/pacientes/{id}/profesional",
        consumes = MediaType.APPLICATION_JSON_VALUE
    )
    ResponseEntity<String> asignarProfesional(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id,
        @RequestBody String cuerpo
    );

    @GetMapping("/api/admin/usuarios")
    ResponseEntity<String> listarUsuarios(@RequestHeader("Authorization") String authorization);

    @PatchMapping(
        value = "/api/admin/usuarios/{id}/permisos",
        consumes = MediaType.APPLICATION_JSON_VALUE
    )
    ResponseEntity<String> actualizarPermisos(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id,
        @RequestBody String cuerpo
    );

    @PutMapping(
        value = "/api/admin/usuarios/{id}/administracion",
        consumes = MediaType.APPLICATION_JSON_VALUE
    )
    ResponseEntity<String> editarAdministrador(
        @RequestHeader("Authorization") String authorization,
        @PathVariable Long id,
        @RequestBody String cuerpo
    );
}
