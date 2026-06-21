package com.bolao.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "selecoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Selecao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 3)
    private String sigla; // ex: BRA, ARG, GER

    @Column(name = "bandeira_url")
    private String bandeiraUrl;

    @Column(nullable = false, length = 100)
    private String grupo; // ex: "Grupo A"

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
