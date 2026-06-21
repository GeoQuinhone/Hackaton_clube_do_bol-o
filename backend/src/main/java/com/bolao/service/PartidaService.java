package com.bolao.service;

import com.bolao.dto.AtualizarResultadoRequest;
import com.bolao.dto.AtualizarStatusRequest;
import com.bolao.dto.PartidaDTO;
import com.bolao.dto.PartidaRequest;
import com.bolao.entity.Partida;
import com.bolao.entity.Selecao;
import com.bolao.exception.PartidaInvalidaException;
import com.bolao.exception.PartidaNotFoundException;
import com.bolao.exception.SelecaoNotFoundException;
import com.bolao.repository.PartidaRepository;
import com.bolao.repository.SelecaoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PartidaService {

    private final PartidaRepository partidaRepository;
    private final SelecaoRepository selecaoRepository;

    @Transactional
    public PartidaDTO criar(PartidaRequest request) {
        if (request.getSelecaoCasaId().equals(request.getSelecaoForaId())) {
            throw new PartidaInvalidaException("Uma seleção não pode jogar contra ela mesma");
        }

        Selecao casa = selecaoRepository.findById(request.getSelecaoCasaId())
                .orElseThrow(() -> new SelecaoNotFoundException(request.getSelecaoCasaId()));
        Selecao fora = selecaoRepository.findById(request.getSelecaoForaId())
                .orElseThrow(() -> new SelecaoNotFoundException(request.getSelecaoForaId()));

        Partida partida = Partida.builder()
                .selecaoCasa(casa)
                .selecaoFora(fora)
                .dataHora(request.getDataHora())
                .fase(request.getFase())
                .estadio(request.getEstadio())
                .status(Partida.StatusPartida.AGENDADA)
                .build();

        partidaRepository.save(partida);
        log.info("Partida criada: {} x {} - {}", casa.getSigla(), fora.getSigla(), request.getDataHora());
        return PartidaDTO.fromEntity(partida);
    }

    public Page<PartidaDTO> listarTodas(Pageable pageable) {
        return partidaRepository.findAll(pageable).map(PartidaDTO::fromEntity);
    }

    public PartidaDTO buscarPorId(Long id) {
        Partida partida = partidaRepository.findById(id)
                .orElseThrow(() -> new PartidaNotFoundException(id));
        return PartidaDTO.fromEntity(partida);
    }

    public Page<PartidaDTO> listarPorStatus(Partida.StatusPartida status, Pageable pageable) {
        return partidaRepository.findByStatusOrderByDataHoraAsc(status, pageable).map(PartidaDTO::fromEntity);
    }

    public List<PartidaDTO> listarPorFase(String fase) {
        return partidaRepository.findByFaseOrderByDataHoraAsc(fase).stream()
                .map(PartidaDTO::fromEntity)
                .toList();
    }

    public List<PartidaDTO> listarPorSelecao(Long selecaoId) {
        if (!selecaoRepository.existsById(selecaoId)) {
            throw new SelecaoNotFoundException(selecaoId);
        }
        return partidaRepository.findBySelecaoId(selecaoId).stream()
                .map(PartidaDTO::fromEntity)
                .toList();
    }

    @Transactional
    public PartidaDTO atualizar(Long id, PartidaRequest request) {
        Partida partida = partidaRepository.findById(id)
                .orElseThrow(() -> new PartidaNotFoundException(id));

        if (partida.isFinalizada()) {
            throw new PartidaInvalidaException("Não é possível editar uma partida já finalizada");
        }

        if (request.getSelecaoCasaId().equals(request.getSelecaoForaId())) {
            throw new PartidaInvalidaException("Uma seleção não pode jogar contra ela mesma");
        }

        Selecao casa = selecaoRepository.findById(request.getSelecaoCasaId())
                .orElseThrow(() -> new SelecaoNotFoundException(request.getSelecaoCasaId()));
        Selecao fora = selecaoRepository.findById(request.getSelecaoForaId())
                .orElseThrow(() -> new SelecaoNotFoundException(request.getSelecaoForaId()));

        partida.setSelecaoCasa(casa);
        partida.setSelecaoFora(fora);
        partida.setDataHora(request.getDataHora());
        partida.setFase(request.getFase());
        partida.setEstadio(request.getEstadio());

        partidaRepository.save(partida);
        log.info("Partida {} atualizada", id);
        return PartidaDTO.fromEntity(partida);
    }

    /**
     * Atualiza o placar da partida. Quando o status muda para FINALIZADA,
     * o Integrante 3 (Palpites e Ranking) deve escutar essa mudança para
     * recalcular a pontuação dos palpites associados a esta partida.
     */
    @Transactional
    public PartidaDTO atualizarResultado(Long id, AtualizarResultadoRequest request) {
        Partida partida = partidaRepository.findById(id)
                .orElseThrow(() -> new PartidaNotFoundException(id));

        if (partida.getStatus() == Partida.StatusPartida.CANCELADA) {
            throw new PartidaInvalidaException("Não é possível registrar resultado de uma partida cancelada");
        }

        partida.setGolsCasa(request.getGolsCasa());
        partida.setGolsFora(request.getGolsFora());

        partidaRepository.save(partida);
        log.info("Resultado da partida {} atualizado: {} x {}", id, request.getGolsCasa(), request.getGolsFora());
        return PartidaDTO.fromEntity(partida);
    }

    @Transactional
    public PartidaDTO atualizarStatus(Long id, AtualizarStatusRequest request) {
        Partida partida = partidaRepository.findById(id)
                .orElseThrow(() -> new PartidaNotFoundException(id));

        if (request.getStatus() == Partida.StatusPartida.FINALIZADA
                && (partida.getGolsCasa() == null || partida.getGolsFora() == null)) {
            throw new PartidaInvalidaException("Não é possível finalizar uma partida sem registrar o resultado");
        }

        partida.setStatus(request.getStatus());
        partidaRepository.save(partida);
        log.info("Status da partida {} alterado para {}", id, request.getStatus());
        return PartidaDTO.fromEntity(partida);
    }

    @Transactional
    public void excluir(Long id) {
        Partida partida = partidaRepository.findById(id)
                .orElseThrow(() -> new PartidaNotFoundException(id));

        if (partida.isFinalizada()) {
            throw new PartidaInvalidaException("Não é possível excluir uma partida já finalizada");
        }

        partidaRepository.delete(partida);
        log.info("Partida {} excluída", id);
    }
}
