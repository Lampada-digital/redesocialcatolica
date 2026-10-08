import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Obter credenciais APENAS das variáveis de ambiente (configuradas na Vercel)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar se as variáveis estão configuradas corretamente
const isValidSupabaseConfig = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return false;
  }
  
  // Verificar se não são valores placeholder
  if (supabaseUrl.includes('your-project-url') || supabaseUrl.includes('example.com')) {
    console.error('❌ VITE_SUPABASE_URL está com valor placeholder. Configure com a URL real do seu projeto Supabase.');
    return false;
  }
  
  if (supabaseAnonKey.includes('your-anon-key') || supabaseAnonKey.length < 20) {
    console.error('❌ VITE_SUPABASE_ANON_KEY está com valor placeholder ou inválido. Configure com a chave real do seu projeto Supabase.');
    return false;
  }
  
  // Verificar se a URL tem formato válido
  try {
    new URL(supabaseUrl);
  } catch {
    console.error('❌ VITE_SUPABASE_URL não é uma URL válida.');
    return false;
  }
  
  return true;
};

// Cliente Supabase - será null se as variáveis não estiverem configuradas corretamente
export const supabase: SupabaseClient | null = 
  isValidSupabaseConfig()
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

// Função para obter mensagem de erro detalhada
export const getSupabaseConfigError = (): string | null => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return 'Variáveis de ambiente não configuradas. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no Vercel.';
  }
  
  if (supabaseUrl.includes('your-project-url') || supabaseUrl.includes('example.com')) {
    return 'VITE_SUPABASE_URL está com valor placeholder. Configure com a URL real do seu projeto Supabase.';
  }
  
  if (supabaseAnonKey.includes('your-anon-key') || supabaseAnonKey.length < 20) {
    return 'VITE_SUPABASE_ANON_KEY está com valor placeholder ou inválido. Configure com a chave real do seu projeto Supabase.';
  }
  
  try {
    new URL(supabaseUrl);
  } catch {
    return 'VITE_SUPABASE_URL não é uma URL válida.';
  }
  
  return null;
};

export type { Database } from '../types/database';
