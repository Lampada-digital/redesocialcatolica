import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Cache do cliente Supabase
let supabaseClient: SupabaseClient | null = null;

// Função para obter o cliente Supabase
export const getSupabase = (): SupabaseClient | null => {
  // Se já temos um cliente em cache, retornar ele
  if (supabaseClient) {
    return supabaseClient;
  }

  // Tentar obter credenciais das variáveis de ambiente primeiro
  let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Se não estiverem nas variáveis de ambiente, tentar do localStorage
  if (!supabaseUrl || !supabaseAnonKey) {
    supabaseUrl = localStorage.getItem('supabase_url') || '';
    supabaseAnonKey = localStorage.getItem('supabase_anon_key') || '';
  }

  // Criar cliente se tivermos credenciais
  if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
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
    });
    return supabaseClient;
  }

  return null;
};

// Exportar o cliente como uma propriedade getter para compatibilidade
export const supabase: SupabaseClient | null = getSupabase();

// Função para verificar se o Supabase está configurado
export const isSupabaseConfigured = (): boolean => {
  return getSupabase() !== null;
};

// Função para limpar configurações (útil para troubleshooting)
export const clearSupabaseConfig = (): void => {
  localStorage.removeItem('supabase_url');
  localStorage.removeItem('supabase_anon_key');
  supabaseClient = null;
};

// Função para reinicializar o cliente (após configurar credenciais)
export const resetSupabaseClient = (): void => {
  supabaseClient = null;
};

export type { Database } from '../types/database';
