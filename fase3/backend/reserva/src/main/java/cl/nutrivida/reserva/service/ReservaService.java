package cl.nutrivida.reserva.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import cl.nutrivida.reserva.client.ServicioFeignClient;
import cl.nutrivida.reserva.client.UsuarioFeignClient;
import cl.nutrivida.reserva.client.model.PacienteClient;
import cl.nutrivida.reserva.client.model.ProfesionalClient;
import cl.nutrivida.reserva.dto.ReservaDto;
import cl.nutrivida.reserva.exception.ResourceNotFoundException;
import cl.nutrivida.reserva.mapper.ReservaMapper;
import cl.nutrivida.reserva.entity.Reserva;
import cl.nutrivida.reserva.repository.ReservaRepository;
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

    public ReservaDto agregarReserva(ReservaDto dto) {
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
        return reservaMapper.toReservaDto(
                reservaRepository.save(nuevaReserva),
                dto.getNombrePaciente(),
                dto.getRunPaciente(),
                dto.getNombreProfesional());
    }

    // ---------------------------------
    // READ
    // ---------------------------------

    public ReservaDto obtenerReservaPorId(Long id) {
        log.info("Inicia búsqueda de nueva reserva. ID {}", id);

        Reserva resultado = reservaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encuentra la reserva con el id" + id));

        log.info("Conectando ms usuario");
        PacienteClient paciente = usuarioFeignClient.obtenerPaciente(resultado.getIdPaciente());

        log.debug("Paciente: {}", paciente);
        ProfesionalClient profesional = usuarioFeignClient.obtenerProfesional(resultado.getIdProfesional());
        log.debug("Profesional_ {}", profesional);

        return reservaMapper.toReservaDto(
                resultado,
                paciente.getNombre(),
                paciente.getRun(),
                profesional.getNombre());
    }

    public Page<ReservaDto> obtnenerTodasLasReservas(Pageable pageable) {
        return reservaRepository.findAll(pageable)
                .map(reserva -> {
                    PacienteClient paciente = usuarioFeignClient.obtenerPaciente(reserva.getIdPaciente());
                    ProfesionalClient profesional = usuarioFeignClient.obtenerProfesional(reserva.getIdProfesional());
                    return reservaMapper.toReservaDto(
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