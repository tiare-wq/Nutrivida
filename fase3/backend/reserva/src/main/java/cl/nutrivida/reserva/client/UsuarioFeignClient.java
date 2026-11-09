package cl.nutrivida.reserva.client;

import cl.nutrivida.reserva.client.model.PacienteClient;
import cl.nutrivida.reserva.client.model.ProfesionalClient;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "usuarios-service")
public interface UsuarioFeignClient {

    @GetMapping("/api/pacientes/paciente/{id}")
    PacienteClient obtenerPaciente(@PathVariable Long id);

    @GetMapping("/api/pacientes/paciente/{run}")
    Long obtenerPacienteId(@PathVariable String run);

    @GetMapping("api/profesionales/profesional/{id}")
    ProfesionalClient obtenerProfesional(@PathVariable Long id);

    @GetMapping("api/profesionales/profesional/{run}")
    Long obtenerProfesionalId(@PathVariable String run);
}
