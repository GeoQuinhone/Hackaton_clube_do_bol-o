package com.bolao.service;

import com.bolao.dto.PalpiteDTO;
import com.bolao.dto.PalpiteRequest;
import com.bolao.entity.Partida;
import com.bolao.entity.Palpite;
import com.bolao.entity.User;
import com.bolao.exception.PartidaNotFoundException;
import com.bolao.exception.UserNotFoundException;
import com.bolao.repository.PalpiteRepository;
import com.bolao.repository.PartidaRepository;
import com.bolao.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PalpiteService {

    private final PalpiteRepository palpiteRepository;
    private final PartidaRepository partidaRepository;
    private final UserRepository userRepository;

    @Transactional
    public PalpiteDTO registrar(String email, PalpiteRequest request) {
        User usuario = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));

        Partida partida = partidaRepository.findById(request.getPartidaId())
                .orElseThrow(() -> new PartidaNotFoundException(request.getPartidaId()));

        if (partida.isFinalizada()) {
            throw new IllegalStateException("Não é possível palpitar em uma partida já finalizada.");
        }

        Palpite palpite = palpiteRepository
                .findByUsuarioEmailAndPartidaId(email, request.getPartidaId())
                .orElseGet(() -> Palpite.builder().usuario(usuario).partida(partida).build());

        palpite.setGolsCasa(request.getGolsCasa());
        palpite.setGolsFora(request.getGolsFora());
        palpite.setPontuacao(null);

        palpiteRepository.save(palpite);
        log.info("Palpite registrado: usuário={} partida={}", email, partida.getId());

        return PalpiteDTO.fromEntity(palpite);
    }

    @Transactional
    public PalpiteDTO editar(String email, Long palpiteId, PalpiteRequest request) {
        Palpite palpite = palpiteRepository.findById(palpiteId)
                .orElseThrow(() -> new RuntimeException("Palpite não encontrado"));

        if (!palpite.getUsuario().getEmail().equals(email)) {
            throw new RuntimeException("Sem permissão para editar este palpite.");
        }

        if (palpite.getPartida().isFinalizada()) {
            throw new IllegalStateException("Não é possível editar palpite de partida finalizada.");
        }

        palpite.setGolsCasa(request.getGolsCasa());
        palpite.setGolsFora(request.getGolsFora());
        palpite.setPontuacao(null);
        palpiteRepository.save(palpite);

        return PalpiteDTO.fromEntity(palpite);
    }

    public List<PalpiteDTO> meusPalpites(String email) {
        return palpiteRepository
                .findByUsuarioEmailOrderByPartidaDataHoraDesc(email)
                .stream()
                .map(PalpiteDTO::fromEntity)
                .toList();
    }

    @Transactional
    public void calcularPontuacoes(Long partidaId) {
        Partida partida = partidaRepository.findById(partidaId)
                .orElseThrow(() -> new PartidaNotFoundException(partidaId));

        if (!partida.isFinalizada()
                || partida.getGolsCasa() == null
                || partida.getGolsFora() == null) {
            return;
        }

        List<Palpite> palpites = palpiteRepository.findByPartidaId(partidaId);
        for (Palpite p : palpites) {
            p.setPontuacao(calcular(p, partida));
        }
        palpiteRepository.saveAll(palpites);
        log.info("Pontuações calculadas para partida {}: {} palpites", partidaId, palpites.size());
    }

    private int calcular(Palpite p, Partida partida) {
        boolean placarExato = p.getGolsCasa() == partida.getGolsCasa()
                && p.getGolsFora() == partida.getGolsFora();
        if (placarExato) return 10;

        boolean resultadoCerto = Integer.signum(p.getGolsCasa() - p.getGolsFora())
                == Integer.signum(partida.getGolsCasa() - partida.getGolsFora());
        if (resultadoCerto) return 5;

        return 0;
    }
}