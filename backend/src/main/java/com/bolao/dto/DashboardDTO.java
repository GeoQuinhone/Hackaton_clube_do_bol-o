package com.bolao.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private long totalUsuarios;
    private long usuariosAtivos;
    private long usuariosBloqueados;
    private long totalSelecoes;
    private long totalPartidas;
    private long partidasAgendadas;
    private long partidasFinalizadas;
    private long partidasEmAndamento;
}
