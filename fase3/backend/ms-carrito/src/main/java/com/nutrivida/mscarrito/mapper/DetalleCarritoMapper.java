package com.nutrivida.mscarrito.mapper;

import java.util.ArrayList;
import java.util.List;

import com.nutrivida.mscarrito.dto.DetalleCarritoDTO;
import com.nutrivida.mscarrito.entity.DetalleCarrito;

public class DetalleCarritoMapper {
    
    public DetalleCarritoDTO convertirDTO(DetalleCarrito detalle){
        DetalleCarritoDTO dto = new DetalleCarritoDTO();
        dto.setIdPlan(detalle.getIdPlan());
        dto.setCantidad(detalle.getCantidad());
        return dto;
    }

    public List<DetalleCarritoDTO> convertirListaDTO(List<DetalleCarrito> detalles){
        List<DetalleCarritoDTO> lista = new ArrayList<>();
        for (DetalleCarrito detalle : detalles) {
            DetalleCarritoDTO dto = convertirDTO(detalle);
            lista.add(dto);
        }
        return lista;
    }
}
