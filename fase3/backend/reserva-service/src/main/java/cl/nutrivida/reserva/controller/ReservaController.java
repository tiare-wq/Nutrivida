package cl.nutrivida.reserva.controller;

import cl.nutrivida.reserva.dto.ReservaDto;
import cl.nutrivida.reserva.request.ReagendarRequest;
import cl.nutrivida.reserva.service.ReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/v1/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;

    @GetMapping
    public ResponseEntity<Page<ReservaDto>> mostrarTodasLasReservas(
        @PageableDefault (size = 10, sort = {"fecha", "hora"}) @ParameterObject Pageable pageable
    ) {

        Page<ReservaDto> resultado = reservaService.obtenerTodasLasReservas(pageable);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/me/{id}")
    public ResponseEntity<Page<ReservaDto>> mostrarTodasLasReservasPaciente(
        @AuthenticationPrincipal Jwt token,
        @PathVariable Long id,
         @PageableDefault (size = 10, sort = {"fecha", "hora"}) @ParameterObject Pageable pageable
    ) {

        Long idActual = Long.parseLong(token.getSubject());

        Page<ReservaDto> resultado = reservaService.obtenerTodasLasReservasPaciente(id, idActual, pageable);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/paciente/{id}")
    public ResponseEntity<Page<ReservaDto>> mostrarTodasLasReservasPacienteDeProfesional(
        @PathVariable Long id,
        @PageableDefault (size = 10, sort = {"fecha", "hora"}) @ParameterObject Pageable pageable
    ) {

        Page<ReservaDto> resultado = reservaService.obtenerTodasLasReservasPacienteDeProfesional(id, pageable);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaDto> obtenerReservaPorId(@PathVariable Long id) {
        ReservaDto resultado = reservaService.obtenerReservaPorId(id);
        return ResponseEntity.ok(resultado);
    }

    @PostMapping("/{correo}")
    public ResponseEntity<ReservaDto> agregarReserva(
        @AuthenticationPrincipal Jwt token,
        @Valid @RequestBody ReservaDto reserva,
        @PathVariable String correo
    ) {
        Long pacienteID = Long.parseLong(token.getSubject());
        ReservaDto resultado = reservaService.agregarReserva(reserva, correo, pacienteID);
        return ResponseEntity.status(HttpStatus.CREATED).body(resultado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservaDto> reagendarCita(
        @PathVariable Long id,
        @Valid @RequestBody ReagendarRequest request
        ) {

        ReservaDto resultado = reservaService.reagendar(id, request);
        return ResponseEntity.ok(resultado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ReservaDto> eliminarReserva(
        @PathVariable Long id,
        @Valid @RequestBody ReagendarRequest request
    ) {
        reservaService.eliminarReserva(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
