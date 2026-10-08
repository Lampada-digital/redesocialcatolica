import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const demoMode = import.meta.env.VITE_DEMO_MODE === 'true';

export const isDemoMode = demoMode || !supabaseUrl || !supabaseAnonKey;

if (!isDemoMode && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn(
    '⚠️ Supabase não configurado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env'
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
