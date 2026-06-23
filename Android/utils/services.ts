import { apiFetch } from './api';
import type { AuthResponse, DashboardResumo, PagedResponse, Partida, Palpite, RankingItem, Usuario,} from '@/types';

// ─── AUTH ────────────────────────────────────────────────────
export const AuthService = {
  login: (email: string, senha: string) =>
    apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: senha }),
    }),

  cadastrar: (name: string, email: string, senha: string) =>
    apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password:senha }),
    }),

    logout: () => apiFetch<void>('/auth/logout', {method: 'POST'}),

  recuperarSenha: (email: string) =>
    apiFetch<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  redefinirSenha: (token: string, newPassword: string) =>
    apiFetch<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),
};

export const UserService = {
  meuPerfil: () => apiFetch<Usuario>('/users/me'),

  atualizarPerfil: (dados: { name?: string; avatarUrl?: string }) =>
    apiFetch<Usuario>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  excluirConta: () =>
    apiFetch<{ message: string }>('/users/me', { method: 'DELETE' }),
};

export const MatchService = {
  listar: (status?: string, page = 0, size = 50) => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    params.set('page', String(page));
    params.set('size', String(size));
    return apiFetch<PagedResponse<Partida>>(`/partidas?${params.toString()}`);
  },

  detalhe: (id: number) => apiFetch<Partida>(`/partidas/${id}`),

  listarPorFase: (fase: string) =>
    apiFetch<Partida[]>(`/partidas/fase/${fase}`),
};

export const GuessService = {
  registrar: (partidaId: number, golsCasa: number, golsFora: number) =>
    apiFetch<Palpite>('/palpites', {
      method: 'POST',
      body: JSON.stringify({ partidaId, golsCasa, golsFora }),
    }),

  editar: (palpiteId: number, golsCasa: number, golsFora: number) =>
    apiFetch<Palpite>(`/palpites/${palpiteId}`, {
      method: 'PUT',
      body: JSON.stringify({ golsCasa, golsFora }),
    }),

  meusPalpites: () => apiFetch<Palpite[]>('/palpites/meus'),
};

export const RankingService = {
  geral: (page = 0, size = 50) =>
    apiFetch<PagedResponse<RankingItem>>(
      `/ranking/geral?page=${page}&size=${size}`
    ),

  minhaPosicao: () => apiFetch<RankingItem>('/ranking/me'),
};


export const DashboardService = {
  resumo: async (): Promise<DashboardResumo> => {
    const [partidasResp, palpites, rankingResp, minhaPos] = await Promise.allSettled([
      MatchService.listar('AGENDADA', 0, 5),
      GuessService.meusPalpites(),
      RankingService.geral(0, 5),
      RankingService.minhaPosicao(),
    ]);

    const proximasPartidas =
      partidasResp.status === 'fulfilled'
        ? partidasResp.value.content
        : [];

    const meusPalpites =
      palpites.status === 'fulfilled' ? palpites.value : [];

    const topRanking =
      rankingResp.status === 'fulfilled' ? rankingResp.value.content : [];

    const posicaoData =
      minhaPos.status === 'fulfilled' ? minhaPos.value : null;

    const meusPontos = posicaoData?.pontuacaoTotal ?? 0;
    const minhaPosicao = posicaoData?.posicao ?? 0;

    return {
      proximasPartidas,
      meusPontos,
      minhaPosicao,
      totalPalpites: meusPalpites.length,
      topRanking,
    };
  },
};