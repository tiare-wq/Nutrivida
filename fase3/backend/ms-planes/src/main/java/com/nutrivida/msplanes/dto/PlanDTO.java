package com.nutrivida.msplanes.dto;

import java.math.BigDecimal;

public record PlanDTO(
        String id,
        String nombre,
        String descripcion,
        String tipoProfesional,
        String duracion,
        String modalidad,
        BigDecimal precio
) {
}
