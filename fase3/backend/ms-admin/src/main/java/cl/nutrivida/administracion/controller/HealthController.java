package cl.nutrivida.administracion.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/api/v1/health")
    public java.util.Map<String, String> health() {
        return java.util.Map.of("status", "UP", "service", "administracion");
    }
}
