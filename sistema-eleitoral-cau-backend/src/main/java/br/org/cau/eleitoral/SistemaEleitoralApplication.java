package br.org.cau.eleitoral;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
@EnableAsync
@EnableScheduling
@OpenAPIDefinition(
    info = @Info(
        title = "Sistema Eleitoral CAU - API",
        version = "1.0.0",
        description = "API REST para o Sistema de Gestão Eleitoral do Conselho de Arquitetura e Urbanismo",
        contact = @Contact(
            name = "Equipe de Desenvolvimento",
            email = "desenvolvimento@cau.org.br"
        )
    ),
    servers = {
        @Server(url = "http://localhost:8080/api", description = "Ambiente Local"),
        @Server(url = "https://eleitoral.cau.org.br/api", description = "Ambiente Produção")
    }
)
public class SistemaEleitoralApplication {

    public static void main(String[] args) {
        SpringApplication.run(SistemaEleitoralApplication.class, args);
    }
}