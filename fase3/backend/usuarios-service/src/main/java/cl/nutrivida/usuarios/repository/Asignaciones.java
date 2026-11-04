package cl.nutrivida.usuarios.repository;

import cl.nutrivida.usuarios.entity.AsignacionPaciente;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Asignaciones extends JpaRepository<AsignacionPaciente, Long> {
    Optional<AsignacionPaciente> findByPacienteId(Long pacienteId);

    List<AsignacionPaciente> findByProfesionalId(Long profesionalId);

    boolean existsByPacienteIdAndProfesionalId(Long pacienteId, Long profesionalId);

    void deleteByPacienteId(Long pacienteId);

    void deleteByProfesionalId(Long profesionalId);
}
