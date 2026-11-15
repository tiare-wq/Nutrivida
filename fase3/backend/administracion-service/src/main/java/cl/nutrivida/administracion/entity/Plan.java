package cl.nutrivida.administracion.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "planes")
public class Plan {

    @Id
    private String id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, length = 1000)
    private String descripcion;

    @Column(nullable = false)
    private String tipoProfesional;

    @Column(nullable = false)
    private String duracion;

    @Column(nullable = false)
    private String modalidad;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal precio;

    public Plan() {
    }

    public Plan(
            String id,
            String nombre,
            String descripcion,
            String tipoProfesional,
            String duracion,
            String modalidad,
            BigDecimal precio) {

        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.tipoProfesional = tipoProfesional;
        this.duracion = duracion;
        this.modalidad = modalidad;
        this.precio = precio;
    }

    public String getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public String getTipoProfesional() {
        return tipoProfesional;
    }

    public String getDuracion() {
        return duracion;
    }

    public String getModalidad() {
        return modalidad;
    }

    public BigDecimal getPrecio() {
        return precio;
    }
}