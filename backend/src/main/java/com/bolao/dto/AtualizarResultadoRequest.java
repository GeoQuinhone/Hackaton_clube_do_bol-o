package com.bolao.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AtualizarResultadoRequest {
    @NotNull(message = "Gols da casa são obrigatórios")
    @Min(value = 0, message = "Gols não podem ser negativos")
    private Integer golsCasa;

    @NotNull(message = "Gols de fora são obrigatórios")
    @Min(value = 0, message = "Gols não podem ser negativos")
    private Integer golsFora;
}
