package org.nutrivida.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.nutrivida.backend.dto.ReservaDTO;
import org.nutrivida.backend.entity.Reserva;

@Mapper(componentModel = "spring")
public interface ReservaMapper {

    @Mapping(target = "idPaciente", source = "idPaciente")
    @Mapping(target = "idProfesional", source = "idProfesional")

    @Mapping(target = "nombrePaciente", source = "nombrePaciente")
    @Mapping(target = "runPaciente", source = "runPaciente")
    @Mapping(target = "nombreProfesional", source = "nombreProfesional")

    ReservaDTO toReservaDTO(
            Reserva entity,
            String nombrePaciente,
            String runPaciente,
            String nombreProfesional);

    Reserva toEntity(
            ReservaDTO dto,
            Long idPaciente,
            Long idProfesional);
}
