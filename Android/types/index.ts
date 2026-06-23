export type Fase = 'GRUPOS' | 'OITAVAS' | 'QUARTAS' | 'SEMI' | 'FINAL';
export type StatusPartida = 'AGENDADA' | 'EM_ANDAMENTO' | 'FINALIZADA';
export type Role = 'USER' | 'ADMIN';

export interface Selecao {
  id: number;
  nome: string;
  sigla: string;        // ex: BRA, ARG
  bandeiraUrl?: string; // URL da bandeira
  grupo: string;        // ex: "Grupo A"
}

export interface Partida {
  id: number;
  selecaoCasa: Selecao;
  selecaoFora: Selecao;
  dataHora: string;       // ISO string
  fase: string;
  estadio?: string;
  golsCasa?: number | null | undefined;
  golsFora?: number | null | undefined;
  status: StatusPartida;
  meuPalpite?: Palpite | null;
}

export interface Palpite {
  id: number;
  usuarioId: number;
  partidaId: number;
  golsCasa: number;
  golsFora: number;
  pontuacao?: number | null | undefined;
  partida?: Partida;
}

export interface Usuario {
  id: number;
  name: string;         // campo real do backend
  email: string;
  avatarUrl?: string;
  role: Role;
  active: boolean;
  // campos calculados (não vêm do backend, calculados localmente)
  pontuacaoTotal?: number;
  placaresExatos?: number;
}

export interface RankingItem {
  posicao: number;
  usuarioId: number;
  nome: string;
  avatarUrl?: string;
  pontuacaoTotal: number;
  placaresExatos: number;
  souEu?: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: Usuario;  // campo real: "user", não "usuario"
}

// Dashboard montado localmente pelo app a partir de chamadas separadas
export interface DashboardResumo {
  meusPontos: number;
  minhaPosicao: number;
  totalPalpites: number;
  proximasPartidas: Partida[];
  topRanking: RankingItem[];
}