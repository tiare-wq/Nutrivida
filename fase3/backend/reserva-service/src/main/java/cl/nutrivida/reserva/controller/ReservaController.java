package cl.nutrivida.reserva.controller;

import cl.nutrivida.reserva.dto.ReservaDto;
import cl.nutrivida.reserva.request.ReagendarRequest;
import cl.nutrivida.reserva.service.ReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reservas")
@RequiredArgsConstructor
@Slf4j
public class ReservaController {

    private final ReservaService reservaService;

    @GetMapping
    public ResponseEntity<Page<ReservaDto>> mostrarTodasLasReservas(
        @PageableDefault (size = 10, sort = {"fecha", "hora"}) @ParameterObject Pageable pageable
    ) {
        log.info("Inicia búsqueda de todas las reservas");

        Page<ReservaDto> resultado = reservaService.obtenerTodasLasReservas(pageable);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/paciente/{id}")
    public ResponseEntity<Page<ReservaDto>> mostrarTodasLasReservasPaciente(
        @PathVariable Long id,
         @PageableDefault (size = 10, sort = {"fecha", "hora"}) @ParameterObject Pageable pageable
    ) {
        log.info("Inicia búsqueda de todas las reservas asociadas a un cliente");

        Page<ReservaDto> resultado = reservaService.obtenerTodasLasReservasPaciente(id, pageable);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/reserva/{id}")
    public ResponseEntity<ReservaDto> obtenerReservaPorId(@PathVariable Long id) {
        ReservaDto resultado = reservaService.obtenerReservaPorId(id);
        return ResponseEntity.ok(resultado);
    }

    @PostMapping
    public ResponseEntity<ReservaDto> agregarReserva(
        @Valid ReservaDto reserva
    ) {
        ReservaDto resultado = reservaService.agregarReserva(reserva);
        return ResponseEntity.ok(resultado);
    }

    @PutMapping("/reserva/{id}")
    public ResponseEntity<ReservaDto> reagendarCita(
        @PathVariable Long id,
        @Valid @RequestBody ReagendarRequest request
        ) {

        ReservaDto resultado = reservaService.reagendar(id, request);
        return ResponseEntity.ok(resultado);
    }
}
