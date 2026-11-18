
package com.nutrivida.msplanes.controller;

import com.nutrivida.msplanes.dto.PlanDTO;
import com.nutrivida.msplanes.service.PlanService;

import org.springframework.http.HttpStatus;
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

    @PostMapping
    public ResponseEntity<PlanDTO> crearPlan(
            @RequestBody PlanDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(planService.crearPlan(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanDTO> actualizarPlan(
            @PathVariable String id,
            @RequestBody PlanDTO dto) {
        return ResponseEntity.ok(planService.actualizarPlan(id, dto));
    }
}
