import { createContext, useEffect, useState } from "react";
import type { AuthContextType, AuthResponse, User } from "../types/auth.types";
import { setAccessToken as setFetchClientAccesToken } from "../../../lib/fetchClient";
import { authService } from "../services/authService"; 

const USER_STORAGE_KEY = "@CodeConnect:user";

// Context exports are intentionally kept with the provider in this module.
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    const hydrateAuth = async () => {
      try {
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);

        if (!savedUser) {
          setIsLoading(false);
          return;
        }

        const response = await authService.refresh();
        if (response) {
          setUser(response.user);
          setAccessToken(response.accessToken);
        } else {
          setUser(null);
          setAccessToken(null);
        }
      } catch (error) {
        console.error("Error hydrating auth:", error);
        localStorage.removeItem(USER_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    void hydrateAuth();
  }, []);


  useEffect(() =>{
    setFetchClientAccesToken(accessToken)
  }, [accessToken]);

  const setAuth = (auth: AuthResponse) => {
    setUser(auth.user);
    setAccessToken(auth.accessToken);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const isAuthenticated = !!user && !!accessToken;

  const value: AuthContextType = {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    setAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
