package com.nutrivida.mscarrito.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nutrivida.mscarrito.dto.DetalleCarritoDTO;
import com.nutrivida.mscarrito.service.CarritoService;

@RestController 
@RequestMapping("/api/v1/carrito")
public class CarritoController {
    
    private final CarritoService carritoService;

    public CarritoController (CarritoService carritoService){
        this.carritoService = carritoService;
    }

    @GetMapping("/{idUsuario}/planes")
    public ResponseEntity<List<DetalleCarritoDTO>> obtenerDetallesCarrito(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(carritoService.obtenerDetallesCarrito(idUsuario));
    }

    @PostMapping("/{idUsuario}/planes")
    public ResponseEntity<DetalleCarritoDTO> agregarPlan(@PathVariable Long idUsuario, @RequestBody DetalleCarritoDTO detalleDTO) {
        DetalleCarritoDTO nuevoCarrito = carritoService.agregarPlan(idUsuario, detalleDTO.getIdPlan(), detalleDTO.getCantidad());
        return ResponseEntity.ok(nuevoCarrito);
    }

    @PutMapping("/{idUsuario}/planes/{idPlan}")
    public ResponseEntity<DetalleCarritoDTO> modificarCantidad(@PathVariable Long idUsuario,@PathVariable String idPlan,@RequestBody DetalleCarritoDTO detalleDTO){
        return ResponseEntity.ok(carritoService.modificarCantidad(idUsuario, idPlan, detalleDTO.getCantidad()));
    }

    @DeleteMapping("/{idUsuario}/planes/{idPlan}")
    public ResponseEntity<Void> eliminarPlan(@PathVariable Long idUsuario,@PathVariable String idPlan) {
        carritoService.eliminarPlan(idUsuario, idPlan);
        return ResponseEntity.noContent().build();
    }
}
