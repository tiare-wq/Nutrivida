package com.nutrivida.mscarrito.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.nutrivida.mscarrito.entity.DetalleCarrito;

public interface DetalleCarritoRepository 
    extends JpaRepository <DetalleCarrito, Long>{
   
        Optional<DetalleCarrito> findByCarrito_IdAndIdPlan(Long idCarrito, String idPlan);

        List<DetalleCarrito> findByCarrito_Id(Long idCarrito);
}