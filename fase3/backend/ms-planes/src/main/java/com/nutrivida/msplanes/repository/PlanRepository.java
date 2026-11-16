
package com.nutrivida.msplanes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nutrivida.msplanes.entity.Plan;

public interface PlanRepository extends JpaRepository<Plan, String> {

    List<Plan> findByActivoTrue();

}
