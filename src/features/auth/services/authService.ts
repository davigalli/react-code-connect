import { fetchClient } from "../../../lib/fetchClient";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
} from "../types/auth.types";

const REFRESH_STORAGE_KEY = "@CodeConnect:refreshToken";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return fetchClient.post<AuthResponse>("/login", credentials);
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    return fetchClient.post<AuthResponse>("/register", {
        email: data.email,
        password: data.password,
        name: data.name
    });
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem(REFRESH_STORAGE_KEY);
    return Promise.resolve();
  },

  refresh: async(): Promise<AuthResponse> => {
    const refreshToken = localStorage.getItem(REFRESH_STORAGE_KEY);

    return fetchClient.post<AuthResponse>('/refresh', {
      refreshToken,
    });
  },
};
