import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthService, UserService } from "@/utils/services";
import { setToken, clearToken, getToken, ApiError } from "@/utils/api";
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);

  // Ao abrir o app, tenta restaurar a sessão a partir do token salvo
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const perfil = await UserService.meuPerfil();
          setUser(perfil);
        }
      } catch {
        await clearToken();
      } finally {
        setBootstrapping(false);
      }
    })();
  }, []);

  async function login(email: string, senha: string) {
    setLoading(true);
    try {
      const response = await AuthService.login(email, senha);
      await setToken(response.token);
      setUser(response.usuario);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError("Não foi possível conectar ao servidor", 0);
    } finally {
      setLoading(false);
    }
  }

  async function cadastrar(nome: string, email: string, senha: string) {
    setLoading(true);
    try {
      const response = await AuthService.cadastrar(nome, email, senha);
      await setToken(response.token);
      setUser(response.usuario);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError("Não foi possível conectar ao servidor", 0);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await AuthService.logout();
    } catch {
      // mesmo se falhar no servidor, limpamos localmente
    } finally {
      await clearToken();
      setUser(null);
    }
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
