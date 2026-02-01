package com.meddistributor.erp.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
  @Bean
  public OpenAPI openAPI() {
    return new OpenAPI().info(new Info()
        .title("Medical Distributor ERP API")
        .version("1.0.0")
        .description("Sales, inventory, checkout and reporting APIs"));
  }
}
