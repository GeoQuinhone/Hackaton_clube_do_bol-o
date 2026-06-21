package com.bolao.service;

import com.bolao.dto.SelecaoDTO;
import com.bolao.dto.SelecaoRequest;
import com.bolao.entity.Selecao;
import com.bolao.exception.SelecaoDuplicadaException;
import com.bolao.exception.SelecaoNotFoundException;
import com.bolao.repository.SelecaoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SelecaoService {

    private final SelecaoRepository selecaoRepository;

    @Transactional
    public SelecaoDTO criar(SelecaoRequest request) {
        String sigla = request.getSigla().toUpperCase();

        if (selecaoRepository.existsBySigla(sigla)) {
            throw new SelecaoDuplicadaException("Já existe uma seleção com a sigla: " + sigla);
        }
        if (selecaoRepository.existsByNome(request.getNome())) {
            throw new SelecaoDuplicadaException("Já existe uma seleção com o nome: " + request.getNome());
        }

        Selecao selecao = Selecao.builder()
                .nome(request.getNome())
                .sigla(sigla)
                .bandeiraUrl(request.getBandeiraUrl())
                .grupo(request.getGrupo())
                .build();

        selecaoRepository.save(selecao);
        log.info("Seleção criada: {} ({})", selecao.getNome(), selecao.getSigla());
        return SelecaoDTO.fromEntity(selecao);
    }

    public List<SelecaoDTO> listarTodas() {
        return selecaoRepository.findAllByOrderByGrupoAscNomeAsc().stream()
                .map(SelecaoDTO::fromEntity)
                .toList();
    }

    public SelecaoDTO buscarPorId(Long id) {
        Selecao selecao = selecaoRepository.findById(id)
                .orElseThrow(() -> new SelecaoNotFoundException(id));
        return SelecaoDTO.fromEntity(selecao);
    }

    public List<SelecaoDTO> listarPorGrupo(String grupo) {
        return selecaoRepository.findByGrupoOrderByNomeAsc(grupo).stream()
                .map(SelecaoDTO::fromEntity)
                .toList();
    }

    @Transactional
    public SelecaoDTO atualizar(Long id, SelecaoRequest request) {
        Selecao selecao = selecaoRepository.findById(id)
                .orElseThrow(() -> new SelecaoNotFoundException(id));

        String sigla = request.getSigla().toUpperCase();

        selecaoRepository.findBySigla(sigla).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new SelecaoDuplicadaException("Já existe uma seleção com a sigla: " + sigla);
            }
        });

        selecao.setNome(request.getNome());
        selecao.setSigla(sigla);
        selecao.setBandeiraUrl(request.getBandeiraUrl());
        selecao.setGrupo(request.getGrupo());

        selecaoRepository.save(selecao);
        log.info("Seleção atualizada: {} ({})", selecao.getNome(), selecao.getSigla());
        return SelecaoDTO.fromEntity(selecao);
    }

    @Transactional
    public void excluir(Long id) {
        Selecao selecao = selecaoRepository.findById(id)
                .orElseThrow(() -> new SelecaoNotFoundException(id));

        selecaoRepository.delete(selecao);
        log.info("Seleção excluída: {} ({})", selecao.getNome(), selecao.getSigla());
    }
}
