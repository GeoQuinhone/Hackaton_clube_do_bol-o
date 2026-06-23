package com.bolao.controller;

import com.bolao.dto.*;
import com.bolao.entity.Partida;
import com.bolao.service.PartidaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partidas")
@RequiredArgsConstructor
public class PartidaController {

    private final PartidaService partidaService;

    // ===== Leitura: disponível para qualquer usuário autenticado (app mobile) =====

    @GetMapping
    public ResponseEntity<Page<PartidaDTO>> listarTodas(
            @RequestParam(required = false) Partida.StatusPartida status,
            @PageableDefault(size = 20, sort = "dataHora") Pageable pageable) {

        if (status != null) {
            return ResponseEntity.ok(partidaService.listarPorStatus(status, pageable));
        }
        return ResponseEntity.ok(partidaService.listarTodas(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartidaDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(partidaService.buscarPorId(id));
    }

    @GetMapping("/fase/{fase}")
    public ResponseEntity<List<PartidaDTO>> listarPorFase(@PathVariable String fase) {
        return ResponseEntity.ok(partidaService.listarPorFase(fase));
    }

    @GetMapping("/selecao/{selecaoId}")
    public ResponseEntity<List<PartidaDTO>> listarPorSelecao(@PathVariable Long selecaoId) {
        return ResponseEntity.ok(partidaService.listarPorSelecao(selecaoId));
    }

    // ===== Escrita: restrita a ADMIN =====

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PartidaDTO> criar(@Valid @RequestBody PartidaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(partidaService.criar(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PartidaDTO> atualizar(@PathVariable Long id, @Valid @RequestBody PartidaRequest request) {
        return ResponseEntity.ok(partidaService.atualizar(id, request));
    }

    @PatchMapping("/{id}/resultado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PartidaDTO> atualizarResultado(@PathVariable Long id,
                                                          @Valid @RequestBody AtualizarResultadoRequest request) {
        return ResponseEntity.ok(partidaService.atualizarResultado(id, request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PartidaDTO> atualizarStatus(@PathVariable Long id,
                                                       @Valid @RequestBody AtualizarStatusRequest request) {
        return ResponseEntity.ok(partidaService.atualizarStatus(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        partidaService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
