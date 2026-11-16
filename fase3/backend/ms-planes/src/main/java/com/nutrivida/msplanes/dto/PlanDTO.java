package com.nutrivida.msplanes.dto;

public record PlanDTO(
        String id,
        String nombre,
        String descripcion,
        String tipoProfesional,
        String duracion,
        String modalidad,
        float precio,
        boolean activo
) {
}