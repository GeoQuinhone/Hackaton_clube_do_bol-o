package com.bolao.repository;

import com.bolao.entity.Selecao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SelecaoRepository extends JpaRepository<Selecao, Long> {

    boolean existsBySigla(String sigla);

    boolean existsByNome(String nome);

    Optional<Selecao> findBySigla(String sigla);

    List<Selecao> findByGrupoOrderByNomeAsc(String grupo);

    List<Selecao> findAllByOrderByGrupoAscNomeAsc();
}
