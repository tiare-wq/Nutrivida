package cl.nutrivida.administracion.service;

import cl.nutrivida.administracion.dto.PlanDTO;
import cl.nutrivida.administracion.entity.Plan;
import cl.nutrivida.administracion.repository.PlanRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
public class PlanService {

    private final PlanRepository planRepository;

    public PlanService(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    public List<PlanDTO> obtenerTodos() {
        return planRepository.findAll()
                .stream()
                .map(this::convertirDTO)
                .toList();
    }

    public PlanDTO obtenerPorId(String id) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "El plan no existe: " + id
                ));

        return convertirDTO(plan);
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