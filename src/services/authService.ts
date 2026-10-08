import { getSupabase } from '../lib/supabase';
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

export const authService = {
  async signUp(data: SignUpData): Promise<{ user: AuthUser | null; error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { user: null, error: 'Supabase não configurado. Por favor, configure suas credenciais.' };
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
    const supabase = getSupabase();
    if (!supabase) {
      return { user: null, error: 'Supabase não configurado. Por favor, configure suas credenciais.' };
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
    const supabase = getSupabase();
    if (!supabase) {
      return { error: 'Supabase não configurado' };
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
    const supabase = getSupabase();
    if (!supabase) {
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
    const supabase = getSupabase();
    if (!supabase) {
      return { error: 'Supabase não configurado' };
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
    const supabase = getSupabase();
    if (!supabase) {
      return { error: 'Supabase não configurado' };
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
    const supabase = getSupabase();
    if (!supabase) {
      return { unsubscribe: () => {} };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
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
