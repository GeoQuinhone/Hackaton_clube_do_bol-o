package com.bolao.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PalpiteRequest {

    @NotNull(message = "ID da partida é obrigatório")
    private Long partidaId;

    @Min(value = 0, message = "Gols não pode ser negativo")
    private int golsCasa;

    @Min(value = 0, message = "Gols não pode ser negativo")
    private int golsFora;
}