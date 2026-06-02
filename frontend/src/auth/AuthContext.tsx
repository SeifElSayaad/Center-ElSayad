import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authStorage } from './storage';
import { AuthUser, getCurrentUser } from '../services/authApi';
import { useCartStore } from '../store/cartStore';
import { useFavoritesStore } from '../store/favoritesStore';

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
        const storedToken = await authStorage.getToken();
        
        if (storedToken) {
          // Fetch the user data with the token
          const user = await getCurrentUser();
          setState({
            isLoading: false,
            isLoggedIn: true,
            token: storedToken,
            user,
          });
          useCartStore.getState().fetchCart();
          useFavoritesStore.getState().fetchFavorites();
        } else {
          setState({ isLoading: false, isLoggedIn: false, token: null, user: null });
        }
      } catch (error) {
        // Token might be invalid or expired
        await authStorage.removeToken();
        setState({ isLoading: false, isLoggedIn: false, token: null, user: null });
      }
    })();
  }, []);

  async function signIn(token: string, user: AuthUser) {
    await authStorage.saveToken(token);
    setState({ isLoading: false, isLoggedIn: true, token, user });
    useCartStore.getState().fetchCart();
    useFavoritesStore.getState().fetchFavorites();
  }

  async function signOut() {
    await authStorage.removeToken();
    setState({ isLoading: false, isLoggedIn: false, token: null, user: null });
    useCartStore.setState({ items: [] }); // Clear local cart only
    useFavoritesStore.getState().clearFavorites(); // Clear local favorites
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
