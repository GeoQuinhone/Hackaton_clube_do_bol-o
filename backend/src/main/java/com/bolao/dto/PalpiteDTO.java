package com.bolao.dto;

import com.bolao.entity.Palpite;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PalpiteDTO {

    private Long id;
    private Long usuarioId;
    private Long partidaId;
    private int golsCasa;
    private int golsFora;
    private Integer pontuacao;
    private PartidaDTO partida;

    public static PalpiteDTO fromEntity(Palpite p) {
        return PalpiteDTO.builder()
                .id(p.getId())
                .usuarioId(p.getUsuario().getId())
                .partidaId(p.getPartida().getId())
                .golsCasa(p.getGolsCasa())
                .golsFora(p.getGolsFora())
                .pontuacao(p.getPontuacao())
                .partida(PartidaDTO.fromEntity(p.getPartida()))
                .build();
    }
}