package cl.nutrivida.reserva.client;

import cl.nutrivida.reserva.client.model.UsuarioClient;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
    name = "usuarios-service",
    url = "http://localhost:8081"
    )
public interface UsuarioFeignClient {
    @GetMapping("/api/v1/admin/usuarios/id/{id}")
    UsuarioClient obtenerUsuarioPorId(@PathVariable Long id);

    @GetMapping("/api/v1/admin/usuarios/run/{run}")
    UsuarioClient obtenerUsuarioPorRun(@PathVariable String run);
}
