import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Obter credenciais APENAS das variáveis de ambiente (configuradas na Vercel)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cliente Supabase - será null se as variáveis não estiverem configuradas
export const supabase: SupabaseClient | null = 
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      })
    : null;

// Função para verificar se o Supabase está configurado
export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};

export type { Database } from '../types/database';
