package cl.nutrivida.usuarios.controller;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import cl.nutrivida.usuarios.dto.Datos;
import cl.nutrivida.usuarios.dto.DatosClinicos;
import cl.nutrivida.usuarios.entity.Usuario;
import cl.nutrivida.usuarios.service.ClinicaService;
import cl.nutrivida.usuarios.service.Sesiones;
import cl.nutrivida.usuarios.service.UsuariosService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/profesionales")
@SecurityRequirement(name = "bearerAuth")
public class ProfesionalesController {

    private final Sesiones sesiones;
    private final UsuariosService usuarios;
    private final ClinicaService clinica;

    public ProfesionalesController(
        Sesiones sesiones,
        UsuariosService usuarios,
        ClinicaService clinica
    ) {
        this.sesiones = sesiones;
        this.usuarios = usuarios;
        this.clinica = clinica;
    }

    private Usuario profesional(Jwt token) {
        Usuario usuario = sesiones.actual(token);
        if (!usuario.rol.equals("PROFESIONAL")) {
            throw new ResponseStatusException(FORBIDDEN, "Requiere rol PROFESIONAL");
        }
        return usuario;
    }

    @GetMapping("/me")
    public Datos.Vista perfil(@AuthenticationPrincipal Jwt token) {
        return Datos.vista(profesional(token));
    }

    @GetMapping("/pacientes")
    public List<Datos.Vista> buscar(
        @AuthenticationPrincipal Jwt token,
        @RequestParam(defaultValue = "") String buscar
    ) {
        return clinica.buscarPacientes(profesional(token).id, buscar);
    }

    @GetMapping("/pacientes/{id}")
    public DatosClinicos.InformePaciente informe(
        @AuthenticationPrincipal Jwt token,
        @PathVariable Long id
    ) {
        clinica.pacienteAsignado(profesional(token).id, id);
        return clinica.informe(id);
    }

    @PutMapping("/pacientes/{id}")
    public Datos.Vista editarPaciente(
        @AuthenticationPrincipal Jwt token,
        @PathVariable Long id,
        @Valid @RequestBody Datos.Perfil datos
    ) {
        clinica.pacienteAsignado(profesional(token).id, id);
        return Datos.vista(usuarios.editar(id, datos));
    }

    @GetMapping("/pacientes/{id}/mediciones")
    public List<DatosClinicos.VistaMedicion> mediciones(
        @AuthenticationPrincipal Jwt token,
        @PathVariable Long id
    ) {
        clinica.pacienteAsignado(profesional(token).id, id);
        return clinica.historial(id);
    }

    @PostMapping("/pacientes/{id}/mediciones")
    @ResponseStatus(CREATED)
    public DatosClinicos.VistaMedicion registrar(
        @AuthenticationPrincipal Jwt token,
        @PathVariable Long id,
        @Valid @RequestBody DatosClinicos.NuevaMedicion datos
    ) {
        return clinica.registrarMedicion(profesional(token), id, datos);
    }

    @PutMapping("/pacientes/{id}/mediciones/{medicionId}")
    public DatosClinicos.VistaMedicion editarMedicion(
        @AuthenticationPrincipal Jwt token,
        @PathVariable Long id,
        @PathVariable Long medicionId,
        @Valid @RequestBody DatosClinicos.NuevaMedicion datos
    ) {
        return clinica.editarMedicion(profesional(token).id, id, medicionId, datos);
    }

    @DeleteMapping("/pacientes/{id}/mediciones/{medicionId}")
    @ResponseStatus(NO_CONTENT)
    public void eliminarMedicion(
        @AuthenticationPrincipal Jwt token,
        @PathVariable Long id,
        @PathVariable Long medicionId
    ) {
        clinica.eliminarMedicion(profesional(token).id, id, medicionId);
    }
}
