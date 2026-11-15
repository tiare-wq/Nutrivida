
package com.nutrivida.mscarrito.config;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor authorizationInterceptor() {

        return requestTemplate -> {

            var attributes =
                    RequestContextHolder.getRequestAttributes();

            if (attributes instanceof ServletRequestAttributes servlet) {

                String authorization = servlet.getRequest()
                        .getHeader("Authorization");

                if (authorization != null
                        && authorization.startsWith("Bearer ")) {

                    requestTemplate.header(
                        "Authorization",
                        authorization
                    );
                }
            }
        };
    }
}
