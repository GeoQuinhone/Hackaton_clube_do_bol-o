import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { Usuario } from "@/types";

interface AuthContextData {
  user: Usuario | null;
  loading: boolean;
  bootstrapping: boolean;
  login: (email: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// ─── Usuário falso para testes ────────────────────────────────────────────────
const MOCK_USER: Usuario = {
  id: 1,
  nome: "Romario Teste",
  email: "romario@teste.com",
  fotoPerfil: null,
  perfil: "USER",
  pontuacaoTotal: 120,
  placaresExatos: 3,
  criadoEm: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    // Simula a verificação de sessão (sem AsyncStorage por enquanto)
    const timer = setTimeout(() => setBootstrapping(false), 500);
    return () => clearTimeout(timer);
  }, []);

  async function login(email: string, senha: string) {
    setLoading(true);
    // Simula delay de rede
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);

    // Qualquer email/senha funciona no modo simulado
    setUser({ ...MOCK_USER, email });
  }

  async function cadastrar(nome: string, email: string, senha: string) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setUser({ ...MOCK_USER, nome, email });
  }

  async function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, bootstrapping, login, cadastrar, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
