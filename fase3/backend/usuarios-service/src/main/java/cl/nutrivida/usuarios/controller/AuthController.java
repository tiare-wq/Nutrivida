package cl.nutrivida.usuarios.controller;

import cl.nutrivida.usuarios.dto.Datos;
import cl.nutrivida.usuarios.service.Sesiones;
import cl.nutrivida.usuarios.service.UsuariosService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    final Sesiones sesiones;
    final UsuariosService usuarios;
    final boolean secure;

    public AuthController(
        Sesiones resultado,
        UsuariosService u,
        @Value("${app.cookie-secure:false}") boolean secure
    ) {
        sesiones = resultado;
        usuarios = u;
        this.secure = secure;
    }

    void cookie(HttpServletResponse respuesta, String value, long days) {
        respuesta.addHeader(
            HttpHeaders.SET_COOKIE,
            ResponseCookie.from("nv_refresh", value)
                .httpOnly(true)
                .secure(secure)
                .sameSite("Strict")
                .path("/api/auth")
                .maxAge(Duration.ofDays(days))
                .build()
                .toString()
        );
        respuesta.setHeader("Cache-Control", "no-store");
    }

    Object respuesta(Sesiones.Resultado resultado, HttpServletResponse respuesta) {
        cookie(respuesta, resultado.refresh(), 7);
        return java.util.Map.of(
            "accessToken",
            resultado.accessToken(),
            "usuario",
            resultado.usuario()
        );
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public Object registro(
        @Valid @RequestBody Datos.Registro datos,
        HttpServletResponse respuesta
    ) {
        return respuesta(sesiones.emitir(usuarios.registrar(datos)), respuesta);
    }

    @PostMapping("/login")
    public Object login(@Valid @RequestBody Datos.Login datos, HttpServletResponse respuesta) {
        return respuesta(sesiones.login(datos), respuesta);
    }

    @PostMapping("/refresh")
    public Object refresh(
        @CookieValue(name = "nv_refresh", defaultValue = "") String token,
        HttpServletResponse respuesta
    ) {
        return respuesta(sesiones.renovar(token), respuesta);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(
        @CookieValue(name = "nv_refresh", defaultValue = "") String token,
        HttpServletResponse respuesta
    ) {
        sesiones.salir(token);
        cookie(respuesta, "", 0);
    }
}
