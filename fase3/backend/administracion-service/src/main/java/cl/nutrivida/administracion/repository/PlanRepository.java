package cl.nutrivida.administracion.repository;

import cl.nutrivida.administracion.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlanRepository extends JpaRepository<Plan, String> {
}