import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const demoMode = import.meta.env.VITE_DEMO_MODE === 'true';

// Modo demo só é permitido quando explicitamente configurado
export const isDemoMode = demoMode;

// Validação de configuração
if (!isDemoMode) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      '❌ ERRO: Supabase não configurado!\n' +
      'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env\n' +
      'Ou defina VITE_DEMO_MODE=true para desenvolvimento local.'
    );
  }
} else {
  console.warn(
    '⚠️ MODO DEMO ATIVO: A aplicação está usando dados simulados.\n' +
    'Para produção, configure o Supabase e defina VITE_DEMO_MODE=false'
  );
}

export const supabase: SupabaseClient | null = isDemoMode
  ? null
  : createClient(supabaseUrl!, supabaseAnonKey!, {
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

export type { Database } from '../types/database';
