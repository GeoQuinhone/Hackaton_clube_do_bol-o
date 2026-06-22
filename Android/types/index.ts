export type Fase = 'GRUPOS' | 'OITAVAS' | 'QUARTAS' | 'SEMI' | 'FINAL';
export type StatusPartida = 'AGENDADA' | 'EM_ANDAMENTO' | 'ENCERRADA';

export interface Selecao {
  id: number;
  nome: string;
  codigoFifa: string;
  bandeira?: string;
  grupo?: string;
}

export interface Partida {
  id: number;
  selecaoA: Selecao;
  selecaoB: Selecao;
  dataHora: string;
  estadio?: string;
  fase: Fase;
  status: StatusPartida;
  golsA?: number;
  golsB?: number;
  meuPalpite?: Palpite;
}

export interface Palpite {
  id: number;
  usuarioId: number;
  partidaId: number;
  golsA: number;
  golsB: number;
  pontuacao?: number;
  partida?: Partida;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  fotoPerfil?: string;
  pontuacaoTotal: number;
  placaresExatos: number;
}

export interface RankingItem {
  usuarioId: number;
  nome: string;
  fotoPerfil?: string;
  pontuacaoTotal: number;
  placaresExatos: number;
  posicao: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface DashboardResumo {
  meusPontos: number;
  minhaPosicao: number;
  totalPalpites: number;
  proximasPartidas: Partida[];
  topRanking: RankingItem[];
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}
