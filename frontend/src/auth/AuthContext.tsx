import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authStorage } from './storage';
import { AuthUser } from '../services/authApi';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  isLoading: boolean;       // true while reading the stored token on startup
  isLoggedIn: boolean;
  token: string | null;
  user: AuthUser | null;
}

interface AuthContextValue extends AuthState {
  /** Call after a successful login or register */
  signIn: (token: string, user: AuthUser) => Promise<void>;
  /** Call when the user taps Logout */
  signOut: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isLoggedIn: false,
    token: null,
    user: null,
  });

  // On mount, try to restore a persisted token
  useEffect(() => {
    (async () => {
      try {
        const stored = await authStorage.getToken();
        setState({
          isLoading: false,
          isLoggedIn: !!stored,
          token: stored,
          user: null, // We don't persist the user object (could be added later)
        });
      } catch {
        setState({ isLoading: false, isLoggedIn: false, token: null, user: null });
      }
    })();
  }, []);

  async function signIn(token: string, user: AuthUser) {
    await authStorage.saveToken(token);
    setState({ isLoading: false, isLoggedIn: true, token, user });
  }

  async function signOut() {
    await authStorage.removeToken();
    setState({ isLoading: false, isLoggedIn: false, token: null, user: null });
  }

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
