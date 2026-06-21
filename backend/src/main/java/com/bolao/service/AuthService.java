package com.bolao.service;

import com.bolao.dto.*;
import com.bolao.entity.PasswordResetToken;
import com.bolao.entity.User;
import com.bolao.exception.EmailAlreadyExistsException;
import com.bolao.exception.InvalidTokenException;
import com.bolao.repository.PasswordResetTokenRepository;
import com.bolao.repository.UserRepository;
import com.bolao.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .active(true)
                .build();

        userRepository.save(user);
        log.info("Novo usuário registrado: {}", user.getEmail());

        String token = jwtTokenProvider.generateTokenFromEmail(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .user(UserProfileDTO.fromUser(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        log.info("Login realizado: {}", user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .user(UserProfileDTO.fromUser(user))
                .build();
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        // Retornamos sucesso mesmo se o email não existir (segurança)
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            tokenRepository.deleteAllByUser(user);

            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .token(token)
                    .user(user)
                    .expiresAt(LocalDateTime.now().plusHours(1))
                    .build();

            tokenRepository.save(resetToken);
            emailService.sendPasswordResetEmail(user.getEmail(), token);
            log.info("Token de reset enviado para: {}", user.getEmail());
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new InvalidTokenException("Token inválido ou inexistente"));

        if (resetToken.isExpired()) {
            throw new InvalidTokenException("Token expirado. Solicite um novo link de recuperação.");
        }

        if (resetToken.isUsed()) {
            throw new InvalidTokenException("Token já utilizado. Solicite um novo link de recuperação.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        log.info("Senha redefinida para o usuário: {}", user.getEmail());
    }
}
