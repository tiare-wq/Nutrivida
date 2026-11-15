
package com.nutrivida.mscarrito.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nutrivida.mscarrito.client.PlanClient;
import com.nutrivida.mscarrito.dto.DetalleCarritoDTO;
import com.nutrivida.mscarrito.entity.Carrito;
import com.nutrivida.mscarrito.entity.DetalleCarrito;
import com.nutrivida.mscarrito.exception.CarritoNoEncontradoException;
import com.nutrivida.mscarrito.exception.PlanNoEncontradoException;
import com.nutrivida.mscarrito.mapper.DetalleCarritoMapper;
import com.nutrivida.mscarrito.repository.CarritoRepository;
import com.nutrivida.mscarrito.repository.DetalleCarritoRepository;

import feign.FeignException;

@Service
@Transactional
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final DetalleCarritoRepository detalleCarritoRepository;
    private final DetalleCarritoMapper detalleCarritoMapper;
    private final PlanClient planClient;

    public CarritoService(
            CarritoRepository carritoRepository,
            DetalleCarritoRepository detalleCarritoRepository,
            DetalleCarritoMapper detalleCarritoMapper,
            PlanClient planClient) {

        this.carritoRepository = carritoRepository;
        this.detalleCarritoRepository = detalleCarritoRepository;
        this.detalleCarritoMapper = detalleCarritoMapper;
        this.planClient = planClient;
    }

    // OBTENER O CREAR CARRITO

    public Carrito obtenerOCrearCarrito(Long idUsuario) {

        Optional<Carrito> carritoEncontrado =
                carritoRepository.findByIdUsuario(idUsuario);

        if (carritoEncontrado.isPresent()) {
            return carritoEncontrado.get();
        }

        Carrito nuevoCarrito = new Carrito();
        nuevoCarrito.setIdUsuario(idUsuario);

        return carritoRepository.save(nuevoCarrito);
    }

    // VALIDAR EXISTENCIA DEL PLAN

    private void validarPlan(String idPlan) {

        if (idPlan == null || idPlan.isBlank()) {
            throw new IllegalArgumentException(
                "El identificador del plan es obligatorio"
            );
        }

        try {
            planClient.obtenerPlanPorId(idPlan);

        } catch (FeignException.NotFound e) {
            throw new PlanNoEncontradoException(
                "El plan " + idPlan + " no existe en el catalogo"
            );
        }
    }

    // AGREGAR PLAN

    public DetalleCarritoDTO agregarPlan(
            Long idUsuario,
            String idPlan,
            int cantidad) {

        if (cantidad <= 0) {
            throw new IllegalArgumentException(
                "La cantidad debe ser mayor a cero"
            );
        }

        // Verificar existencia en administracion-service
        validarPlan(idPlan);

        Carrito carrito = obtenerOCrearCarrito(idUsuario);

        Optional<DetalleCarrito> detalleEncontrado =
                detalleCarritoRepository.findByCarrito_IdAndIdPlan(
                    carrito.getId(), idPlan
                );

        if (detalleEncontrado.isPresent()) {

            DetalleCarrito detalle = detalleEncontrado.get();

            detalle.setCantidad(
                Math.addExact(detalle.getCantidad(), cantidad)
            );

            DetalleCarrito detalleGuardado =
                    detalleCarritoRepository.save(detalle);

            return detalleCarritoMapper.convertirDTO(detalleGuardado);
        }

        DetalleCarrito nuevoDetalle = new DetalleCarrito();
        nuevoDetalle.setIdPlan(idPlan);
        nuevoDetalle.setCantidad(cantidad);
        nuevoDetalle.setCarrito(carrito);

        DetalleCarrito detalleGuardado =
                detalleCarritoRepository.save(nuevoDetalle);

        return detalleCarritoMapper.convertirDTO(detalleGuardado);
    }

    // LISTAR DETALLES

    @Transactional(readOnly = true)
    public List<DetalleCarritoDTO> obtenerDetallesCarrito(Long idUsuario) {

        Optional<Carrito> carritoEncontrado =
                carritoRepository.findByIdUsuario(idUsuario);

        if (carritoEncontrado.isEmpty()) {
            return List.of();
        }

        Carrito carrito = carritoEncontrado.get();

        List<DetalleCarrito> detalles =
                detalleCarritoRepository.findByCarrito_Id(carrito.getId());

        return detalleCarritoMapper.convertirListaDTO(detalles);
    }

    // MODIFICAR CANTIDAD

    public DetalleCarritoDTO modificarCantidad(
            Long idUsuario,
            String idPlan,
            int nuevaCantidad) {

        if (nuevaCantidad <= 0) {
            throw new IllegalArgumentException(
                "La cantidad debe ser mayor a cero"
            );
        }

        Carrito carrito = carritoRepository.findByIdUsuario(idUsuario)
                .orElseThrow(() ->
                    new CarritoNoEncontradoException(
                        "El carrito no existe"
                    )
                );

        DetalleCarrito detalle = detalleCarritoRepository
                .findByCarrito_IdAndIdPlan(carrito.getId(), idPlan)
                .orElseThrow(() ->
                    new PlanNoEncontradoException(
                        "El plan no esta agregado"
                    )
                );

        detalle.setCantidad(nuevaCantidad);

        DetalleCarrito detalleGuardado =
                detalleCarritoRepository.save(detalle);

        return detalleCarritoMapper.convertirDTO(detalleGuardado);
    }

    // ELIMINAR PLAN

    public void eliminarPlan(Long idUsuario, String idPlan) {

        Carrito carrito = carritoRepository.findByIdUsuario(idUsuario)
                .orElseThrow(() ->
                    new CarritoNoEncontradoException(
                        "El carrito no existe"
                    )
                );

        DetalleCarrito detalle = detalleCarritoRepository
                .findByCarrito_IdAndIdPlan(carrito.getId(), idPlan)
                .orElseThrow(() ->
                    new PlanNoEncontradoException(
                        "El plan no esta agregado"
                    )
                );

        detalleCarritoRepository.delete(detalle);
    }
}
