package cl.nutrivida.usuarios.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class RutValidationTest {

    @Test
    void rutModuloOnce() {
        assertTrue(UsuariosService.rutValido("12345678-5"));
        assertFalse(UsuariosService.rutValido("12345678-9"));
        assertFalse(UsuariosService.rutValido("abc"));
    }
}
