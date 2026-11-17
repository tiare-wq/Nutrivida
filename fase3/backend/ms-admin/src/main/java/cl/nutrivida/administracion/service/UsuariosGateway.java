package cl.nutrivida.administracion.service;

import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Service
public class UsuariosGateway {

    private final RestClient client;

    public UsuariosGateway(RestClient usuariosClient) {
        this.client = usuariosClient;
    }

    public ResponseEntity<String> enviar(
        HttpMethod metodo,
        String ruta,
        String authorization,
        String cuerpo
    ) {
        try {
            var solicitud = client.method(metodo).uri(ruta).header("Authorization", authorization);

            if (cuerpo != null) {
                solicitud.contentType(MediaType.APPLICATION_JSON).body(cuerpo);
            }

            return solicitud.retrieve().toEntity(String.class);
        } catch (RestClientResponseException error) {
            return ResponseEntity.status(error.getStatusCode())
                .contentType(MediaType.APPLICATION_JSON)
                .body(error.getResponseBodyAsString());
        } catch (ResourceAccessException error) {
            return ResponseEntity.status(503)
                .contentType(MediaType.APPLICATION_JSON)
                .body("{\"message\":\"Servicio de usuarios no disponible\"}");
        }
    }
}
