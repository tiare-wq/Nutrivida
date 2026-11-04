package cl.nutrivida.usuarios.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDate;

@Entity
@Table(
    name = "usuarios",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "correo"),
        @UniqueConstraint(columnNames = "rut"),
    }
)
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    public String nombre;

    public String rut;

    public LocalDate fechaNac;

    public String telefono;

    public String especialidad;

    public String cargo;

    @Column(nullable = false)
    public String correo;

    @Column(nullable = false)
    public String passwordHash;

    @Column(nullable = false)
    public String rol = "PACIENTE";

    public long versionSesion = 0;

    @Column(nullable = false, columnDefinition = "boolean default true")
    public boolean activo = true;
}
