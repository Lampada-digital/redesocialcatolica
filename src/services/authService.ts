import { supabase, isDemoMode } from '../lib/supabase';
import type { Profile } from '../types/database';

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
  username: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  profile: Profile | null;
}

// Demo mode fallback
const DEMO_USER: AuthUser = {
  id: 'demo-user-id',
  email: 'demo@communio.app',
  profile: {
    id: 'demo-user-id',
    username: 'mariasilva',
    display_name: 'Maria Silva',
    avatar_url: null,
    cover_url: null,
    bio: 'Católica apaixonada pela Eucaristia. Membro da Pastoral da Juventude.',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    patron_saint: 'Nossa Senhora Aparecida',
    parish_id: null,
    diocese_id: null,
    is_verified: false,
    verification_badge: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

export const authService = {
  async signUp(data: SignUpData): Promise<{ user: AuthUser | null; error: string | null }> {
    if (isDemoMode || !supabase) {
      // Demo mode: simulate sign up
      return {
        user: {
          ...DEMO_USER,
          email: data.email,
          profile: {
            ...DEMO_USER.profile!,
            display_name: data.displayName,
            username: data.username,
          },
        },
        error: null,
      };
    }

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.displayName,
            username: data.username,
          },
        },
      });

      if (error) return { user: null, error: error.message };
      if (!authData.user) return { user: null, error: 'Erro ao criar conta' };

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      return {
        user: {
          id: authData.user.id,
          email: data.email,
          profile,
        },
        error: null,
      };
    } catch (err) {
      return { user: null, error: 'Erro inesperado ao criar conta' };
    }
  },

  async signIn(data: SignInData): Promise<{ user: AuthUser | null; error: string | null }> {
    if (isDemoMode || !supabase) {
      // Demo mode: simulate sign in
      return { user: DEMO_USER, error: null };
    }

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) return { user: null, error: error.message };
      if (!authData.user) return { user: null, error: 'Credenciais inválidas' };

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      return {
        user: {
          id: authData.user.id,
          email: data.email,
          profile,
        },
        error: null,
      };
    } catch (err) {
      return { user: null, error: 'Erro inesperado ao fazer login' };
    }
  },

  async signOut(): Promise<{ error: string | null }> {
    if (isDemoMode || !supabase) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: 'Erro ao fazer logout' };
    }
  },

  async getSession(): Promise<{ user: AuthUser | null }> {
    if (isDemoMode || !supabase) {
      return { user: null };
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return { user: null };

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      return {
        user: {
          id: session.user.id,
          email: session.user.email || '',
          profile,
        },
      };
    } catch (err) {
      return { user: null };
    }
  },

  async resetPassword(email: string): Promise<{ error: string | null }> {
    if (isDemoMode || !supabase) {
      return { error: null }; // Demo mode: always succeeds
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: 'Erro ao enviar email de recuperação' };
    }
  },

  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    if (isDemoMode || !supabase) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: 'Erro ao atualizar senha' };
    }
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void): { unsubscribe: () => void } {
    if (isDemoMode || !supabase) {
      return { unsubscribe: () => {} };
    }

    const supa = supabase;
    const { data: { subscription } } = supa.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supa
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        callback({
          id: session.user.id,
          email: session.user.email || '',
          profile,
        });
      } else if (event === 'SIGNED_OUT') {
        callback(null);
      }
    });

    return {
      unsubscribe: () => {
        subscription.unsubscribe();
      },
    };
  },
};
