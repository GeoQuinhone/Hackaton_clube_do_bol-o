package com.bolao.service;

import com.bolao.dto.DashboardDTO;
import com.bolao.entity.Partida;
import com.bolao.repository.PartidaRepository;
import com.bolao.repository.SelecaoRepository;
import com.bolao.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final SelecaoRepository selecaoRepository;
    private final PartidaRepository partidaRepository;

    public DashboardDTO obterEstatisticas() {
        long totalUsuarios = userRepository.count();
        long usuariosAtivos = userRepository.findAll().stream().filter(u -> u.isActive()).count();
        long usuariosBloqueados = totalUsuarios - usuariosAtivos;

        long totalPartidas = partidaRepository.count();
        long partidasAgendadas = partidaRepository
                .findByStatusOrderByDataHoraAsc(Partida.StatusPartida.AGENDADA, Pageable.unpaged())
                .getTotalElements();
        long partidasFinalizadas = partidaRepository
                .findByStatusOrderByDataHoraAsc(Partida.StatusPartida.FINALIZADA, Pageable.unpaged())
                .getTotalElements();
        long partidasEmAndamento = partidaRepository
                .findByStatusOrderByDataHoraAsc(Partida.StatusPartida.EM_ANDAMENTO, Pageable.unpaged())
                .getTotalElements();

        return DashboardDTO.builder()
                .totalUsuarios(totalUsuarios)
                .usuariosAtivos(usuariosAtivos)
                .usuariosBloqueados(usuariosBloqueados)
                .totalSelecoes(selecaoRepository.count())
                .totalPartidas(totalPartidas)
                .partidasAgendadas(partidasAgendadas)
                .partidasFinalizadas(partidasFinalizadas)
                .partidasEmAndamento(partidasEmAndamento)
                .build();
    }
}
