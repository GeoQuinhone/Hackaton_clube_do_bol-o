package com.bolao.repository;

import com.bolao.entity.Partida;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PartidaRepository extends JpaRepository<Partida, Long> {

    Page<Partida> findByStatusOrderByDataHoraAsc(Partida.StatusPartida status, Pageable pageable);

    List<Partida> findByFaseOrderByDataHoraAsc(String fase);

    @Query("SELECT p FROM Partida p WHERE p.dataHora BETWEEN :inicio AND :fim ORDER BY p.dataHora ASC")
    List<Partida> findByPeriodo(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    @Query("SELECT p FROM Partida p WHERE p.selecaoCasa.id = :selecaoId OR p.selecaoFora.id = :selecaoId ORDER BY p.dataHora ASC")
    List<Partida> findBySelecaoId(@Param("selecaoId") Long selecaoId);

    @Query("SELECT p FROM Partida p WHERE p.status = 'AGENDADA' AND p.dataHora <= :agora")
    List<Partida> findPartidasQueDeveriamComecar(@Param("agora") LocalDateTime agora);

    boolean existsBySelecaoCasaIdOrSelecaoForaId(Long selecaoCasaId, Long selecaoForaId);
}
