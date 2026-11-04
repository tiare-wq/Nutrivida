package cl.nutrivida.usuarios.service;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import cl.nutrivida.usuarios.dto.Datos;
import cl.nutrivida.usuarios.entity.Usuario;
import cl.nutrivida.usuarios.repository.Asignaciones;
import cl.nutrivida.usuarios.repository.Mediciones;
import cl.nutrivida.usuarios.repository.RefreshTokens;
import cl.nutrivida.usuarios.repository.Usuarios;
import java.time.LocalDate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class UsuariosService {

    final Usuarios usuariosRepository;
    final RefreshTokens refreshTokens;
    final Asignaciones asignaciones;
    final Mediciones mediciones;
    final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuariosService(
        Usuarios usuariosRepository,
        RefreshTokens refreshTokens,
        Asignaciones asignaciones,
        Mediciones mediciones
    ) {
        this.usuariosRepository = usuariosRepository;
        this.refreshTokens = refreshTokens;
        this.asignaciones = asignaciones;
        this.mediciones = mediciones;
    }

    public java.util.Optional<Usuario> porCorreo(String correo) {
        return usuariosRepository.findByCorreo(correo);
    }

    public boolean passwordValida(String raw, String hash) {
        return passwordEncoder.matches(raw, hash);
    }

    public java.util.List<Datos.Vista> listar() {
        return usuariosRepository
            .findAll()
            .stream()
            .filter(usuario -> usuario.rol.equals("PACIENTE"))
            .map(Datos::vista)
            .toList();
    }

    public void hacerAdmin(Long id) {
        Usuario administrador = buscar(id);
        administrador.rol = "ADMIN";
        administrador.cargo = "Administración";
    }

    public java.util.List<Datos.Vista> todos() {
        return usuariosRepository.findAll().stream().map(Datos::vista).toList();
    }

    public Datos.Vista editarAdministrador(Long id, Datos.PerfilAdministracion datos) {
        Usuario administrador = buscar(id);
        if (!administrador.rol.equals("ADMIN")) {
            throw new ResponseStatusException(NOT_FOUND, "Administrador no encontrado");
        }
        administrador.nombre = datos.nombre().trim();
        administrador.cargo = datos.cargo().trim();
        return Datos.vista(administrador);
    }

    public Datos.Vista permisos(Long actor, Long id, Datos.Permisos datos) {
        if (actor.equals(id)) {
            throw new ResponseStatusException(CONFLICT, "No puedes modificar tus propios permisos");
        }
        Usuario usuario = buscar(id);

        if (
            datos.rol().equals("PACIENTE") &&
            (usuario.rut == null || usuario.fechaNac == null || usuario.telefono == null)
        ) {
            throw new ResponseStatusException(
                CONFLICT,
                "Esta cuenta no tiene un perfil de paciente completo"
            );
        }

        if (
            usuario.rol.equals("PACIENTE") &&
            !datos.rol().equals("PACIENTE") &&
            !mediciones.findByPacienteIdOrderByFechaDescIdDesc(id).isEmpty()
        ) {
            throw new ResponseStatusException(
                CONFLICT,
                "Conserva el rol del paciente que tiene mediciones; crea otra cuenta para el personal"
            );
        }

        if (datos.rol().equals("PROFESIONAL")) {
            String especialidad =
                datos.especialidad() == null ? usuario.especialidad : datos.especialidad().trim();
            if (especialidad == null || especialidad.isBlank()) {
                throw new ResponseStatusException(
                    BAD_REQUEST,
                    "Indica la especialidad del profesional"
                );
            }
            usuario.especialidad = especialidad;
        }

        if (datos.rol().equals("ADMIN")) {
            usuario.cargo =
                datos.cargo() == null || datos.cargo().isBlank()
                    ? "Administración"
                    : datos.cargo().trim();
        }

        if (!datos.rol().equals("PROFESIONAL") || !datos.activo()) {
            asignaciones.deleteByProfesionalId(id);
        }
        if (!datos.rol().equals("PACIENTE")) {
            asignaciones.deleteByPacienteId(id);
        }
        usuario.rol = datos.rol();
        usuario.activo = datos.activo();
        usuario.versionSesion++;
        refreshTokens.deleteByUsuarioId(id);
        return Datos.vista(usuario);
    }

    public Usuario buscar(Long id) {
        return usuariosRepository
            .findById(id)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Usuario no encontrado"));
    }

    public Usuario registrar(Datos.Registro datos) {
        validarPassword(datos.password());
        Usuario usuario = new Usuario();
        actualizar(
            usuario,
            new Datos.Perfil(
                datos.nombre(),
                datos.rut(),
                datos.fechaNac(),
                datos.telefono(),
                datos.correo()
            )
        );
        usuario.passwordHash = passwordEncoder.encode(datos.password());
        return usuariosRepository.saveAndFlush(usuario);
    }

    public void cambiarPassword(Long usuarioId, String actual, String nueva) {
        Usuario usuario = buscar(usuarioId);
        if (!passwordValida(actual, usuario.passwordHash)) {
            throw new ResponseStatusException(BAD_REQUEST, "La contraseña actual no es correcta");
        }
        if (actual.equals(nueva)) {
            throw new ResponseStatusException(
                BAD_REQUEST,
                "La contraseña nueva debe ser distinta de la actual"
            );
        }
        guardarPassword(usuario, nueva);
    }

    public void restablecerPassword(Long usuarioId, String nueva) {
        guardarPassword(buscar(usuarioId), nueva);
    }

    private void guardarPassword(Usuario usuario, String nueva) {
        validarPassword(nueva);
        usuario.passwordHash = passwordEncoder.encode(nueva);
        usuario.versionSesion++;
        refreshTokens.deleteByUsuarioId(usuario.id);
    }

    private void validarPassword(String password) {
        if (
            password.getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 72 ||
            !password.matches("(?s).*[A-Za-z].*") ||
            !password.matches("(?s).*[0-9].*")
        ) {
            throw new ResponseStatusException(
                BAD_REQUEST,
                "Contraseña requiere letras y números y máximo 72 bytes"
            );
        }
    }

    public Usuario crearProfesional(Datos.AltaProfesional datos) {
        validarPassword(datos.password());
        Usuario profesional = new Usuario();
        profesional.rol = "PROFESIONAL";
        actualizarProfesional(
            profesional,
            new Datos.PerfilProfesional(datos.nombre(), datos.especialidad(), datos.correo())
        );
        profesional.passwordHash = passwordEncoder.encode(datos.password());
        return usuariosRepository.saveAndFlush(profesional);
    }

    public Usuario editarProfesional(Long id, Datos.PerfilProfesional datos) {
        Usuario profesional = buscar(id);
        if (!profesional.rol.equals("PROFESIONAL")) {
            throw new ResponseStatusException(NOT_FOUND, "Profesional no encontrado");
        }
        actualizarProfesional(profesional, datos);
        return usuariosRepository.saveAndFlush(profesional);
    }

    private void actualizarProfesional(Usuario profesional, Datos.PerfilProfesional datos) {
        String correo = datos.correo().trim().toLowerCase(java.util.Locale.ROOT);
        Long id = profesional.id == null ? -1L : profesional.id;
        if (usuariosRepository.existsByCorreoAndIdNot(correo, id)) {
            throw new ResponseStatusException(CONFLICT, "Correo ya registrado");
        }
        profesional.nombre = datos.nombre().trim();
        profesional.correo = correo;
        profesional.especialidad = datos.especialidad().trim();
    }

    public void desactivarProfesional(Long id) {
        Usuario profesional = buscar(id);
        if (!profesional.rol.equals("PROFESIONAL")) {
            throw new ResponseStatusException(NOT_FOUND, "Profesional no encontrado");
        }
        profesional.activo = false;
        profesional.versionSesion++;
        refreshTokens.deleteByUsuarioId(id);
        asignaciones.deleteByProfesionalId(id);
    }

    public Usuario editar(Long id, Datos.Perfil datos) {
        Usuario usuario = buscar(id);
        actualizar(usuario, datos);
        return usuariosRepository.saveAndFlush(usuario);
    }

    void actualizar(Usuario usuario, Datos.Perfil datos) {
        String rut = datos.rut().replace(".", "").toUpperCase().trim();
        if (!rutValido(rut)) {
            throw new ResponseStatusException(BAD_REQUEST, "RUT inválido");
        }
        if (datos.fechaNac().isAfter(LocalDate.now().minusYears(14))) {
            throw new ResponseStatusException(BAD_REQUEST, "Edad mínima 14 años");
        }
        String telefono = datos.telefono().replace(" ", "").replace("+56", "");
        if (!telefono.matches("9[0-9]{8}")) {
            throw new ResponseStatusException(
                BAD_REQUEST,
                "Teléfono debe contener 9 dígitos y comenzar con 9"
            );
        }
        String correo = datos.correo().trim().toLowerCase(java.util.Locale.ROOT);
        Long id = usuario.id == null ? -1L : usuario.id;
        if (
            usuariosRepository.existsByCorreoAndIdNot(correo, id) ||
            usuariosRepository.existsByRutAndIdNot(rut, id)
        ) {
            throw new ResponseStatusException(CONFLICT, "Correo o RUT ya registrado");
        }
        usuario.nombre = datos.nombre().trim();
        usuario.rut = rut;
        usuario.fechaNac = datos.fechaNac();
        usuario.telefono = telefono;
        usuario.correo = correo;
    }

    static boolean rutValido(String rut) {
        if (!rut.matches("[0-9]{7,8}-[0-9K]")) {
            return false;
        }
        String cuerpo = rut.substring(0, rut.length() - 2);
        int suma = 0,
            multiplicador = 2;
        for (int indice = cuerpo.length() - 1; indice >= 0; indice--) {
            suma += (cuerpo.charAt(indice) - '0') * multiplicador;
            multiplicador = multiplicador == 7 ? 2 : multiplicador + 1;
        }
        int digitoVerificador = 11 - (suma % 11);
        String esperado =
            digitoVerificador == 11
                ? "0"
                : digitoVerificador == 10
                  ? "K"
                  : String.valueOf(digitoVerificador);
        return rut.endsWith("-" + esperado);
    }

    public void eliminar(Long id) {
        Usuario usuario = buscar(id);
        if (!usuario.rol.equals("PACIENTE")) {
            throw new ResponseStatusException(
                CONFLICT,
                "No se elimina al administrador por esta API"
            );
        }
        refreshTokens.deleteByUsuarioId(id);
        mediciones.deleteByPacienteId(id);
        asignaciones.deleteByPacienteId(id);
        usuariosRepository.delete(usuario);
    }
}
