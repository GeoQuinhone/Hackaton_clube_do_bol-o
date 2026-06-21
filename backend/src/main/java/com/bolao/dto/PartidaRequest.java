package com.bolao.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PartidaRequest {
    @NotNull(message = "Seleção da casa é obrigatória")
    private Long selecaoCasaId;

    @NotNull(message = "Seleção de fora é obrigatória")
    private Long selecaoForaId;

    @NotNull(message = "Data e hora são obrigatórias")
    private LocalDateTime dataHora;

    @NotBlank(message = "Fase é obrigatória")
    private String fase;

    private String estadio;
}
