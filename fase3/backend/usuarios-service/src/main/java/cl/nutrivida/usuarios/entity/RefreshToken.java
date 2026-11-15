package cl.nutrivida.usuarios.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.time.Instant;

@Entity
public class RefreshToken {

    @Id
    public String hash;

    @ManyToOne(optional = false)
    public Usuario usuario;

    public Instant expira;
}
