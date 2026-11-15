package cl.nutrivida.reserva.repository;

import cl.nutrivida.reserva.entity.Reserva;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    Page<Reserva> findAllByIdPaciente(Long id, Pageable pageable);
}
