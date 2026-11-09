package org.nutrivida.backend.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "servicio-service")
public interface ServicioFeignClient {

    @GetMapping("api/servicios/servicio/{nombre}")
    Boolean findServicioByName(@RequestParam String nombre);
}
