package com.bolao.controller;

import com.bolao.dto.PalpiteDTO;
import com.bolao.dto.PalpiteRequest;
import com.bolao.service.PalpiteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/palpites")
@RequiredArgsConstructor
public class PalpiteController {

    private final PalpiteService palpiteService;

    @PostMapping
    public ResponseEntity<PalpiteDTO> registrar(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PalpiteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(palpiteService.registrar(userDetails.getUsername(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PalpiteDTO> editar(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody PalpiteRequest request) {
        return ResponseEntity.ok(palpiteService.editar(userDetails.getUsername(), id, request));
    }

    @GetMapping("/meus")
    public ResponseEntity<List<PalpiteDTO>> meusPalpites(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(palpiteService.meusPalpites(userDetails.getUsername()));
    }
}