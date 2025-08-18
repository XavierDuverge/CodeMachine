// app/_layout.tsx
import { Slot } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const API_URL = "https://adamix.net/medioambiente";

type UsuarioAPI = {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
};

type User = {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  fullName: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (correo: string, password: string) => Promise<void>;
  register: (p: {
    cedula: string;
    nombre: string;
    apellido: string;
    correo: string;
    password: string;
    telefono: string;
    matricula: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  apiFetch: (path: string, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType>({} as any);
export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehidratar sesión
  useEffect(() => {
    (async () => {
      try {
        const [t, u] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(USER_KEY),
        ]);
        if (t) setToken(t);
        if (u) setUser(JSON.parse(u));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Mappers
  const mapUsuario = (u: UsuarioAPI): User => ({
    ...u,
    fullName: `${u.nombre} ${u.apellido}`.trim(),
  });

  // Helpers
  const safeJson = async (res: Response) => {
    try { return await res.json(); } catch { return null; }
  };

  const persistSession = async (t: string, u: UsuarioAPI) => {
    const mapped = mapUsuario(u);
    setToken(t);
    setUser(mapped);
    await SecureStore.setItemAsync(TOKEN_KEY, t);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(mapped));
  };

  // LOGIN real
  const login: AuthContextType["login"] = async (correo, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ correo, password }),
    });
    if (!res.ok) {
      const err = await safeJson(res);
      throw new Error(err?.error || `Login failed (${res.status})`);
    }
    const data = (await res.json()) as { token: string; usuario: UsuarioAPI };
    await persistSession(data.token, data.usuario);
  };

  // REGISTER real (y autologin con token devuelto)
  const register: AuthContextType["register"] = async (payload) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    // La API documenta 201 con { token, usuario }
    if (res.status !== 201) {
      const err = await safeJson(res);
      throw new Error(err?.error || `Register failed (${res.status})`);
    }
    const data = (await res.json()) as { token: string; usuario: UsuarioAPI };
    await persistSession(data.token, data.usuario);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  };

  // Wrapper para peticiones autenticadas
  const apiFetch: AuthContextType["apiFetch"] = async (path, init = {}) => {
    const headers = new Headers(init.headers || {});
    headers.set("Accept", "application/json");
    if (!(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(`${API_URL}${path.startsWith("/") ? "" : "/"}${path}`, { ...init, headers });
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, apiFetch }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      <Slot />
    </AuthContext.Provider>
  );
}
