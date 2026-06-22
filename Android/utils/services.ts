import { apiFetch } from './api';
import type {
  AuthResponse,
  DashboardResumo,
  PagedResponse,
  Partida,
  Palpite,
  RankingItem,
  Usuario,
} from '@/types';

export const AuthService = {
  login: (email: string, senha: string) =>
    apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    }),

  cadastrar: (nome: string, email: string, senha: string) =>
    apiFetch<AuthResponse>('/auth/cadastrar', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha }),
    }),

  logout: () => apiFetch<void>('/auth/logout', { method: 'POST' }),
};

export const UserService = {
  meuPerfil: () => apiFetch<Usuario>('/usuarios/me'),

  atualizarPerfil: (dados: { nome?: string; fotoPerfil?: string }) =>
    apiFetch<Usuario>('/usuarios/me', {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  excluirConta: () => apiFetch<void>('/usuarios/me', { method: 'DELETE' }),
};

export const MatchService = {
  listar: () => apiFetch<Partida[]>('/partidas'),
};

export const GuessService = {
  registrar: (partidaId: number, golsA: number, golsB: number) =>
    apiFetch<Palpite>('/palpites', {
      method: 'POST',
      body: JSON.stringify({ partidaId, golsA, golsB }),
    }),

  meusPalpites: () => apiFetch<Palpite[]>('/palpites/meus'),
};

export const RankingService = {
  geral: (page: number, size: number) =>
    apiFetch<PagedResponse<RankingItem>>(`/ranking/geral?page=${page}&size=${size}`),

  minhaPosicao: () => apiFetch<RankingItem>('/ranking/me'),
};

export const DashboardService = {
  resumo: () => apiFetch<DashboardResumo>('/dashboard/resumo'),
};
