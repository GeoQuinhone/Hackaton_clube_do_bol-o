package com.bolao.controller;

import com.bolao.dto.RankingItemDTO;
import com.bolao.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ranking")
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;

    @GetMapping("/geral")
    public ResponseEntity<Page<RankingItemDTO>> rankingGeral(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(rankingService.rankingGeral(PageRequest.of(page, size)));
    }

    @GetMapping("/me")
    public ResponseEntity<RankingItemDTO> minhaPosicao(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(rankingService.minhaPosicao(userDetails.getUsername()));
    }
}