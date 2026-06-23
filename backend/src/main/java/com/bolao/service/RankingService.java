package com.bolao.service;

import com.bolao.dto.RankingItemDTO;
import com.bolao.entity.Palpite;
import com.bolao.repository.PalpiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RankingService {

    private final PalpiteRepository palpiteRepository;

    public Page<RankingItemDTO> rankingGeral(Pageable pageable) {
        List<RankingItemDTO> ranking = construirRanking(null);
        return paginar(ranking, pageable);
    }

    public RankingItemDTO minhaPosicao(String email) {
        List<RankingItemDTO> ranking = construirRanking(email);
        return ranking.stream()
                .filter(RankingItemDTO::isSouEu)
                .findFirst()
                .orElseGet(() -> RankingItemDTO.builder()
                        .posicao(ranking.size() + 1)
                        .pontuacaoTotal(0)
                        .placaresExatos(0)
                        .souEu(true)
                        .build());
    }

    private List<RankingItemDTO> construirRanking(String emailLogado) {
        List<Palpite> scored = palpiteRepository.findAllScored();

        Map<Long, List<Palpite>> porUsuario = scored.stream()
                .collect(Collectors.groupingBy(p -> p.getUsuario().getId()));

        List<RankingItemDTO> lista = new ArrayList<>();

        porUsuario.forEach((userId, palpites) -> {
            var usuario = palpites.get(0).getUsuario();
            long total = palpites.stream()
                    .mapToLong(p -> p.getPontuacao() != null ? p.getPontuacao() : 0)
                    .sum();
            long exatos = palpites.stream()
                    .filter(p -> p.getPontuacao() != null && p.getPontuacao() == 10)
                    .count();

            lista.add(RankingItemDTO.builder()
                    .usuarioId(userId)
                    .nome(usuario.getName())
                    .avatarUrl(usuario.getAvatarUrl())
                    .pontuacaoTotal(total)
                    .placaresExatos(exatos)
                    .souEu(emailLogado != null && usuario.getEmail().equals(emailLogado))
                    .build());
        });

        lista.sort(Comparator
                .comparingLong(RankingItemDTO::getPontuacaoTotal).reversed()
                .thenComparingLong(RankingItemDTO::getPlacaresExatos).reversed());

        for (int i = 0; i < lista.size(); i++) {
            lista.get(i).setPosicao(i + 1);
        }

        return lista;
    }

    private Page<RankingItemDTO> paginar(List<RankingItemDTO> lista, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), lista.size());
        List<RankingItemDTO> page = start >= lista.size() ? List.of() : lista.subList(start, end);
        return new PageImpl<>(page, pageable, lista.size());
    }
}