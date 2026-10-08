import { useState, useEffect, useCallback } from 'react';
import { authService, type AuthUser } from '../services/authService';

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, displayName: string, username: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const initAuth = async () => {
      try {
        const { user: authUser } = await authService.getSession();
        setUser(authUser);
      } catch (err) {
        console.error('Erro ao inicializar autenticação:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { unsubscribe } = authService.onAuthStateChange((authUser) => {
      setUser(authUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    setError(null);
    const { user: authUser, error: authError } = await authService.signIn({ email, password });
    
    if (authError) {
      setError(authError);
      return false;
    }

    setUser(authUser);
    return true;
  }, []);

  const signUp = useCallback(async (
    email: string,
    password: string,
    displayName: string,
    username: string
  ): Promise<boolean> => {
    setError(null);
    const { user: authUser, error: authError } = await authService.signUp({
      email,
      password,
      displayName,
      username,
    });
    
    if (authError) {
      setError(authError);
      return false;
    }

    setUser(authUser);
    return true;
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    const { error: signOutError } = await authService.signOut();
    
    if (signOutError) {
      setError(signOutError);
      return;
    }

    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    setError(null);
    const { error: resetError } = await authService.resetPassword(email);
    
    if (resetError) {
      setError(resetError);
      return false;
    }

    return true;
  }, []);

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}
