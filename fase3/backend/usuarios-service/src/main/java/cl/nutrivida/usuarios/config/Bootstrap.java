package cl.nutrivida.usuarios.config;

import cl.nutrivida.usuarios.dto.Datos;
import cl.nutrivida.usuarios.entity.Usuario;
import cl.nutrivida.usuarios.service.UsuariosService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Configuration
public class Bootstrap {

    @Bean
    @Order(1)
    CommandLineRunner admin(
        UsuariosService usuarios,
        @Value("${ADMIN_EMAIL:}") String email,
        @Value("${ADMIN_PASSWORD:}") String password,
        @Value("${ADMIN_NOMBRE:Administración NutriVida}") String nombre
    ) {
        return args -> {
            if (
                email.isBlank() ||
                password.isBlank() ||
                usuarios.porCorreo(email.toLowerCase(java.util.Locale.ROOT)).isPresent()
            ) {
                return;
            }
            Usuario administrador = usuarios.registrar(
                new Datos.Registro(
                    nombre,
                    "11.111.111-1",
                    java.time.LocalDate.of(1990, 1, 1),
                    "912345678",
                    email,
                    password
                )
            );
            usuarios.hacerAdmin(administrador.id);
        };
    }
}
