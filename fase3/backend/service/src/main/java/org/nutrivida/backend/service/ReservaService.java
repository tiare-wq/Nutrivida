package org.nutrivida.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.nutrivida.backend.client.ServicioFeignClient;
import org.nutrivida.backend.client.UsuarioFeignClient;
import org.nutrivida.backend.client.model.PacienteClient;
import org.nutrivida.backend.client.model.ProfesionalClient;
import org.nutrivida.backend.dto.ReservaDTO;
import org.nutrivida.backend.exception.ResourceNotFoundException;
import org.nutrivida.backend.mapper.ReservaMapper;
import org.nutrivida.backend.entity.Reserva;
import org.nutrivida.backend.repository.ReservaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaMapper reservaMapper;
    private final ReservaRepository reservaRepository;
    private final ServicioFeignClient servicioFeignClient;
    private final UsuarioFeignClient usuarioFeignClient;

    // ---------------------------------
    // CREATE
    // ---------------------------------

    public ReservaDTO agregarReserva(ReservaDTO dto) {
        log.info("Agregar nueva reserva {}", dto);

        LocalDate hoy = LocalDate.now();
        LocalDate limit = hoy.plusMonths(6);
        LocalTime apertura = LocalTime.parse("08:00");
        LocalTime cierre = LocalTime.parse("21:00");

        if (dto.getFecha().isBefore(hoy))
            throw new IllegalArgumentException("La fecha de la reserva no puede ser anterior a la actual");
        else if (dto.getFecha().isAfter(limit))
            throw new IllegalArgumentException("Seleccione una fecha dentro del rango de seis meses");

        if (!(dto.getHora().isAfter(apertura) && dto.getHora().isBefore(cierre)))
            throw new IllegalArgumentException("La hora seleccionada está fuera del horario de atención");

        // Inicia validación y obtención de datos con ms
        log.debug("Validar si se encuentra el servicio");
        if (!servicioFeignClient.findServicioByName(dto.getNombreServicio()))
            throw new ResourceNotFoundException("No se encuentra el servicio con el nombre: " + dto.getNombreServicio());

        log.debug("Obtener id de paciente {}", dto.getRunPaciente());
        Long idPaciente = usuarioFeignClient.obtenerPacienteId(dto.getRunPaciente());

        log.debug("Obtener id de profesional {}", dto.getRunProfesional());
        Long idProfesional = usuarioFeignClient.obtenerProfesionalId(dto.getRunProfesional());

        Reserva nuevaReserva = reservaMapper.toEntity(dto, idPaciente, idProfesional);
        return reservaMapper.toReservaDTO(
                reservaRepository.save(nuevaReserva),
                dto.getNombrePaciente(),
                dto.getRunPaciente(),
                dto.getNombreProfesional());
    }

    // ---------------------------------
    // READ
    // ---------------------------------

    public ReservaDTO obtenerReservaPorId(Long id) {
        log.info("Inicia búsqueda de nueva reserva. ID {}", id);

        Reserva resultado = reservaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encuentra la reserva con el id" + id));

        log.info("Conectando ms usuario");
        PacienteClient paciente = usuarioFeignClient.obtenerPaciente(resultado.getIdPaciente());

        log.debug("Paciente: {}", paciente);
        ProfesionalClient profesional = usuarioFeignClient.obtenerProfesional(resultado.getIdProfesional());
        log.debug("Profesional_ {}", profesional);

        return reservaMapper.toReservaDTO(
                resultado,
                paciente.getNombre(),
                paciente.getRun(),
                profesional.getNombre());
    }

    public Page<ReservaDTO> obtnenerTodasLasReservas(Pageable pageable) {
        return reservaRepository.findAll(pageable)
                .map(reserva -> {
                    PacienteClient paciente = usuarioFeignClient.obtenerPaciente(reserva.getIdPaciente());
                    ProfesionalClient profesional = usuarioFeignClient.obtenerProfesional(reserva.getIdProfesional());
                    return reservaMapper.toReservaDTO(
                            reserva,
                            paciente.getNombre(),
                            paciente.getRun(),
                            profesional.getNombre()
                    );
                });
    }

    // ---------------------------------
    // UPDATE
    // ---------------------------------
}
