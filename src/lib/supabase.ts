import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação de configuração - OBRIGATÓRIA
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '❌ ERRO CRÍTICO: Supabase não configurado!\n' +
    'A aplicação REQUER configuração do Supabase para funcionar.\n' +
    'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env\n' +
    'Obtenha as credenciais em: https://supabase.com/dashboard/'
  );
}

// Cliente Supabase - SEM modo demo
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

export type { Database } from '../types/database';
