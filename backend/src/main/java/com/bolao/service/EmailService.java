package com.bolao.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Async
    public void sendPasswordResetEmail(String toEmail, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Bolão Copa 2026 - Recuperação de Senha");
            message.setText(buildResetEmailBody(token));
            mailSender.send(message);
            log.info("Email de recuperação enviado para: {}", toEmail);
        } catch (Exception e) {
            log.error("Erro ao enviar email para {}: {}", toEmail, e.getMessage());
        }
    }

    private String buildResetEmailBody(String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        return """
                Olá!
                
                Você solicitou a recuperação de senha do Bolão Copa 2026.
                
                Clique no link abaixo para criar uma nova senha:
                %s
                
                Este link expira em 1 hora.
                
                Se você não solicitou a recuperação de senha, ignore este email.
                
                Equipe Bolão Copa 2026
                """.formatted(resetLink);
    }
}
