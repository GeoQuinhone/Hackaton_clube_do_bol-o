package com.bolao.dto;

import com.bolao.entity.Partida;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AtualizarStatusRequest {
    @NotNull(message = "Status é obrigatório")
    private Partida.StatusPartida status;
}
