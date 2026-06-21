package com.bolao;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BolaoCopaApplication {

    public static void main(String[] args) {
        SpringApplication.run(BolaoCopaApplication.class, args);
    }
}
