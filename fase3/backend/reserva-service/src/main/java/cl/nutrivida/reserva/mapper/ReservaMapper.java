package cl.nutrivida.reserva.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import cl.nutrivida.reserva.dto.ReservaDto;
import cl.nutrivida.reserva.entity.Reserva;

@Mapper(componentModel = "spring")
public interface ReservaMapper {

    ReservaDto toDto(
            Reserva entity,
            String nombrePaciente,
            String runPaciente,
            String nombreProfesional);

    Reserva toEntity(
            ReservaDto dto,
            Long idPaciente,
            Long idProfesional);
}
