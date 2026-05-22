import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, setAuthToken } from "../services/api";

type User = { id: string; email: string; name?: string; role: string } | null;

const AuthContext = createContext<{
  user: User;
  loading: boolean;
  loginWithToken: (token: string, user?: User) => void;
  logout: () => void;
}>({ user: null, loading: true, loginWithToken: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const token = typeof window !== "undefined" ? localStorage.getItem("pw_token") : null;
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setAuthToken(token);
        const res = await getCurrentUser();
        setUser(res.user);
      } catch (err) {
        setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
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

  return <AuthContext.Provider value={{ user, loading, loginWithToken, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
