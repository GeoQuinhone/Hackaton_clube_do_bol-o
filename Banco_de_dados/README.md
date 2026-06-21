# Hackaton_clube_do_bol-o

# Estrutura do Banco de Dados

O banco de dados do sistema de bolão foi projetado para armazenar informações dos usuários, partidas, seleções participantes e os palpites realizados pelos usuários.

## Visão Geral dos Relacionamentos

O sistema possui quatro entidades principais:

* **Usuários**: responsáveis por realizar os palpites.
* **Palpites**: registros das previsões feitas pelos usuários para cada partida.
* **Partidas**: jogos cadastrados no sistema.
* **Seleções**: equipes ou países participantes das partidas.

### Relacionamentos

* Um usuário pode realizar vários palpites (**1:N**).
* Cada palpite pertence a um único usuário (**N:1**).
* Uma partida pode receber vários palpites (**1:N**).
* Cada palpite está associado a uma única partida (**N:1**).
* Uma seleção pode participar de várias partidas.
* Cada partida possui uma seleção mandante e uma seleção visitante.

---

## Tabela: USUARIOS

Armazena os dados dos usuários cadastrados no sistema.

| Campo  | Descrição                                  |
| ------ | ------------------------------------------ |
| id     | Identificador único do usuário             |
| nome   | Nome completo do usuário                   |
| email  | E-mail utilizado para login                |
| senha  | Senha criptografada do usuário             |
| perfil | Tipo de usuário (Administrador ou Usuário) |

### Responsabilidade

Permitir a autenticação e identificação dos participantes do bolão.

---

## Tabela: PALPITES

Armazena os palpites realizados pelos usuários para cada partida.

| Campo   | Descrição                                    |
| ------- | -------------------------------------------- |
| id      | Identificador único do palpite               |
| usuario | Referência ao usuário que realizou o palpite |
| partida | Referência à partida apostada                |
| gols_m  | Quantidade de gols prevista para o mandante  |
| gols_v  | Quantidade de gols prevista para o visitante |
| pontos  | Pontuação obtida após o resultado da partida |

### Responsabilidade

Registrar as previsões dos usuários e armazenar a pontuação conquistada.

---

## Tabela: PARTIDAS

Armazena as informações dos jogos.

| Campo     | Descrição                      |
| --------- | ------------------------------ |
| id        | Identificador único da partida |
| mandante  | Seleção mandante               |
| visitante | Seleção visitante              |
| data      | Data e horário da partida      |
| fase      | Fase da competição             |
| gols_m    | Gols marcados pelo mandante    |
| gols_v    | Gols marcados pelo visitante   |

### Responsabilidade

Controlar os jogos da competição e armazenar os resultados oficiais.

---

## Tabela: SELECOES

Armazena as seleções participantes do campeonato.

| Campo    | Descrição                            |
| -------- | ------------------------------------ |
| id       | Identificador único da seleção       |
| nome     | Nome da seleção                      |
| sigla    | Sigla da seleção                     |
| grupo    | Grupo ao qual a seleção pertence     |
| bandeira | Imagem ou URL da bandeira da seleção |

### Responsabilidade

Manter o cadastro das equipes participantes utilizadas nas partidas.

---

## Fluxo de Funcionamento

1. As seleções são cadastradas no sistema.
2. As partidas são criadas relacionando uma seleção mandante e uma visitante.
3. Os usuários realizam seus palpites para cada partida.
4. Após o encerramento do jogo, o resultado oficial é informado.
5. O sistema calcula automaticamente a pontuação dos palpites.
6. Os pontos são utilizados para compor o ranking do bolão.

## Diagrama de Relacionamento

USUARIOS (1) ────< PALPITES >──── (1) PARTIDAS

PARTIDAS >──── (N:1) SELECOES (Mandante)

PARTIDAS >──── (N:1) SELECOES (Visitante)

Esse modelo garante a integridade dos dados e permite que múltiplos usuários realizem palpites para várias partidas ao longo da competição.
