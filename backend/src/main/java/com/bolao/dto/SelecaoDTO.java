package com.bolao.dto;

import com.bolao.entity.Selecao;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SelecaoDTO {
    private Long id;
    private String nome;
    private String sigla;
    private String bandeiraUrl;
    private String grupo;

    public static SelecaoDTO fromEntity(Selecao s) {
        return SelecaoDTO.builder()
                .id(s.getId())
                .nome(s.getNome())
                .sigla(s.getSigla())
                .bandeiraUrl(s.getBandeiraUrl())
                .grupo(s.getGrupo())
                .build();
    }
}
