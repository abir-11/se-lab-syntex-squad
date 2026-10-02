"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Role = "guest" | "student" | "mentor" | "faculty" | "admin";

interface AuthUser {
  role: Role;
  name: string;
  dept: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  isLoggedIn: boolean;
  /** true while the initial localStorage hydration is in progress */
  hydrated: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoggedIn: false,
  hydrated: false,
});

const STORAGE_KEY = "uiu_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  // hydrated prevents a flash of the logged-out state on first paint
  const [hydrated, setHydrated] = useState(false);

  // Runs only in the browser — safe for SSR/SSG
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // malformed JSON — ignore and stay logged out
    } finally {
      setHydrated(true);
    }
  }, []);

  const login = (u: AuthUser) => {
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {
      // storage quota or private-browsing restriction — silently continue
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoggedIn: !!user, hydrated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
