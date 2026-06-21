package com.bolao.controller;

import com.bolao.dto.*;
import com.bolao.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ===== ROTAS DO USUÁRIO LOGADO (/api/users/me) =====

    @GetMapping("/api/users/me")
    public ResponseEntity<UserProfileDTO> getMyProfile(Principal principal) {
        return ResponseEntity.ok(userService.getProfile(principal.getName()));
    }

    @PutMapping("/api/users/me")
    public ResponseEntity<UserProfileDTO> updateMyProfile(Principal principal,
                                                           @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(principal.getName(), request));
    }

    @PatchMapping("/api/users/me/password")
    public ResponseEntity<MessageResponse> changePassword(Principal principal,
                                                          @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(principal.getName(), request);
        return ResponseEntity.ok(new MessageResponse("Senha alterada com sucesso!"));
    }

    @DeleteMapping("/api/users/me")
    public ResponseEntity<MessageResponse> deleteMyAccount(Principal principal) {
        userService.deleteAccount(principal.getName());
        return ResponseEntity.ok(new MessageResponse("Conta desativada com sucesso."));
    }

    // ===== ROTAS ADMIN (/api/admin/users) =====

    @GetMapping("/api/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserProfileDTO>> listUsers(
            @RequestParam(required = false) String name,
            @PageableDefault(size = 20) Pageable pageable) {

        if (name != null && !name.isBlank()) {
            return ResponseEntity.ok(userService.searchUsers(name, pageable));
        }
        return ResponseEntity.ok(userService.listAllUsers(pageable));
    }

    @PatchMapping("/api/admin/users/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfileDTO> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleUserStatus(id));
    }

    @PatchMapping("/api/admin/users/{id}/promote")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfileDTO> promoteToAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(userService.promoteToAdmin(id));
    }
}
