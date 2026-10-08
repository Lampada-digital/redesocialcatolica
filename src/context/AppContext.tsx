import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { Profile } from '../types/database';

// Convert Profile to User format for compatibility
function profileToUser(profile: Profile | null): any {
  if (!profile) return null;
  return {
    id: profile.id,
    name: profile.display_name,
    username: profile.username,
    avatar: profile.avatar_url || '',
    cover: profile.cover_url,
    bio: profile.bio || '',
    city: profile.city || '',
    state: profile.state || '',
    country: profile.country || 'Brasil',
    patronSaint: profile.patron_saint || '',
    parish: profile.parish_id || undefined,
    diocese: profile.diocese_id || undefined,
    interests: [],
    joinedAt: profile.created_at,
    friendsCount: 0,
    followersCount: 0,
    followingCount: 0,
    isVerified: profile.is_verified,
  };
}

interface AppState {
  isAuthenticated: boolean;
  user: any | null;
  currentPage: string;
  darkMode: boolean;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, displayName: string, username: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setCurrentPage: (page: string) => void;
  toggleDarkMode: () => void;
  authError: string | null;
  authLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user: authUser, loading: authLoading, error: authError, signIn, signUp, signOut } = useAuth();
  
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    user: null,
    currentPage: 'feed',
    darkMode: false,
  });

  // Update user when auth changes
  useEffect(() => {
    if (authUser) {
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: profileToUser(authUser.profile),
      }));
    } else {
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
      }));
    }
  }, [authUser]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    return await signIn(email, password);
  }, [signIn]);

  const register = useCallback(async (email: string, password: string, displayName: string, username: string): Promise<boolean> => {
    return await signUp(email, password, displayName, username);
  }, [signUp]);

  const logout = useCallback(async () => {
    await signOut();
    setState(prev => ({ ...prev, currentPage: 'login' }));
  }, [signOut]);

  const setCurrentPage = useCallback((page: string) => {
    setState(prev => ({ ...prev, currentPage: page }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        setCurrentPage,
        toggleDarkMode,
        authError,
        authLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
