package com.bolao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SelecaoRequest {
    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "Sigla é obrigatória")
    @Size(min = 3, max = 3, message = "Sigla deve ter exatamente 3 letras")
    private String sigla;

    private String bandeiraUrl;

    @NotBlank(message = "Grupo é obrigatório")
    private String grupo;
}
