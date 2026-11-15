package com.nutrivida.mscarrito.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.nutrivida.mscarrito.entity.Carrito;

public interface CarritoRepository 
    extends JpaRepository<Carrito, Long>{

        Optional<Carrito> findByIdUsuario(Long idUsuario);
}