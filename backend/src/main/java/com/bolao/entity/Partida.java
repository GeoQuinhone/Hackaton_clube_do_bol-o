package com.bolao.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "partidas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selecao_casa_id", nullable = false)
    private Selecao selecaoCasa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selecao_fora_id", nullable = false)
    private Selecao selecaoFora;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @Column(nullable = false, length = 100)
    private String fase; // ex: "Grupo A", "Oitavas de final", "Final"

    @Column(length = 100)
    private String estadio;

    @Column(name = "gols_casa")
    private Integer golsCasa; // null enquanto o jogo não acontece

    @Column(name = "gols_fora")
    private Integer golsFora;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatusPartida status = StatusPartida.AGENDADA;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum StatusPartida {
        AGENDADA, EM_ANDAMENTO, FINALIZADA, ADIADA, CANCELADA
    }

    public boolean isFinalizada() {
        return status == StatusPartida.FINALIZADA;
    }
}
