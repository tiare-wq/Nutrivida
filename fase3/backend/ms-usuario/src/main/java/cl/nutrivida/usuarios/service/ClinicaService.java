package cl.nutrivida.usuarios.service;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import cl.nutrivida.usuarios.dto.Datos;
import cl.nutrivida.usuarios.dto.DatosClinicos;
import cl.nutrivida.usuarios.entity.AsignacionPaciente;
import cl.nutrivida.usuarios.entity.Medicion;
import cl.nutrivida.usuarios.entity.Usuario;
import cl.nutrivida.usuarios.repository.Asignaciones;
import cl.nutrivida.usuarios.repository.Mediciones;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class ClinicaService {

    private final UsuariosService usuarios;
    private final Asignaciones asignaciones;
    private final Mediciones mediciones;

    public ClinicaService(
        UsuariosService usuarios,
        Asignaciones asignaciones,
        Mediciones mediciones
    ) {
        this.usuarios = usuarios;
        this.asignaciones = asignaciones;
        this.mediciones = mediciones;
    }

    public DatosClinicos.ProfesionalAsignado asignar(Long pacienteId, Long profesionalId) {
        Usuario paciente = usuarios.buscar(pacienteId);
        Usuario profesional = usuarios.buscar(profesionalId);

        if (!paciente.rol.equals("PACIENTE")) {
            throw new ResponseStatusException(NOT_FOUND, "Paciente no encontrado");
        }
        if (!profesional.rol.equals("PROFESIONAL") || !profesional.activo) {
            throw new ResponseStatusException(BAD_REQUEST, "Elige un profesional activo");
        }

        AsignacionPaciente asignacion = asignaciones
            .findByPacienteId(pacienteId)
            .orElseGet(AsignacionPaciente::new);
        asignacion.paciente = paciente;
        asignacion.profesional = profesional;
        asignaciones.saveAndFlush(asignacion);
        return tarjetaProfesional(profesional);
    }

    public DatosClinicos.ProfesionalAsignado profesionalAsignado(Long pacienteId) {
        return asignaciones
            .findByPacienteId(pacienteId)
            .map(asignacion -> tarjetaProfesional(asignacion.profesional))
            .orElse(null);
    }

    private DatosClinicos.ProfesionalAsignado tarjetaProfesional(Usuario profesional) {
        return new DatosClinicos.ProfesionalAsignado(
            profesional.id,
            profesional.nombre,
            profesional.especialidad
        );
    }

    public List<Datos.Vista> buscarPacientes(Long profesionalId, String termino) {
        String filtro = termino == null ? "" : termino.trim().toLowerCase(Locale.ROOT);
        return asignaciones
            .findByProfesionalId(profesionalId)
            .stream()
            .map(asignacion -> asignacion.paciente)
            .filter(paciente -> paciente.rol.equals("PACIENTE"))
            .filter(
                paciente ->
                    filtro.isBlank() ||
                    paciente.id.toString().equals(filtro) ||
                    paciente.nombre.toLowerCase(Locale.ROOT).contains(filtro) ||
                    normalizarRut(paciente.rut).contains(normalizarRut(filtro))
            )
            .map(Datos::vista)
            .toList();
    }

    private String normalizarRut(String rut) {
        return rut == null ? "" : rut.replaceAll("[.\\-\\s]", "").toUpperCase(Locale.ROOT);
    }

    public Usuario pacienteAsignado(Long profesionalId, Long pacienteId) {
        if (!asignaciones.existsByPacienteIdAndProfesionalId(pacienteId, profesionalId)) {
            throw new ResponseStatusException(
                FORBIDDEN,
                "El paciente no está asignado a este profesional"
            );
        }
        Usuario paciente = usuarios.buscar(pacienteId);
        if (!paciente.rol.equals("PACIENTE")) {
            throw new ResponseStatusException(NOT_FOUND, "Paciente no encontrado");
        }
        return paciente;
    }

    public List<DatosClinicos.VistaMedicion> historial(Long pacienteId) {
        return mediciones
            .findByPacienteIdOrderByFechaDescIdDesc(pacienteId)
            .stream()
            .map(DatosClinicos::vista)
            .toList();
    }

    public DatosClinicos.InformePaciente informe(Long pacienteId) {
        return new DatosClinicos.InformePaciente(
            Datos.vista(usuarios.buscar(pacienteId)),
            profesionalAsignado(pacienteId),
            historial(pacienteId)
        );
    }

    public DatosClinicos.VistaMedicion registrarMedicion(
        Usuario profesional,
        Long pacienteId,
        DatosClinicos.NuevaMedicion datos
    ) {
        Usuario paciente = pacienteAsignado(profesional.id, pacienteId);
        Medicion medicion = new Medicion();
        medicion.paciente = paciente;
        medicion.profesional = profesional;
        medicion.fecha = datos.fecha();
        medicion.estaturaCm = datos.estaturaCm();
        medicion.pesoKg = datos.pesoKg();
        medicion.cinturaCm = datos.cinturaCm();
        medicion.caderaCm = datos.caderaCm();
        return DatosClinicos.vista(mediciones.saveAndFlush(medicion));
    }

    public DatosClinicos.VistaMedicion editarMedicion(
        Long profesionalId,
        Long pacienteId,
        Long medicionId,
        DatosClinicos.NuevaMedicion datos
    ) {
        pacienteAsignado(profesionalId, pacienteId);
        Medicion medicion = medicionDelPaciente(pacienteId, medicionId);
        medicion.fecha = datos.fecha();
        medicion.estaturaCm = datos.estaturaCm();
        medicion.pesoKg = datos.pesoKg();
        medicion.cinturaCm = datos.cinturaCm();
        medicion.caderaCm = datos.caderaCm();
        return DatosClinicos.vista(mediciones.saveAndFlush(medicion));
    }

    public void eliminarMedicion(Long profesionalId, Long pacienteId, Long medicionId) {
        pacienteAsignado(profesionalId, pacienteId);
        mediciones.delete(medicionDelPaciente(pacienteId, medicionId));
    }

    private Medicion medicionDelPaciente(Long pacienteId, Long medicionId) {
        return mediciones
            .findById(medicionId)
            .filter(medicion -> medicion.paciente.id.equals(pacienteId))
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Medición no encontrada"));
    }
}
