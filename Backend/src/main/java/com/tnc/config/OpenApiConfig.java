package com.tnc.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                .title("Stock Portfolio Manager API")
                .version("1.0.0")
                .description("REST API for managing individual investor stock portfolio")
                        .contact(new Contact()
                    .name("Portfolio Manager Team")
                    .email("support@portfolio.local")));
    }
}
