package cl.nutrivida.usuarios.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
public class Medicion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(optional = false)
    public Usuario paciente;

    @ManyToOne(optional = false)
    public Usuario profesional;

    @Column(nullable = false)
    public LocalDate fecha;

    @Column(nullable = false, precision = 5, scale = 2)
    public BigDecimal estaturaCm;

    @Column(nullable = false, precision = 5, scale = 2)
    public BigDecimal pesoKg;

    @Column(nullable = false, precision = 5, scale = 2)
    public BigDecimal cinturaCm;

    @Column(nullable = false, precision = 5, scale = 2)
    public BigDecimal caderaCm;
}
