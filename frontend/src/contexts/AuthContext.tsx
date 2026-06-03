import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, setAuthToken } from "../services/api";

type User = { id: string; email: string; name?: string; role: string } | null;

const AuthContext = createContext<{
  user: User;
  loading: boolean;
  loginWithToken: (token: string, user?: User) => void;
  logout: () => void;
}>({ user: null, loading: true, loginWithToken: () => {}, logout: () => {} });

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const isBrowser = typeof globalThis.window === "object";
      const token = isBrowser ? globalThis.localStorage.getItem("pw_token") : null;
      if (token) {
        try {
          setAuthToken(token);
          const res = await getCurrentUser();
          setUser(res.user);
        } catch (err) {
          console.error("Failed to restore session", err);
          setAuthToken(null);
          setUser(null);
        } finally {
          setLoading(false);
        }
        return;
      }

      setLoading(false);
    }

    init();
  }, []);

  function loginWithToken(token: string, user?: User) {
    setAuthToken(token);
    if (user) setUser(user);
  }

  function logout() {
    setAuthToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, loginWithToken, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
