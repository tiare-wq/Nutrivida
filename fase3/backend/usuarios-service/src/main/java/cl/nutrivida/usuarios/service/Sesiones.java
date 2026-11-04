package cl.nutrivida.usuarios.service;

import static org.springframework.http.HttpStatus.TOO_MANY_REQUESTS;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import cl.nutrivida.usuarios.dto.Datos;
import cl.nutrivida.usuarios.entity.RefreshToken;
import cl.nutrivida.usuarios.entity.Usuario;
import cl.nutrivida.usuarios.repository.RefreshTokens;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class Sesiones {

    final UsuariosService usuarios;
    final RefreshTokens refreshTokens;
    final JwtEncoder jwtEncoder;
    private final Map<String, Intentos> intentos = new ConcurrentHashMap<>();

    public Sesiones(
        UsuariosService usuarios,
        RefreshTokens refreshTokens,
        @Value("${app.jwt-secret}") String secreto
    ) {
        this.usuarios = usuarios;
        this.refreshTokens = refreshTokens;
        jwtEncoder = new NimbusJwtEncoder(
            new ImmutableSecret<>(secreto.getBytes(java.nio.charset.StandardCharsets.UTF_8))
        );
    }

    private static final int MAX_INTENTOS = 5;
    private static final Duration BLOQUEO = Duration.ofMinutes(15);

    private record Intentos(int fallos, Instant bloqueadoHasta) {}

    public record Resultado(String accessToken, Datos.Vista usuario, String refresh) {}

    public Resultado login(Datos.Login datos) {
        String correo = datos.correo().trim().toLowerCase(Locale.ROOT);
        verificarBloqueo(correo);
        Usuario usuario = usuarios.porCorreo(correo).orElse(null);
        if (
            usuario == null ||
            !usuario.activo ||
            !usuarios.passwordValida(datos.password(), usuario.passwordHash)
        ) {
            registrarFallo(correo);
            throw new ResponseStatusException(UNAUTHORIZED, "Credenciales incorrectas");
        }
        intentos.remove(correo);
        return emitir(usuario);
    }

    private void verificarBloqueo(String correo) {
        Intentos estado = intentos.get(correo);
        if (
            estado != null &&
            estado.bloqueadoHasta() != null &&
            estado.bloqueadoHasta().isAfter(Instant.now())
        ) {
            throw new ResponseStatusException(
                TOO_MANY_REQUESTS,
                "Demasiados intentos fallidos. Intenta de nuevo en 15 minutos"
            );
        }
    }

    private void registrarFallo(String correo) {
        if (intentos.size() > 10_000) {
            intentos.clear();
        }
        intentos.merge(correo, new Intentos(1, null), (previo, nuevo) -> {
            boolean vencido =
                previo.bloqueadoHasta() != null && !previo.bloqueadoHasta().isAfter(Instant.now());
            int fallos = vencido ? 1 : previo.fallos() + 1;
            return new Intentos(
                fallos,
                fallos >= MAX_INTENTOS ? Instant.now().plus(BLOQUEO) : null
            );
        });
    }

    public Resultado emitir(Usuario usuario) {
        Instant ahora = Instant.now();
        var claims = JwtClaimsSet.builder()
            .issuer("nutrivida-usuarios")
            .subject(usuario.id.toString())
            .issuedAt(ahora)
            .expiresAt(ahora.plusSeconds(900))
            .claim("roles", List.of(usuario.rol))
            .claim("ver", usuario.versionSesion)
            .build();
        String jwt = jwtEncoder
            .encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims))
            .getTokenValue();
        byte[] bytes = new byte[48];
        new SecureRandom().nextBytes(bytes);
        String tokenRenovacion = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        RefreshToken tokenPersistido = new RefreshToken();
        tokenPersistido.hash = hash(tokenRenovacion);
        tokenPersistido.usuario = usuario;
        tokenPersistido.expira = ahora.plus(Duration.ofDays(7));
        refreshTokens.save(tokenPersistido);
        return new Resultado(jwt, Datos.vista(usuario), tokenRenovacion);
    }

    public Resultado renovar(String tokenRenovacion) {
        RefreshToken tokenPersistido = refreshTokens
            .locked(hash(tokenRenovacion))
            .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "Sesión inválida"));
        if (tokenPersistido.expira.isBefore(Instant.now()) || !tokenPersistido.usuario.activo) {
            throw new ResponseStatusException(UNAUTHORIZED, "Sesión vencida");
        }
        Usuario usuario = tokenPersistido.usuario;
        refreshTokens.delete(tokenPersistido);
        refreshTokens.flush();
        return emitir(usuario);
    }

    public void salir(String tokenRenovacion) {
        refreshTokens.locked(hash(tokenRenovacion)).ifPresent(tokenPersistido -> {
            tokenPersistido.usuario.versionSesion++;
            refreshTokens.deleteByUsuarioId(tokenPersistido.usuario.id);
        });
    }

    public Usuario actual(Jwt jwt) {
        Usuario usuario = usuarios.buscar(Long.valueOf(jwt.getSubject()));
        Number version = jwt.getClaim("ver");
        if (!usuario.activo || version == null || version.longValue() != usuario.versionSesion) {
            throw new ResponseStatusException(UNAUTHORIZED, "Sesión cerrada");
        }
        return usuario;
    }

    static String hash(String tokenRenovacion) {
        try {
            return HexFormat.of().formatHex(
                MessageDigest.getInstance("SHA-256").digest(
                    tokenRenovacion.getBytes(java.nio.charset.StandardCharsets.UTF_8)
                )
            );
        } catch (NoSuchAlgorithmException error) {
            throw new IllegalStateException(error);
        }
    }
}
