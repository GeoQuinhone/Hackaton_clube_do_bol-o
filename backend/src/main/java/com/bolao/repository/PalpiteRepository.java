package com.bolao.repository;

import com.bolao.entity.Palpite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PalpiteRepository extends JpaRepository<Palpite, Long> {

    Optional<Palpite> findByUsuarioEmailAndPartidaId(String email, Long partidaId);

    List<Palpite> findByUsuarioEmailOrderByPartidaDataHoraDesc(String email);

    List<Palpite> findByPartidaId(Long partidaId);

    boolean existsByUsuarioEmailAndPartidaId(String email, Long partidaId);

    @Query("SELECT p FROM Palpite p WHERE p.pontuacao IS NOT NULL")
    List<Palpite> findAllScored();
}