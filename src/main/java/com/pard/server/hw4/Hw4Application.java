package com.pard.server.hw4;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class Hw4Application {

    public static void main(String[] args) {
        SpringApplication.run(Hw4Application.class, args);
    }

}
