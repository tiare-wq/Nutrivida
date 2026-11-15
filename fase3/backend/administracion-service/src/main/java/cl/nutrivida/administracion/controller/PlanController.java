package cl.nutrivida.administracion.controller;

import cl.nutrivida.administracion.dto.PlanDTO;
import cl.nutrivida.administracion.service.PlanService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/planes")
public class PlanController {

    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    @GetMapping
    public ResponseEntity<List<PlanDTO>> obtenerTodos() {
        return ResponseEntity.ok(planService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanDTO> obtenerPorId(
            @PathVariable String id) {

        return ResponseEntity.ok(planService.obtenerPorId(id));
    }
}