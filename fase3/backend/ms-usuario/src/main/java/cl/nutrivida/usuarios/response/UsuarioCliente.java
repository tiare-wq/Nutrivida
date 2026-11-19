package cl.nutrivida.usuarios.response;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class UsuarioCliente {

    private Long id;
    @NotBlank(message = "El nombre del profesional no puede venir en blanco")
    private String nombre;

    @NotBlank(message = "El run del profesional no puede venir en blanco")
    private String run;

    // Constructor vacío
    public UsuarioCliente() {
    }

    // Constructor con todos los atributos
    public UsuarioCliente(Long id, String nombre, String run) {
        this.id = id;
        this.nombre = nombre;
        this.run = run;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getRun() {
        return run;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setRun(String run) {
        this.run = run;
    }
}
