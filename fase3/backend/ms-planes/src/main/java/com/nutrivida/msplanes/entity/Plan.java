
package com.nutrivida.msplanes.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "planes")
public class Plan {

    @Id
    @Column(length = 10)
    private String id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, length = 1000)
    private String descripcion;

    @Column(nullable = false, name = "tipo_profesional")
    private String tipoProfesional;

    @Column(nullable = false)
    private String duracion;

    @Column(nullable = false)
    private String modalidad;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal precio;
}
