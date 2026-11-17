
package com.nutrivida.mscarrito.client;

import com.nutrivida.mscarrito.dto.PlanDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
    name = "administracion-service",
    url = "http://localhost:8082"
)
public interface PlanClient {

    @GetMapping("/api/v1/planes/{id}")
    PlanDTO obtenerPlanPorId(@PathVariable("id") String id);
}
