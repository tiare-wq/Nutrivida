
package com.nutrivida.msplanes.service;

import com.nutrivida.msplanes.dto.PlanDTO;
import com.nutrivida.msplanes.entity.Plan;
import com.nutrivida.msplanes.repository.PlanRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PlanService {

    private final PlanRepository planRepository;

    public PlanService(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    @Transactional(readOnly = true)
    public List<PlanDTO> obtenerTodos() {
        return planRepository.findAll()
                .stream()
                .map(this::convertirDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public PlanDTO obtenerPorId(String id) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "El plan no existe: " + id
                ));

        return convertirDTO(plan);
    }

    @Transactional
    public PlanDTO crearPlan(PlanDTO dto) {

        if (planRepository.existsById(dto.id())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe un plan con ID: " + dto.id()
            );
        }

        Plan plan = new Plan();

        plan.setId(dto.id());
        actualizarDatos(plan, dto);

        return convertirDTO(planRepository.save(plan));
    }

    @Transactional
    public PlanDTO actualizarPlan(String id, PlanDTO dto) {

        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "El plan no existe: " + id
                ));

        actualizarDatos(plan, dto);

        return convertirDTO(planRepository.save(plan));
    }

    private void actualizarDatos(Plan plan, PlanDTO dto) {
        plan.setNombre(dto.nombre());
        plan.setDescripcion(dto.descripcion());
        plan.setTipoProfesional(dto.tipoProfesional());
        plan.setDuracion(dto.duracion());
        plan.setModalidad(dto.modalidad());
        plan.setPrecio(dto.precio());
    }

    private PlanDTO convertirDTO(Plan plan) {
        return new PlanDTO(
                plan.getId(),
                plan.getNombre(),
                plan.getDescripcion(),
                plan.getTipoProfesional(),
                plan.getDuracion(),
                plan.getModalidad(),
                plan.getPrecio()
        );
    }
}
