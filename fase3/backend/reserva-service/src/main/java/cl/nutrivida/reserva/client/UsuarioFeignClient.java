package cl.nutrivida.reserva.client;

import cl.nutrivida.reserva.client.model.PacienteClient;
import cl.nutrivida.reserva.client.model.ProfesionalClient;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Optional;

@FeignClient(name = "usuarios-service")
public interface UsuarioFeignClient {

    @GetMapping("/api/pacientes/paciente/{id}")
    PacienteClient obtenerPacientePorId(@PathVariable Long id);

    @GetMapping("/api/pacientes/paciente/{run}")
    Long obtenerPacientePorRun(@PathVariable String run);

    @GetMapping("api/profesionales/profesional/{id}")
    ProfesionalClient obtenerProfesionalPorId(@PathVariable Long id);

    @GetMapping("api/profesionales/profesional/{run}")
    Long obtenerProfesionalPorRun(@PathVariable String run);
}
