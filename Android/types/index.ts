// Tipos alinhados ao schema do banco (Banco_de_dados/*.sql) e aos RFs da documentação

export type Fase = "GRUPOS" | "OITAVAS" | "QUARTAS" | "SEMI" | "FINAL";
export type StatusPartida = "AGENDADA" | "EM_ANDAMENTO" | "ENCERRADA";
export type Perfil = "USER" | "ADMIN";

export interface Selecao {
  id: number;
  nome: string;
  codigoFifa: string;
  bandeira?: string | null;
  grupo?: string | null;
}

export interface Partida {
  id: number;
  selecaoMandante: Selecao;
  selecaoVisitante: Selecao;
  fase: Fase;
  estadio?: string | null;
  dataHora: string; // ISO
  golsMandante?: number | null;
  golsVisitante?: number | null;
  status: StatusPartida;
  // presente quando a API já enriquece com o palpite do usuário logado
  meuPalpite?: Palpite | null;
}

export interface Palpite {
  id: number;
  usuarioId: number;
  partidaId: number;
  golsMandante: number;
  golsVisitante: number;
  pontuacao?: number | null;
  criadoEm?: string;
  partida?: Partida;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  fotoPerfil?: string | null;
  perfil: Perfil;
  bloqueado: boolean;
  pontuacaoTotal: number;
  placaresExatos: number;
  criadoEm?: string;
}

export interface RankingItem {
  posicao: number;
  usuarioId: number;
  nome: string;
  fotoPerfil?: string | null;
  pontuacaoTotal: number;
  placaresExatos: number;
  souEu?: boolean;
}

export interface DashboardResumo {
  proximasPartidas: Partida[];
  meusPalpitesRecentes: Palpite[];
  minhaPosicao: number;
  meusPontos: number;
  topRanking: RankingItem[];
  totalPalpites: number;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface ApiErrorBody {
  message?: string;
  erro?: string;
}
