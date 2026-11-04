package cl.nutrivida.usuarios.repository;

import cl.nutrivida.usuarios.entity.Medicion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Mediciones extends JpaRepository<Medicion, Long> {
    List<Medicion> findByPacienteIdOrderByFechaDescIdDesc(Long pacienteId);

    void deleteByPacienteId(Long pacienteId);
}
