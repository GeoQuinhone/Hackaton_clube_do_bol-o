package com.bolao.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RankingItemDTO {
    private int posicao;
    private Long usuarioId;
    private String nome;
    private String avatarUrl;
    private long pontuacaoTotal;
    private long placaresExatos;
    private boolean souEu;
}