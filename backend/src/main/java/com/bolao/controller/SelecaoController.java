package com.bolao.controller;

import com.bolao.dto.SelecaoDTO;
import com.bolao.dto.SelecaoRequest;
import com.bolao.service.SelecaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/selecoes")
@RequiredArgsConstructor
public class SelecaoController {

    private final SelecaoService selecaoService;

    // Leitura disponível para qualquer usuário autenticado (inclusive o app mobile)
    @GetMapping
    public ResponseEntity<List<SelecaoDTO>> listarTodas(@RequestParam(required = false) String grupo) {
        if (grupo != null && !grupo.isBlank()) {
            return ResponseEntity.ok(selecaoService.listarPorGrupo(grupo));
        }
        return ResponseEntity.ok(selecaoService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SelecaoDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(selecaoService.buscarPorId(id));
    }

    // Escrita restrita a ADMIN
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SelecaoDTO> criar(@Valid @RequestBody SelecaoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(selecaoService.criar(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SelecaoDTO> atualizar(@PathVariable Long id, @Valid @RequestBody SelecaoRequest request) {
        return ResponseEntity.ok(selecaoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        selecaoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
