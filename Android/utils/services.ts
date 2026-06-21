import { apiGet, apiPost, apiPut, apiDelete } from "./api";
import type {LoginResponse, Usuario, Partida, Palpite, RankingItem, DashboardResumo,Fase,StatusPartida} from "@/types/index";

// RF-001 / RF-002 / RF-003 — Autenticação
export const AuthService = {
  login: (email: string, senha: string) =>
    apiPost<LoginResponse>("/auth/login", { email, senha }),

  cadastrar: (nome: string, email: string, senha: string) =>
    apiPost<LoginResponse>("/auth/cadastro", { nome, email, senha }),

  recuperarSenha: (email: string) =>
    apiPost<void>("/auth/recuperar-senha", { email }),

  logout: () => apiPost<void>("/auth/logout"),
};

// RF-004 / RF-006 — Perfil
export const UserService = {
  meuPerfil: () => apiGet<Usuario>("/usuarios/me"),

  atualizarPerfil: (data: { nome?: string; fotoPerfil?: string }) =>
    apiPut<Usuario>("/usuarios/me", data),

  excluirConta: () => apiDelete<void>("/usuarios/me"),
};

// RF-010 / RF-011 / RF-012 / RF-013 — Partidas
export const MatchService = {
  listar: (filtros?: { fase?: Fase; status?: StatusPartida; data?: string }) => {
    const params = new URLSearchParams();
    if (filtros?.fase) params.set("fase", filtros.fase);
    if (filtros?.status) params.set("status", filtros.status);
    if (filtros?.data) params.set("data", filtros.data);
    const query = params.toString();
    return apiGet<Partida[]>(`/partidas${query ? `?${query}` : ""}`);
  },

  detalhe: (id: number) => apiGet<Partida>(`/partidas/${id}`),

  proximas: () => apiGet<Partida[]>("/partidas/proximas"),
};

// RF-020 / RF-021 / RF-023 / RF-024 — Palpites
export const GuessService = {
  registrar: (partidaId: number, golsMandante: number, golsVisitante: number) =>
    apiPost<Palpite>("/palpites", { partidaId, golsMandante, golsVisitante }),

  editar: (palpiteId: number, golsMandante: number, golsVisitante: number) =>
    apiPut<Palpite>(`/palpites/${palpiteId}`, { golsMandante, golsVisitante }),

  meusPalpites: () => apiGet<Palpite[]>("/palpites/me"),
};

// RF-032 / RF-033 / RF-034 — Ranking
export const RankingService = {
  geral: (page = 0, size = 50) =>
    apiGet<{ content: RankingItem[]; totalPages: number; totalElements: number }>(
      `/ranking?page=${page}&size=${size}`
    ),

  minhaPosicao: () => apiGet<RankingItem>("/ranking/me"),
};

// Dashboard inicial do usuário comum (agrega próximas partidas + meus palpites + top ranking)
export const DashboardService = {
  resumo: () => apiGet<DashboardResumo>("/dashboard"),
};
