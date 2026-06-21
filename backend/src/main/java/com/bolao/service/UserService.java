package com.bolao.service;

import com.bolao.dto.ChangePasswordRequest;
import com.bolao.dto.UpdateProfileRequest;
import com.bolao.dto.UserProfileDTO;
import com.bolao.entity.User;
import com.bolao.exception.UserNotFoundException;
import com.bolao.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileDTO getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));
        return UserProfileDTO.fromUser(user);
    }

    @Transactional
    public UserProfileDTO updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));

        user.setName(request.getName());
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        userRepository.save(user);
        log.info("Perfil atualizado: {}", email);
        return UserProfileDTO.fromUser(user);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Senha atual incorreta");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Senha alterada para o usuário: {}", email);
    }

    @Transactional
    public void deleteAccount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));

        // Soft delete: desativa em vez de apagar para preservar histórico de palpites
        user.setActive(false);
        userRepository.save(user);
        log.info("Conta desativada: {}", email);
    }

    // ===== ADMIN =====

    public Page<UserProfileDTO> listAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(UserProfileDTO::fromUser);
    }

    public Page<UserProfileDTO> searchUsers(String name, Pageable pageable) {
        return userRepository.findByNameContainingIgnoreCase(name, pageable).map(UserProfileDTO::fromUser);
    }

    @Transactional
    public UserProfileDTO toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        user.setActive(!user.isActive());
        userRepository.save(user);

        String action = user.isActive() ? "desbloqueado" : "bloqueado";
        log.info("Usuário {} {}", user.getEmail(), action);

        return UserProfileDTO.fromUser(user);
    }

    @Transactional
    public UserProfileDTO promoteToAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        user.setRole(User.Role.ADMIN);
        userRepository.save(user);
        log.info("Usuário {} promovido a ADMIN", user.getEmail());

        return UserProfileDTO.fromUser(user);
    }
}
