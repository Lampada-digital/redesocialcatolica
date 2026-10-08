import { getSupabase } from '../lib/supabase';
import type { Profile } from '../types/database';

export interface UpdateProfileData {
  display_name?: string;
  username?: string;
  bio?: string;
  city?: string;
  state?: string;
  country?: string;
  patron_saint?: string;
  parish_id?: string | null;
  diocese_id?: string | null;
  avatar_url?: string | null;
  cover_url?: string | null;
}

export const profileService = {
  async getProfile(userId: string): Promise<{ profile: Profile | null; error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { profile: null, error: 'Supabase não configurado' };
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) return { profile: null, error: error.message };
      return { profile: data, error: null };
    } catch (err) { return { profile: null, error: 'Erro ao buscar perfil' }; }
  },

  async getProfileByUsername(username: string): Promise<{ profile: Profile | null; error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { profile: null, error: 'Supabase não configurado' };
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('username', username).single();
      if (error) return { profile: null, error: error.message };
      return { profile: data, error: null };
    } catch (err) { return { profile: null, error: 'Erro ao buscar perfil' }; }
  },

  async updateProfile(userId: string, data: UpdateProfileData): Promise<{ profile: Profile | null; error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { profile: null, error: 'Supabase não configurado' };
    try {
      const updateData = { ...data, updated_at: new Date().toISOString() };
      const { data: profile, error } = await (supabase as any).from('profiles').update(updateData).eq('id', userId).select().single();
      if (error) return { profile: null, error: error.message };
      return { profile, error: null };
    } catch (err) { return { profile: null, error: 'Erro ao atualizar perfil' }; }
  },

  async checkUsernameAvailable(username: string): Promise<{ available: boolean; error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { available: true, error: null };
    try {
      const { data, error } = await supabase.from('profiles').select('id').eq('username', username).limit(1);
      if (error) return { available: false, error: error.message };
      return { available: !data || data.length === 0, error: null };
    } catch (err) { return { available: false, error: 'Erro ao verificar username' }; }
  },

  async uploadAvatar(userId: string, file: File): Promise<{ url: string | null; error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { url: null, error: 'Supabase não configurado' };
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { cacheControl: '3600', upsert: true });
      if (uploadError) return { url: null, error: uploadError.message };
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      await (supabase as any).from('profiles').update({ avatar_url: publicUrl, updated_at: new Date().toISOString() }).eq('id', userId);
      return { url: publicUrl, error: null };
    } catch (err) { return { url: null, error: 'Erro ao fazer upload do avatar' }; }
  },

  async uploadCover(userId: string, file: File): Promise<{ url: string | null; error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { url: null, error: 'Supabase não configurado' };
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/cover-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('covers').upload(fileName, file, { cacheControl: '3600', upsert: true });
      if (uploadError) return { url: null, error: uploadError.message };
      const { data: { publicUrl } } = supabase.storage.from('covers').getPublicUrl(fileName);
      await (supabase as any).from('profiles').update({ cover_url: publicUrl, updated_at: new Date().toISOString() }).eq('id', userId);
      return { url: publicUrl, error: null };
    } catch (err) { return { url: null, error: 'Erro ao fazer upload da capa' }; }
  },

  async searchProfiles(query: string, limit: number = 20): Promise<{ profiles: Profile[]; error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { profiles: [], error: 'Supabase não configurado' };
    try {
      const { data, error } = await supabase.from('profiles').select('*').or(`display_name.ilike.%${query}%,username.ilike.%${query}%`).limit(limit);
      if (error) return { profiles: [], error: error.message };
      return { profiles: data || [], error: null };
    } catch (err) { return { profiles: [], error: 'Erro ao buscar perfis' }; }
  },
};
