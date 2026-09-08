import { createContext, useEffect, useState } from "react";

import type {
  AuthContextType,
  AuthResponse,
  User,
} from "../types/auth.types";

import {
  setAccessToken as setFetchClientAccessToken,
} from "../../../lib/fetchClient";

const AUTH_STORAGE_KEY = "@CodeConnect:auth";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Recupera usuário e access token ao abrir a aplicação
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);

      if (!savedAuth) {
        return;
      }

      const parsedAuth: AuthResponse = JSON.parse(savedAuth);

      setUser(parsedAuth.user);
      setAccessToken(parsedAuth.accessToken);
    } catch (error) {
      console.error("Erro ao recuperar autenticação:", error);

      localStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sincroniza o token do Context com o fetchClient
  useEffect(() => {
    setFetchClientAccessToken(accessToken);
  }, [accessToken]);

  const setAuth = (auth: AuthResponse) => {
    setUser(auth.user);
    setAccessToken(auth.accessToken);

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);

    setFetchClientAccessToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const isAuthenticated = Boolean(user && accessToken);

  const value: AuthContextType = {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    setAuth,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}