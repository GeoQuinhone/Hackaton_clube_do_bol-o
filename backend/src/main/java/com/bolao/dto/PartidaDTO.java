package com.bolao.dto;

import com.bolao.entity.Partida;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartidaDTO {
    private Long id;
    private SelecaoDTO selecaoCasa;
    private SelecaoDTO selecaoFora;
    private LocalDateTime dataHora;
    private String fase;
    private String estadio;
    private Integer golsCasa;
    private Integer golsFora;
    private Partida.StatusPartida status;

    public static PartidaDTO fromEntity(Partida p) {
        return PartidaDTO.builder()
                .id(p.getId())
                .selecaoCasa(SelecaoDTO.fromEntity(p.getSelecaoCasa()))
                .selecaoFora(SelecaoDTO.fromEntity(p.getSelecaoFora()))
                .dataHora(p.getDataHora())
                .fase(p.getFase())
                .estadio(p.getEstadio())
                .golsCasa(p.getGolsCasa())
                .golsFora(p.getGolsFora())
                .status(p.getStatus())
                .build();
    }
}
