package cl.nutrivida.reserva.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor

@Entity
@Table(name = "reserva")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tipo_atencion", nullable = false)
    private TipoAtencion tipoAtencion;

    @Column(name = "nombre_servicio", nullable = false, length = 150)
    private String nombreServicio;

    @Column(name = "id_paciente")
    private Long idPaciente;

    @Column(name = "id_profesional", nullable = false)
    private Long idProfesional;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime hora;

    @Column(nullable = false)
    private TipoPaciente tipoPaciente;

}
