package cl.nutrivida.reserva;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ReservaApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReservaApplication.class, args);
    }

}
