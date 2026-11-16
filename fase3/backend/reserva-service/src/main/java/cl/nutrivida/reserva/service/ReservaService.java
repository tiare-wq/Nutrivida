package cl.nutrivida.reserva.service;

import cl.nutrivida.reserva.entity.TipoPaciente;
import cl.nutrivida.reserva.exception.PermisosInsuficientesException;
import cl.nutrivida.reserva.request.ReagendarRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
//import cl.nutrivida.reserva.client.ServicioFeignClient;
import cl.nutrivida.reserva.client.UsuarioFeignClient;
import cl.nutrivida.reserva.client.model.PacienteClient;
import cl.nutrivida.reserva.client.model.ProfesionalClient;
import cl.nutrivida.reserva.dto.ReservaDto;
import cl.nutrivida.reserva.exception.ResourceNotFoundException;
import cl.nutrivida.reserva.mapper.ReservaMapper;
import cl.nutrivida.reserva.entity.Reserva;
import cl.nutrivida.reserva.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@ConfigurationProperties(prefix = "reserva")
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ReservaService {

    private final ReservaMapper reservaMapper;
    private final ReservaRepository reservaRepository;
    //private final ServicioFeignClient servicioFeignClient;
    private final UsuarioFeignClient usuarioFeignClient;
    private final JavaMailSender emailSender;

    @Value("${reserva.anticipacion-maxima-meses}")
    private Integer anticipacionMaximaMeses;

    @Value("${reserva.horario.apertura}")
    private LocalTime apertura;

    @Value("${reserva.horario.cierre}")
    private LocalTime cierre;

    private NumberFormat moneda = NumberFormat.getCurrencyInstance();
    // ---------------------------------
    // CREATE
    // ---------------------------------

    public ReservaDto agregarReserva(ReservaDto dto, String correo, Long pacienteID) {

        LocalDateTime hoy = LocalDateTime.now();

        if (dto.getFecha().isBefore(hoy))
            throw new IllegalArgumentException("La fecha de la reserva no puede ser anterior a la actual");
        else if (dto.getFecha().isAfter(hoy.plusMonths(anticipacionMaximaMeses)))
            throw new IllegalArgumentException("Seleccione una fecha dentro del rango de seis meses");

        if (dto.getFecha().toLocalTime().isBefore(apertura) || dto.getFecha().toLocalTime().isAfter(cierre))
            throw new IllegalArgumentException("La hora seleccionada está fuera del horario de atención");

        if (horaOcupada(dto.getFecha()))
            throw new IllegalArgumentException("La hora seleccionada está ocupada. Por favor, seleccione otra");

        // Inicia validación y obtención de datos con ms
        log.debug("Validar si se encuentra el servicio");
        /*if (!servicioFeignClient.findServicioByName(dto.getNombreServicio()))
            throw new ResourceNotFoundException("No se encuentra el servicio con el nombre: " + dto.getNombreServicio());*/

        log.debug("Obtener id de profesional {}", dto.getRunProfesional());
        Long idProfesional = usuarioFeignClient.obtenerProfesionalPorRun(dto.getRunProfesional());
        if (idProfesional == null)
            throw new ResourceNotFoundException("No se encuentra el profesional con el RUN: " + dto.getRunProfesional());

        Long codigo = generarCodigo();
        dto.setCodigo(codigo);

        Reserva nuevaReserva = reservaMapper.toEntity(dto, pacienteID, idProfesional);

        enviarCorreo(nuevaReserva, correo);

        log.info("Nueva reserva agregada con éxito {}", nuevaReserva.getId());
        return convertirReservaADto(nuevaReserva);
    }

    private Boolean horaOcupada(LocalDateTime fecha) {
        return reservaRepository.existsByFecha(fecha);
    }

    // ---------------------------------
    // READ
    // ---------------------------------

    public ReservaDto obtenerReservaPorId(Long id) {
        log.info("Inicia búsqueda de nueva reserva. ID {}", id);

        Reserva entity = reservaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encuentra la reserva con el id" + id));

        return convertirReservaADto(entity);
    }

    public Page<ReservaDto> obtenerTodasLasReservasPaciente(Long idPaciente, Long idActual, Pageable pageable) {
        if (!idPaciente.equals(idActual))
            throw new PermisosInsuficientesException("No tiene permisos suficientes para ver las reservas de este paciente.");
        return reservaRepository.findAllByIdPaciente(idPaciente, pageable)
            .map(this::convertirReservaADto);
    }

    public Page<ReservaDto> obtenerTodasLasReservasPacienteDeProfesional(Long id, Pageable pageable) {
        return reservaRepository.findAllByIdPaciente(id, pageable)
            .map(this::convertirReservaADto);
    }

    public Page<ReservaDto> obtenerTodasLasReservas(Pageable pageable) {
        return reservaRepository.findAll(pageable)
                .map(this::convertirReservaADto);
    }

    // ---------------------------------
    // UPDATE
    // ---------------------------------

    public ReservaDto reagendar(Long id, ReagendarRequest request) {

        log.info("Inicia reagendar hora");
        log.debug("ID: {}, nuevaFecha: {}", id, request.getFecha());

        if (request.getFecha().isBefore(LocalDateTime.now()))
            throw new IllegalArgumentException("Elija una fecha y hora válida");

        if (horaOcupada(request.getFecha()))
            throw new IllegalArgumentException("La hora seleccionada está ocupada. Por favor, seleccione otra");

        Reserva entity = reservaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encuentra la reserva con el id " + id));

        entity.setFecha(request.getFecha());
        reservaRepository.save(entity);

        return convertirReservaADto(entity);
    }

    // ---------------------------------
    // ELIMINAR
    // ---------------------------------

    public void eliminarReserva(Long id) {
        Reserva reserva = reservaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("No se encuentra la reserva con el id " + id));

        reservaRepository.delete(reserva);
        log.debug("ReservaPaciente eliminada correctamente. ID {}", id);
    }

    // ---------------------------------
    // MAPPER MÉTODOS
    // ---------------------------------

    private ReservaDto convertirReservaADto(Reserva reserva) {

        PacienteClient paciente = usuarioFeignClient.obtenerPacientePorId(reserva.getIdPaciente());

        ProfesionalClient profesional =
            usuarioFeignClient.obtenerProfesionalPorId(reserva.getIdProfesional());

        return reservaMapper.toDto(
            reserva,
            paciente.getNombre(),
            paciente.getRun(),
            profesional.getNombre()
        );
    }

    // ---------------------------------
    // ENVIAR MENSAJE DE CONFIRMACIÓN
    // ---------------------------------
    @Async
    private void enviarCorreo(Reserva reserva, String destinatario) {
        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setTo(destinatario);
            mensaje.setSubject("Cita agendada - Nutrivida");
            mensaje.setText(
                "¡Tu cita ha sido agendada exitosamente!\n\n" +
                    "Código: " + reserva.getCodigo() + "\n" +
                    "Fecha: " + reserva.getFecha().toLocalDate() + "\n" +
                    "Hora: " + reserva.getFecha().toLocalTime() + " hrs.\n" +
                    "Servicio: " + reserva.getNombreServicio() + "\n" +
                    "Valor: $" + moneda.format(reserva.getPrecio())
            );
            emailSender.send(mensaje);
        } catch (Exception e) {
            new Exception(e);
        }
    }

    public Long generarCodigo() {
        return Math.round(Math.random() * Math.pow(10, 12));
    }
}
