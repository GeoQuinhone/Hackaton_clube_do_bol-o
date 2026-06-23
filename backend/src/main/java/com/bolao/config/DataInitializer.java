package com.bolao.config;

import com.bolao.entity.User;
import com.bolao.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@bolao.com")) {
            User admin = User.builder()
                    .name("Administrador")
                    .email("admin@bolao.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .active(true)
                    .build();

            userRepository.save(admin);
            log.info("=================================================");
            log.info("  Usuário admin criado automaticamente!");
            log.info("  Email: admin@bolao.com");
            log.info("  Senha: admin123");
            log.info("  Acesse: http://localhost:8080/admin-login");
            log.info("=================================================");
        }
    }
}
