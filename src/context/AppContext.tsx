import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { currentUser, notifications, posts, type User, type Post, type Notification } from '../data/mockData';

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  currentPage: string;
  notifications: Notification[];
  posts: Post[];
  darkMode: boolean;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setCurrentPage: (page: string) => void;
  toggleDarkMode: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  likePost: (id: string) => void;
  addPost: (content: string) => void;
  unreadNotifications: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    user: null,
    currentPage: 'feed',
    notifications,
    posts,
    darkMode: false,
  });

  const login = useCallback((email: string, _password: string) => {
    if (email) {
      setState(prev => ({ ...prev, isAuthenticated: true, user: currentUser }));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, isAuthenticated: false, user: null, currentPage: 'login' }));
  }, []);

  const setCurrentPage = useCallback((page: string) => {
    setState(prev => ({ ...prev, currentPage: page }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true })),
    }));
  }, []);

  const likePost = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      posts: prev.posts.map(p =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      ),
    }));
  }, []);

  const addPost = useCallback((content: string) => {
    if (!state.user) return;
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: state.user,
      content,
      likes: 0,
      comments: 0,
      shares: 0,
      visibility: 'PUBLIC',
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, posts: [newPost, ...prev.posts] }));
  }, [state.user]);

  const unreadNotifications = state.notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        setCurrentPage,
        toggleDarkMode,
        markNotificationRead,
        markAllNotificationsRead,
        likePost,
        addPost,
        unreadNotifications,
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
