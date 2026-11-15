package com.nutrivida.mscarrito.service;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.nutrivida.mscarrito.dto.DetalleCarritoDTO;
import com.nutrivida.mscarrito.entity.Carrito;
import com.nutrivida.mscarrito.entity.DetalleCarrito;
import com.nutrivida.mscarrito.exception.CarritoNoEncontradoException;
import com.nutrivida.mscarrito.exception.PlanNoEncontradoException;
import com.nutrivida.mscarrito.mapper.DetalleCarritoMapper;
import com.nutrivida.mscarrito.repository.CarritoRepository;
import com.nutrivida.mscarrito.repository.DetalleCarritoRepository;

import jakarta.transaction.Transactional;

@Service 

@Transactional 
public class CarritoService {
    
    private final CarritoRepository carritoRepository;
    private final DetalleCarritoRepository detalleCarritoRepository;
    private final DetalleCarritoMapper detalleCarritoMapper;

    public CarritoService(CarritoRepository carritoRepository, DetalleCarritoRepository detalleCarritoRepository, DetalleCarritoMapper detalleCarritoMapper){
        this.carritoRepository = carritoRepository;
        this.detalleCarritoRepository = detalleCarritoRepository;
        this.detalleCarritoMapper = detalleCarritoMapper;
    }

    // ----- OBTENER O CREAR -----

    public Carrito obtenerOCrearCarrito(Long idUsuario){
        Optional<Carrito> carritoEncontrado = carritoRepository.findByIdUsuario(idUsuario);
        if (carritoEncontrado.isPresent()) {
            return carritoEncontrado.get();
        }

        Carrito nuevoCarrito = new Carrito();
        nuevoCarrito.setIdUsuario(idUsuario);
    
        return carritoRepository.save(nuevoCarrito);
    }

    // ----- AGREGAR PLAN -----

    public DetalleCarritoDTO agregarPlan(Long idUsuario, String idPlan, int cantidad){
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a cero");
        }

        Carrito carrito = obtenerOCrearCarrito(idUsuario);
        Optional<DetalleCarrito> detalleEncontrado = detalleCarritoRepository.findByCarrito_IdAndIdPlan(carrito.getId(), idPlan);
        if (detalleEncontrado.isPresent()) {
            DetalleCarrito detalle = detalleEncontrado.get();
            detalle.setCantidad(detalle.getCantidad() + cantidad);
            DetalleCarrito detalleGuardado = detalleCarritoRepository.save(detalle);
            DetalleCarritoDTO detalleDTO = detalleCarritoMapper.convertirDTO(detalleGuardado);
            return detalleDTO;
        }

        DetalleCarrito nuevoDetalle = new DetalleCarrito();
        nuevoDetalle.setIdPlan(idPlan);
        nuevoDetalle.setCantidad(cantidad);
        nuevoDetalle.setCarrito(carrito);
        DetalleCarrito detalleGuardado = detalleCarritoRepository.save(nuevoDetalle);
        DetalleCarritoDTO nuevoDetalleDTO = detalleCarritoMapper.convertirDTO(detalleGuardado);
        return nuevoDetalleDTO;
    }

    // ----- LISTA DE PLANES/DETALLE CARRITO -----

    public List<DetalleCarritoDTO> obtenerDetallesCarrito(Long idUsuario){
        Optional<Carrito> carritoEncontrado = carritoRepository.findByIdUsuario(idUsuario);
        if (carritoEncontrado.isEmpty()) {
            return List.of();
        }
        Carrito carrito = carritoEncontrado.get();
        List<DetalleCarrito> detalles = detalleCarritoRepository.findByCarrito_Id(carrito.getId());
        List<DetalleCarritoDTO> listaDTO = detalleCarritoMapper.convertirListaDTO(detalles);
        return listaDTO;
    }

    // ----- MODIFICAR CANTIDAD DE PLAN -----

    public DetalleCarritoDTO modificarCantidad(Long idUsuario, String idPlan, int nuevaCantidad){
        if (nuevaCantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a cero");
        }

        Carrito carrito = carritoRepository.findByIdUsuario(idUsuario)
            .orElseThrow(() -> new CarritoNoEncontradoException("El carrito no existe"));
        
        DetalleCarrito detalleEncontrado = detalleCarritoRepository.findByCarrito_IdAndIdPlan(carrito.getId(), idPlan)
            .orElseThrow(() -> new PlanNoEncontradoException("El plan no esta agregado"));

        detalleEncontrado.setCantidad(nuevaCantidad);
        DetalleCarrito detalleModificado = detalleCarritoRepository.save(detalleEncontrado);
        DetalleCarritoDTO detalleModificadoDTO = detalleCarritoMapper.convertirDTO(detalleModificado);
        return detalleModificadoDTO;
    }

    // ----- ELIMINAR PLAN -----

    public void eliminarPlan(Long idUsuario, String idPlan){
        Carrito carrito = carritoRepository.findByIdUsuario(idUsuario)
            .orElseThrow(() -> new CarritoNoEncontradoException("El carrito no existe"));
        
        DetalleCarrito detalleEncontrado = detalleCarritoRepository.findByCarrito_IdAndIdPlan(carrito.getId(), idPlan)
            .orElseThrow(() -> new PlanNoEncontradoException("El plan no esta agregado"));
        
        detalleCarritoRepository.delete(detalleEncontrado);
    }


}

